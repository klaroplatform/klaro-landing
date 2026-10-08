// learnklaro.com's Worker script. Files are served straight from the static assets without it;
// it runs for two things only (wrangler.jsonc, design/brief/cloudflare.md §2.5):
//
// 1. Videos (/media/*.mp4 and /demo/*.mp4, "run_worker_first"). Workers static assets answer a
//    Range request with the whole file and status 200. Players need 206 and just those bytes to
//    seek, and Safari on iPhone can refuse to play a video otherwise. Here the bytes are cut from
//    the file. (Omar's worker.js on main, 8a428a9, does the same; this file replaces it.)
// 2. URLs that match no file ("not_found_handling": "none" sends every miss here). They get the 404
//    page with status 404 and "Cache-Control: no-store". The assets' own 404 would carry the
//    folder's _headers Cache-Control (a day under /media/, a year under /showcase/assets/), and a
//    browser would keep that 404 even after the file is deployed.
//
// No build step: wrangler bundles this file on deploy. Keep it free of imports.

export default {
  async fetch(request, env) {
    const range = request.method === "GET" ? request.headers.get("Range") : null;
    const ifRange = request.headers.get("If-Range");

    // Ask the assets without Range: they ignore it, and the full answer carries the _headers.
    const headers = new Headers(request.headers);
    headers.delete("Range");
    headers.delete("If-Range");
    const asset = await env.ASSETS.fetch(new Request(request, { headers }));

    if (asset.status === 404) return notFound(request, env);
    if (asset.status !== 200 || !/\.mp4$/i.test(new URL(request.url).pathname)) return asset;
    if (!range || (ifRange && ifRange !== asset.headers.get("ETag"))) return withRanges(asset);

    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!match || (match[1] === "" && match[2] === "")) return withRanges(asset); // several ranges: send it whole

    // The Worker can't see the file's size before reading it (the assets send no Content-Length
    // here), so read it once, keeping only the bytes asked for: a small range costs little memory.
    const suffix = match[1] === "" ? Number(match[2]) : null; // "bytes=-N": the last N bytes
    const first = suffix === null ? Number(match[1]) : 0;
    const last = suffix === null && match[2] !== "" ? Number(match[2]) : Infinity;
    const { size, parts } = await readBytes(asset.body, first, last);
    const start = suffix === null ? first : Math.max(0, size - suffix);
    const end = Math.min(last, size - 1);
    if (start >= size || start > end) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}`, "Cache-Control": "no-store" },
      });
    }

    const out = new Headers(asset.headers);
    out.delete("Content-Encoding");
    out.set("Accept-Ranges", "bytes");
    out.set("Content-Range", `bytes ${start}-${end}/${size}`);
    out.set("Content-Length", String(end - start + 1));
    const body = suffix === null ? new Blob(parts) : new Blob(parts).slice(start, end + 1);
    return new Response(body, { status: 206, headers: out });
  },
};

/** The whole video, saying that ranges are welcome. */
function withRanges(response) {
  const out = new Response(response.body, response);
  out.headers.set("Accept-Ranges", "bytes");
  return out;
}

/** The 404 page (404.html, served at /404), never stored by a browser or a cache. */
async function notFound(request, env) {
  const method = request.method === "HEAD" ? "HEAD" : "GET";
  const page = await env.ASSETS.fetch(new Request(new URL("/404", request.url), { method }));
  const headers = new Headers(page.headers);
  headers.set("Cache-Control", "no-store");
  headers.delete("ETag");
  return new Response(page.status === 200 ? page.body : null, { status: 404, headers });
}

/** Reads a whole stream; returns its size and the chunks that fall in bytes first..last. */
async function readBytes(body, first, last) {
  const reader = body.getReader();
  const parts = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const from = size;
    size += value.byteLength;
    if (size <= first || from > last) continue;
    parts.push(value.subarray(Math.max(0, first - from), Math.min(value.byteLength, last + 1 - from)));
  }
  return { size, parts };
}
