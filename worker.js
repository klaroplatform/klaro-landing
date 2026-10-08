// The site is static files (wrangler.jsonc). This Worker runs only for the videos (/demo/* and
// /media/*): their players seek (the showcase's lectures, the examples, and the frame-by-frame
// playback when a phone or Safari in Low Power Mode refuses to play), and seeking needs Range
// requests answered with 206 and just those bytes. Workers static assets send the whole file.

export default {
  async fetch(request, env) {
    const range = request.method === 'GET' ? request.headers.get('Range') : null;
    const asset = await env.ASSETS.fetch(request.url);
    if (!range || asset.status !== 200) return ranged(asset);

    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!match || (match[1] === '' && match[2] === '')) return ranged(asset);

    const body = await asset.arrayBuffer();
    const size = body.byteLength;
    let start;
    let end;
    if (match[1] === '') {
      // The last N bytes.
      start = Math.max(0, size - Number(match[2]));
      end = size - 1;
    } else {
      start = Number(match[1]);
      end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
    }
    if (start >= size || start > end) {
      return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    }

    const headers = new Headers(asset.headers);
    headers.delete('Content-Encoding');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(new Uint8Array(body, start, end - start + 1), { status: 206, headers });
  },
};

/** The whole file, saying that ranges are welcome. */
function ranged(response) {
  const out = new Response(response.body, response);
  out.headers.set('Accept-Ranges', 'bytes');
  return out;
}
