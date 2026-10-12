# Klaro landing

The public website for Klaro, at https://klaroplatform.com (https://learnklaro.com serves the same site;
the canonical address, in every canonical link, Open Graph URL, sitemap entry and JSON-LD node, is klaroplatform.com). Klaro links a tutor's own lectures, book
and past papers, so students study them side by side.

The site is plain HTML, CSS and a little JavaScript. There is no build step: every page is a
complete file, served as it is. A small Python tool stamps the shared parts into each page and
writes the metadata (see [How pages are built](#how-pages-are-built)).

The redesign that produced this site is planned in `design/brief/`. Start with
`design/brief/README.md`.

## The pages

| Address | File | What it is |
|---|---|---|
| `/` | `index.html` | Home for tutors |
| `/students/` | `students/index.html` | Home for students and parents |
| `/products/` | `products/index.html` | All products, grouped by audience |
| `/products/<name>/` | `products/<name>/index.html` | One page per product. For tutors: `course-builder`, `live-sessions`, `quizzes`, `marking`. For students: `study-view` (also for tutors), `practice-questions`, `minis`, `progress` |
| `/research/` | `research/index.html` | "Powered by research": the learning principles Klaro is built on, with real sources |
| `/try/` | `try/index.html` | The study view on a sample course, full screen |
| `/market/` | `market/` | The course catalogue. Its courses, tutors and prices are examples for now, and the page says so. Linked from the footer only |
| any unknown URL | `404.html` | The 404 page. Its links start with `/`, because it is served at any depth |
| `/v1/` | `v1/` | The previous landing, frozen for reference: noindex, never stamped |

Shared by every page:

- `klaro.css`: tokens, base styles, type and buttons. The app tokens in `:root` come from the app's
  own design system; change them only when the app changes.
- `site.css`: every site component, built on `klaro.css`.
- `klaro.js`: the links into the app, the header's hairline on scroll and the FAQ.
- `site.js`: the header menus, the join code, carousels, illustration plates and scroll reveal.
- `showcase.js`: the live app frames and the recordings (see [The showcase](#the-showcase-and-the-recordings)).
- `partials/`: the header, footer and icon sprite that `tools/site.py` copies into each page.

Page rhythm (2026-10-12): after the hero, every second `<section class="section">` also carries
`section--white` (a white band between two hairlines); a page's closing call (`.closing`) sits on a
lavender band by itself. A section's title may have a short eyebrow above it, `<p class="eyebrow">`
(`eyebrow--deep` on the deep panel); it never repeats the title. Headings, copy colour and the fluid
type steps are tokens at the top of the "Hierarchy, bands and the beta marks" block at the end of
`site.css`. The "Free beta" pill is in the header and footer partials; the hero line under the
buttons is `<p class="beta-note">`.

Not pages: `showcase/`, `demo/`, `media/`, `brand/` and `illustrations/` hold the showcase and
its files; `img/` holds images (`img/ill/` is the cut-paper illustrations); `design/`, `partials/`
and `tools/` are kept off the site.

## How pages are built

Run the tool after you change a page, a partial or `tools/site.json`. It uses the Python 3
standard library only.

```sh
python3 tools/site.py                    # stamp every page, write sitemap.xml and llms.txt, then check
python3 tools/site.py research/index.html # stamp only these pages (sitemap and llms.txt are still rewritten)
python3 tools/site.py --check            # write nothing; exit 1 if anything is stale or breaks a rule
python3 tools/site.py --report           # every page's title and description, with lengths
```

What it does:

- **Shared parts.** It copies the partials into each page between markers:
  `<!-- chrome:sprite -->`, `<!-- chrome:header -->` and `<!-- chrome:footer -->`. Edit the
  partial, not the copy in the page.
- **Metadata.** Each page owns its `<title>` and `<meta name="description">`. The tool fills the
  `<!-- chrome:meta -->` block under them: canonical, hreflang, Open Graph, icons, the app address
  and one JSON-LD graph. The JSON-LD includes FAQPage from a page's visible FAQ, an Article with
  citations on the research page, and a VideoObject for each recording.
- **Fonts.** The Google Fonts links are the tool's too: it writes them at the end of the meta block
  for the page's language (`tools/site.json` `"fonts"`; Readex Pro, the Arabic face, only on
  Arabic pages) and removes any font link a page writes in its own `<head>`.
- **Illustration sizes.** With `"srcset": {"on": true}` in `tools/site.json`, every `<img>` of a
  full-size illustration (`img/ill/NN-name.webp`, 1200px) gets a `srcset` of its `-480` and `-800`
  versions, and `sizes`. Set it to `false` and run the tool to take them off.
- **App links.** The app's address lives once, in `tools/site.json` (`"app"`). The tool writes it
  into every link marked `data-signup`, `data-signup-as`, `data-signin` or `data-legal`, so the
  links work without JavaScript.
- **sitemap.xml and llms.txt.** Both are written from the pages and `tools/site.json`. A page is in
  them unless `site.json` sets `"index": false` for it or `.assetsignore` keeps it off the site.
  `robots.txt` is written by hand.

`--check` fails when:

- a stamped file, `sitemap.xml` or `llms.txt` is out of date;
- a title is over 60 characters, or a description is outside 50–160 characters;
- two indexable pages share a title or a description;
- a page doesn't have exactly one `<h1>`;
- an `<img>` has no `alt`;
- the JSON-LD doesn't parse, or uses a type or property schema.org doesn't have;
- an internal link, asset or `#fragment` doesn't resolve, or points at a file kept off the site;
- a link is `href="#"`;
- a live app frame or recording (`.show-screen`, `.rec-screen`) has no `data-nosnippet`;
- any page, or `site.json`, mentions AI. The site never does;
- `<html lang>` and `dir` don't match the folder (`ar/` pages are `lang="ar" dir="rtl"`), or an
  Arabic page breaks the rules in `design/brief/arabic.md`.

## The showcase and the recordings

The pages show the real Klaro app, not drawn mock-ups.

- **`showcase/`** is a build of the app running on sample data, with no accounts. Pages frame
  `showcase/showcase.html` from the same origin, and `showcase.js` drives it. It is built from the
  app and copied in: don't edit it by hand. The site never stamps or checks it.
- The showcase asks for its files at root paths, so `/showcase/`, `/demo/` (the sample lectures and
  book), `/media/`, `/brand/` and `/illustrations/` are taken. No page can live there.
- **Recordings** are in `media/`: `<name>.mp4`, a poster image, and `<name>.json` with the caption
  cue times. `media/stills/` holds still frames.
- **The markup** is documented at the top of `showcase.js`: a live scene is
  `figure.show[data-showcase]`, a recording is `figure.rec[data-recording]`. Phones get
  `data-phone-recording` instead of the live app.
- **The app is always whole.** A recording is contained in its screen (at the top, on the app's
  own page colour), and the live app is drawn to the screen's shape. Nothing zooms inside a screen.
- **The camera** moves the whole picture instead: the scene plate, with its drawn device and the
  app in it, inside the plate's frame, like walking up to the desk. `data-camera="amount [fx fy]"`
  on a figure: 0 is the whole scene, 1 is the drawn screen (plus a little bezel) filling the frame,
  never more, so the app is never cut; `fx fy` is the point of the screen to lean towards.
  A recording rests on the whole scene, walks in before it plays, holds while it plays and walks
  back out after it ends; a still on a plate walks in once. `data-camera-narrow` is the same for
  screens narrower than 480px. With reduced motion the camera never moves. Each walk is one scale
  about one fixed point (set before it starts), on one ease-in-out curve, run by the compositor:
  the picture never drifts one way and then the other, and nothing (the plate's picture, the
  video) changes under it.
- **Motion tokens.** Every duration and curve is a token at the top of the Motion block in
  `site.css` (`--ease-ui`, `--ease-inout`, `--ease-camera`, `--dur-fast`, `--dur-ui`, `--dur-slow`,
  `--dur-camera`, `--dur-camera-out`); `showcase.js` reads the camera's from there.
- **Phone-sized recordings.** A recording plays `media/<name>-sm.mp4` (960 × 600, H.264,
  `+faststart`; about a sixth of the bytes) whenever it is drawn at no more than about 960 device
  pixels across (its screen, times the camera's zoom, times the pixel ratio), and the full file
  otherwise; its poster's `srcset` picks `media/<name>-poster-sm.webp`. Recordings fetch nothing
  until the visitor's first scroll, tap or key, so a page that opens on one costs only its poster.
  A new recording needs both:
  `ffmpeg -i media/<name>.mp4 -vf scale=960:600:flags=lanczos -c:v libx264 -preset slower -crf 27 -g 90 -pix_fmt yuv420p -movflags +faststart -an media/<name>-sm.mp4`.
- **The live app and the keyboard.** During the visitor's turn the frame takes a pointer at once,
  but the Tab key and screen readers skip it until the visitor taps in it or presses "Use the
  sample app with the keyboard" (it shows when it has focus).
- **Scene plates** (`img/plates/`) draw the whole device; `site.css` holds each one's screen box
  and opts it in (`--drawn: 1`). Add `?ph` to a page's address to see the placeholder file names
  on tiles and plates that have no picture yet. Visitors never see them.
- **Phone recordings** were made with the scripts in `tools/rec/`. They drive the showcase in a
  test browser and need Node, Playwright (`KLARO_PLAYWRIGHT` points at an install) and ffmpeg. See
  `tools/rec/README.md`.
- Media and images are cached for a day or more. To change one, give the new file a new name.

## Local preview

```sh
node tools/serve.cjs 8091
# open http://127.0.0.1:8091/
```

`tools/serve.cjs` answers byte-range requests, as Cloudflare does, so videos can seek. Python's
`http.server` serves the pages too, but videos won't seek on it.

## Hosting and deploys

The site is served by Cloudflare Workers static assets: a Worker named `klaro-landing`. The
repository root is the site, and files are answered straight from it.

- **`worker/index.js`**: a small script that runs only for videos (`/media/*.mp4`, `/demo/*.mp4`)
  and for URLs that match no file. Videos get Range answers (206), so players can seek; misses get
  `404.html` with `Cache-Control: no-store`, so a browser never keeps a 404 for a file that is
  added later.
- **`wrangler.jsonc`**: the Worker, its custom domains, which requests run the script first, and
  trailing-slash handling. It keeps Version URLs on, so a version can be checked before it goes live.
- **`.assetsignore`**: what Cloudflare must not publish. Notes, `design/`, `partials/`, `tools/`,
  `worker/`, every `*.md` file and the tooling configs stay off the site. Anything not listed here
  goes live.
- **`_headers`**: security headers, cache rules and `noindex` rules (Version URLs, `showcase/`,
  `demo/`, `v1/`). Cloudflare reads it and never serves it. Never set the same header in two blocks
  that can match one URL: Cloudflare joins the values.

**Previews.** Upload a version without deploying it. Do it from a clean checkout (a `git worktree`),
because other work may be in the folder:

```sh
CLOUDFLARE_ACCOUNT_ID=<account id> npx wrangler versions upload --preview-alias new-site
```

It prints a version URL and the `new-site` alias URL. Both are public and marked `noindex`. The
account, the wrangler login and the full steps are in `design/brief/cloudflare.md`.

**Production.** The site has two deploy targets, in `wrangler.jsonc`: the default one (learnklaro.com)
and `--env klaroplatform` (klaroplatform.com, the canonical address, in the other Cloudflare account).
Once Workers Builds is connected, every push to `main` deploys learnklaro.com. Until then, production
is deployed by hand: ask the owner first. Never run `wrangler deploy` or
`wrangler versions deploy` for a preview; both replace the live site. Rollback steps are in
`design/brief/cloudflare.md`.

GitHub Pages used to serve this repository. It is being retired; `_config.yml` only serves it until
then.

## Languages

The site is in English for now. Arabic comes last, as `ar/` twins of the English pages
(`page/` and `ar/page/`):

- The Arabic header and footer (`partials/*.ar.html`) and the right-to-left CSS in `site.css` are
  ready.
- The language links in the English partials are commented out, marked `arabic-later`.
- `tools/site.py` adds hreflang only when both twins exist, and checks the Arabic rules.
- The style guide and glossary are in `design/brief/arabic.md`.
