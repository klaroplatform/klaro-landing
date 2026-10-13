// learnklaro.com's Worker script: every request is sent to the same address on klaroplatform.com,
// the canonical site, with a permanent redirect. Path and query string are kept, so old links and
// bookmarks (learnklaro.com/products/quizzes/?x=1) land on the same page. The default target in
// wrangler.jsonc runs this script with no static assets; klaroplatform.com keeps worker/index.js.
//
// No build step: wrangler bundles this file on deploy. Keep it free of imports.

const CANONICAL = "https://klaroplatform.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // 301 for GET and HEAD (what browsers and search engines expect); 308 keeps any other method.
    const status = request.method === "GET" || request.method === "HEAD" ? 301 : 308;
    return new Response(null, {
      status,
      headers: {
        Location: CANONICAL + url.pathname + url.search,
        "Cache-Control": "public, max-age=86400",
      },
    });
  },
};
