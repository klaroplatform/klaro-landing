# Cloudflare: how learnklaro.com is deployed

Checked on 2026-10-08 (§2.5 and §3.1 re-checked at 19:40 UTC). The SEO side of the same settings
is in `design/brief/seo-geo.md` §5 (a local file, not in git).

The plan:

- learnklaro.com is served by the Worker `klaro-landing`: static files, plus a small script for
  video Range requests and 404s (§2.5).
- Every push to `main` deploys it automatically (Workers Builds).
- GitHub Pages is shut down.
- The repository goes private.

---

## 1. State today

### 1.1 Accounts and access

| What | Finding |
|---|---|
| Wrangler on this Mac | Two auth profiles, both the Klaroplatform login. **`default`** covers only the first account, "Klaroplatform's Account" (`bbcdececfdc25f78201b3be407c7de6e`); the app repositories use it. **`learnklaro`** (made by the owner on 2026-10-08) covers both accounts and is bound to this repository's folder |
| Using the `learnklaro` profile | Inside the repository folder it applies by itself. From any other folder, such as a scratch worktree, add `--profile learnklaro` to every wrangler command. Always set `CLOUDFLARE_ACCOUNT_ID=8f32b3259e15052339fe39a63baa1cca`, because the profile sees two accounts |
| The second account (`8f32b3259e15052339fe39a63baa1cca`) | Holds the zone `learnklaro.com` and two Workers: **`klaro-landing`** (ours) and `fund-389`. `fund-389` serves another site (omaraskar.com): never touch it |
| Account workers.dev subdomain | **`learnklaro`** (`*.learnklaro.workers.dev`), registered on 2026-10-08 with the owner's approval. Until then the account had none, so no Version URLs could exist. It is account-wide, but `klaro-landing` keeps workers.dev off (Version URLs only) and `fund-389` has both off, so nothing else became reachable |
| learnklaro.com zone | Id `d68dee8079f81328efe12358e4f62c5f`, **Free plan**, active. Nameservers `toby` / `rachel.ns.cloudflare.com` |
| Zone settings | The wrangler login can't read them (no zone-settings scope): Always Use HTTPS, SSL mode, bot settings, redirect rules and DNS all answer "Authentication error". The owner checks them in the dashboard (§5) |
| First account | Workers `klaro-web-staging`, `klaro-api-staging`, `klaro-correction-runner`, `klaro-annotate`, `radioscribe-demo`; zone `klaroplatform.com`; workers.dev subdomain `klaroplatform`. Nothing of the landing site's |
| Workers Builds (Git integration) | Not visible from the CLI. **Not connected**: the only deployment came from a manual upload (§1.2) |
| GitHub | `klaroplatform/klaro-landing` is **public**, owned by the personal GitHub account `klaroplatform`. Pages is on, building `main` from `/` (legacy Jekyll build), live at `https://klaroplatform.github.io/klaro-landing/` |

### 1.2 The Worker `klaro-landing`

| Setting | Value |
|---|---|
| Live deployment | Version **`e5660ed5-6e6b-4bba-957c-99bb5178c205`** at 100%: **Omar's landing** from `main` (`origin/main` `8a428a9`, with his Range Worker `worker.js` for `/demo/*` and `/media/*`, §3.1), deployed by hand on 2026-10-08 at 12:28 UTC (a first try, `6820e291-…`, went out at 12:26). Before that: `6fd94dd8-23d8-4d96-9a50-6d1a1a068155`, the old one-page site, deployed 2026-10-03. `e5660ed5` is the version to roll back to if the redesign's go-live goes wrong |
| Preview versions | **`05deebdb-3048-4063-b32a-6700a642a444`**: the `redesign` branch at `51fd4d8` plus `worker/index.js` and its config (§2.5, not committed when uploaded), alias `new-site`, uploaded 2026-10-08 19:37 UTC, **not deployed** (§3). Superseded `new-site` uploads: `08ce965a-…` (first 404 fix, no Range), `67d5f063-…` (`f133065`), `02f62da5-…` (working tree), `bd595b7b-…` (`f90ab83`), `20285892-…` (`new-site` `d8c89e7`, English and Arabic), `bbb297dd-…`, `04b3477e-…`. Tests, never deployed: range tests `958b0aaa-…`, `1e5a2451-…`, `d94c8408-…`; 404 and Range tests `66f51887`, `9a838be0`, `2072f14c`, `01460ab9`, `ccc58637`, `3a915a97`, `f3e4c7e6`, `e03c09d5` (§2.5), several on the throwaway alias `cftest` (it still shows five probe files `zz-p87441.*`; harmless) |
| Custom domains | `learnklaro.com` and `www.learnklaro.com`, both → `klaro-landing` (production) |
| workers.dev route | Off |
| Version URLs (`preview_urls`) | Were **off**. Turned **on** on 2026-10-08, for this Worker only, with the owner's go-ahead. Done with one API call (`POST …/workers/scripts/klaro-landing/subdomain` with `{"enabled": false, "previews_enabled": true}`), which touches nothing else. learnklaro.com was checked before and after. **Omar's deploy from `main` at 12:26 UTC switched them off again**: `main`'s old `wrangler.jsonc` has no `preview_urls`, and Wrangler then sets Version URLs to match workers.dev (off). Switched back on the same way before the redesign preview. Every deploy from a config without `preview_urls: true` turns them off; ours has it |

### 1.3 What each address serves (curl, 2026-10-08)

Until 12:26 UTC on 2026-10-08 (the table below). Since then learnklaro.com serves **Omar's landing**
(title "Klaro · Spend your time teaching") from `e5660ed5`, with `main`'s minimal config: still no
https or www redirect, no `_headers`, and `/ar/` is the old Arabic one-pager.

| URL | Answer | Notes |
|---|---|---|
| `https://learnklaro.com/` | 200, the **old** one-page site | Title "Klaro: lectures, the book and practice questions, side by side" |
| `https://www.learnklaro.com/` | 200, the same page | A full duplicate; no redirect to the apex |
| `http://learnklaro.com/` and `http://www.…` | 200 | No redirect to https |
| `https://learnklaro.com/robots.txt` | 200 | Cloudflare's Content Signals Policy text (comments only), because the site has no robots.txt |
| `https://learnklaro.com/products/study-view/` | 404 | The new pages aren't deployed |
| `https://learnklaro.com/does-not-exist` | 404, empty body | No 404 page |
| `/design/`, `/README.md`, `/wrangler.jsonc` | 404 | The old `.assetsignore` already kept these out |
| `https://klaroplatform.github.io/klaro-landing/` | 200, the old site | The GitHub Pages copy |

---

## 2. What changed in the repository, and why

The files are on branch `redesign`. §2.5 (`worker/index.js` and the matching lines in the three
files) was made on 2026-10-08 and is not committed yet.

### 2.1 `wrangler.jsonc`

- **Kept:** `name` (`klaro-landing`) and both custom domains. Workers Builds refuses to build if the
  name differs from the Worker's name in the dashboard. The `www` custom domain stays, because the
  www → apex redirect needs its DNS record and certificate.
- **Unknown URLs get `404.html` with status 404.** First done with `"not_found_handling": "404-page"`;
  since §2.5 it is `"none"` and `worker/index.js` sends the page, with `Cache-Control: no-store`.
- **Added `"html_handling": "auto-trailing-slash"`:** this is the default, written out.
  - `/products/study-view` → 307 to `/products/study-view/`, which serves `products/study-view/index.html`.
  - `/index.html` → `/`.
- **Added `"workers_dev": false`:** there is no public `klaro-landing.<subdomain>.workers.dev` copy.
  The routes already implied this; now it is explicit.
- **Added `"preview_urls": true`:** Version URLs (`<version>-klaro-landing.<subdomain>.workers.dev`)
  stay on, so a version can be checked before it goes live. They are public; `_headers` marks them
  `noindex`.
- **Added a Worker script for videos and misses only (§2.5):** `"main": "worker/index.js"`,
  `"assets.binding": "ASSETS"`, `"assets.run_worker_first": ["/media/*.mp4", "/demo/*.mp4"]`, and
  `"not_found_handling": "none"` (was `"404-page"`). Every other file is still served without
  running any code. It replaces Omar's `worker.js` on `main` (§4, step 1).

### 2.2 `.assetsignore`

The repository root is the assets folder, so anything not listed here is published. It now excludes:

- **Version control, editor, OS and agent files:** `.git`, `.github`, `.gitignore`, `.claude`,
  `.vscode`, `.DS_Store`, …
- **Tooling:** `.wrangler`, `node_modules`, the wrangler config, `package*.json`, `*.py`.
- **Secrets, if they ever appear:** `.env*`, `.dev.vars*`.
- **Notes and internal folders:** `_config.yml`, `/design`, `/partials`, `/tools`, and **every `*.md`**
  (README, CLAUDE.md, the briefs).
- **The Worker script:** `/worker` (it runs on Cloudflare; it must not also be published as a file).
- If a public Markdown file is ever wanted, add it back with `!path/file.md`.

The folder names `/design/`, `/partials/`, `/tools/` and `/worker/` are now reserved: a public page
can't live there.

### 2.3 `_headers` (new)

Cloudflare reads this file; it is never served. GitHub Pages ignores it.

| URL pattern | Headers | Why |
|---|---|---|
| `/*` | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` turning off camera, microphone, geolocation, payment, USB, motion sensors and Topics | Basic hardening. `SAMEORIGIN` lets our own pages frame the showcase and nobody else; the showcase uses none of the blocked features (`showcase.md` §7.3) |
| `https://:version.:subdomain.workers.dev/*` | `X-Robots-Tag: noindex` | Keeps Version URLs and any workers.dev copy out of search. Cloudflare's documented pattern; `_headers` can match on host. Cloudflare also adds `noindex` to Version URLs by itself (seen on versions with no `_headers`), so this is a second layer |
| The landing's own CSS and JS **by name**: `/klaro.css`, `/site.css`, `/klaro.js`, `/site.js`, `/showcase.js`, `/market/market.css`, `/market/market.js`, `/v1/klaro.css` | `Cache-Control: public, max-age=300, must-revalidate` | Not fingerprinted, so 5 minutes only. Listed by name since the redesign: `/*.css` and `/*.js` would also match the showcase's hashed files, and two `Cache-Control` values get joined. An unlisted CSS/JS file gets the HTML default, which is safe |
| `/showcase/*` | `X-Robots-Tag: noindex` | The showcase (the real app on sample data) is not for search; `showcase.html` also has a noindex meta |
| `/showcase/assets/*` | `public, max-age=31536000, immutable` | Every file name carries a hash |
| `/demo/*` | `X-Robots-Tag: noindex`; `public, max-age=86400, stale-while-revalidate=86400` (a day) | The sample world's lectures and book, asked for at root paths by the showcase |
| `/media/*` | a day, as `/demo/*` | The landing's recordings, posters, caption cues. Rename to change |
| `/brand/*`, `/illustrations/*` | a week, as `/img/*` | The app's logo and illustrations, at the root because the showcase asks for them there |
| `/v1/*` | `X-Robots-Tag: noindex` | The frozen previous landing (`v1/index.html` also has a noindex meta) |
| `/img/*` | `public, max-age=604800, stale-while-revalidate=86400` (a week) | To change an image, give it a new file name |
| `/fonts/*` | one year, `immutable` | Only if fonts are ever self-hosted (today they come from Google Fonts) |
| favicons | one day | |
| HTML, robots.txt, sitemap.xml, llms.txt | No `Cache-Control` set: Cloudflare's default `public, max-age=0, must-revalidate` plus an ETag | A deploy shows at once |
| `/robots.txt`, `/llms.txt` | `Content-Type: text/plain; charset=utf-8` | Cloudflare sends `.txt` as plain `text/plain` with no charset (seen on the preview); llms.txt may carry Arabic. HTML pages declare UTF-8 in `<meta charset>`. Confirmed on the `20285892` preview |

- **No Content-Security-Policy.** The pages use inline styles, inline JSON-LD and Google Fonts, and the
  showcase needs frame, media, worker and connect sources (`showcase.md` §7.3); a CSP needs its own
  careful pass.
- **Reserved root names** since the redesign: `/showcase/`, `/demo/`, `/media/`, `/brand/` and
  `/illustrations/` (the showcase asks for its files at those root paths).
- **No HSTS yet.** It is switched on later in the dashboard (§5, step 8).
- **Careful when editing:** if two blocks match one URL and set the same header, Cloudflare joins
  the values with a comma. Never set `Cache-Control` in two blocks that can match one URL.
- **A rule applies to every response whose URL matches it, 404s and redirects included.** The cache
  rules above would also reach a missing file; `worker/index.js` answers every miss instead, with
  `no-store` (§2.5). Keep HTML pages out of the long-cached folders: their trailing-slash redirects (307) would
  carry the folder's `Cache-Control`.

### 2.4 How it was checked

Checked on a clean snapshot of `new-site` (`68b0a8c`), using `wrangler deploy --dry-run` and a local
`wrangler dev`:

- The config is valid.
- All 31 public files answer 200: the home page, `ar/`, 7 product pages, research, the market
  and its CSS/JS, the shared CSS/JS, 11 images and 3 icons.
- `/products/study-view` redirects to `/products/study-view/`.
- These all answer 404: `/design/`, `/design/brief/README.md`, `/tools/chrome.py`,
  `/partials/header.en.html`, `/README.md`, `/CLAUDE.md`, `/_config.yml`, `/wrangler.jsonc`,
  `/.assetsignore`, `/_headers`, `/.git/config`, and unknown URLs.
- The security and cache headers came out as in the table above.
- The workers.dev `noindex` rule couldn't be checked locally (the local server doesn't use the real
  hostname); it was confirmed on the real preview (§3.1).

### 2.5 The Worker script: video ranges, and 404s that are never cached (2026-10-08)

**What was seen.** At about 17:06 UTC the `new-site` alias answered
`/media/student-minis-phone.mp4` with `404`, `cf-cache-status: HIT` and
`cache-control: public, max-age=86400, stale-while-revalidate=86400`, while the version URL of
`02f62da5` served the file.

**What it was.**

- **Not a 404 cached at the edge.** `02f62da5` had been uploaded at 17:06:34, and the alias was still
  pointing at the previous `new-site` version, `bd595b7b`, which doesn't have that file (it came in
  `9c6f64e`). An alias switches within about 10 seconds (measured below). The alias serves the file now.
- **`cf-cache-status: HIT` misleads here.** On a static-assets response it says the file's body came
  from Cloudflare's asset cache (here, the body of `404.html`), not that the answer for that URL was
  cached. A path never requested before answers `404` with `HIT` too. Static assets have no cache by
  URL unless Workers Caching (`"cache": {"enabled": true}`) is turned on. It is off; keep it off
  (it would also make every static request billable).
- **The real bug: `_headers` rules also apply to 404s.** The asset server attaches the matching
  `_headers` rules to every response it builds, 404s and redirects included (open-source
  `workers-shared` asset-worker: `handleRequest` → `attachCustomHeaders`; the docs don't say either
  way). So a missing file was sent with its folder's `Cache-Control`:
  - a day under `/media/*` and `/demo/*`;
  - a week under `/img/*`, `/brand/*` and `/illustrations/*`;
  - a year, `immutable`, under `/showcase/assets/*` and `/fonts/*`.

  Any browser, or shared cache, that asked for a file before it existed kept the 404 that long.
  That happens with a QA check made before the upload, a page that loads during a deploy and asks
  the old version for a new file, or a broken link fixed later by adding the file.
- `_headers` can't match on the status code, so no header rule can treat a 404 differently from the
  file without also dropping the caching of files that exist.

**Found on the way: the redesign had no Range support.** Workers static assets answer a Range
request with the whole file (200); the asset server has no Range code. The 206 on learnklaro.com
comes from Omar's `worker.js` (on `origin/main`, `8a428a9`, live in `e5660ed5`), not from the
version being deployed, as §3.1 used to say. `redesign` doesn't have that commit, so its videos
couldn't seek, and Safari on iPhone can refuse to play them.

**The fix: one Worker script, `worker/index.js`, for both.**

- **Videos** (`run_worker_first: ["/media/*.mp4", "/demo/*.mp4"]`): it fetches the file from
  `env.ASSETS` (with the `_headers` applied) and answers a Range request with 206 and just those
  bytes. It reads the file once and keeps only the bytes asked for, because the Worker can't see a
  file's size before reading it (Chrome's first `bytes=0-` still holds the whole file, 9.4 MB at
  most today, as Omar's version did for every range). One range only (several get the whole file), `If-Range` honoured,
  416 for a range past the end. Posters, captions, images and the PDF never run it (`*.mp4` only).
- **Misses** (`not_found_handling: "none"`): every URL that matches no file runs the script, which
  sends `404.html` (served at `/404`) with status 404, `Cache-Control: no-store`, and the `_headers`
  security headers.
  - Why `"none"`: with a `run_worker_first` list, `"404-page"` makes the assets answer misses
    themselves, with the folder's `Cache-Control`, and the script never sees them.
  - `/404` itself still answers 200 (as before); `404.html` has `noindex`.
- **`.assetsignore`:** `/worker`, so the script isn't also published as a file.
- **`_headers`:** unchanged rules; a comment at the top says that rules reach 404s and redirects.
- **No build step:** wrangler bundles the file on deploy (Workers Builds included). No imports.
- **Cost.** Every other file is served without running the script, and static asset requests are
  free and unlimited. Each video request and each 404 is one Worker invocation. The Free plan allows
  100,000 a day. A page view with videos makes a few range requests per video, so that is several
  thousand page views a day. If they ran out, videos and 404s would fail until midnight UTC; pages and
  images keep working. If traffic grows, Workers Paid ($5 a month, 10 million requests) removes the
  limit. Omar's version runs the Worker for every file under `/media/` and `/demo/`, posters
  included, so this one costs fewer invocations.
- **Caching of files that exist is unchanged.** To change a file, still give it a new name.
- **Not chosen:**
  - Versioned (hashed) file names alone. They are already the rule for changing a file, but they
    don't stop a 404 being cached: a new hashed name asked for during a deploy would be cached for
    a year.
  - Short `max-age` or `no-cache` on `/media/*`, `/img/*` and the rest. Every view would then
    revalidate every file. The script makes that unnecessary.
  - Workers Caching, which slices ranges by itself: it bills every static request.

**Tested** on version URLs and the throwaway alias `cftest`, with probe files `zz-p87441.*`:

| Step | Version | Result |
|---|---|---|
| Before: old config, probes missing | `66f51887` | 404, `cf-cache-status: HIT`, and the folder's `cache-control`: `max-age=86400, …` (`/media/`, `/demo/`), `max-age=604800, …` (`/img/`), `max-age=31536000, immutable` (`/showcase/assets/`). Same on the alias |
| Old config, probes added | `9a838be0` | Version URL 200 at once. Alias 200 on all four 8 to 14 seconds after the upload (one still 404 at 8 s). So no day-long cache at the edge |
| `worker/index.js`, probes missing | `f3e4c7e6` | 404, `cache-control: no-store`, the 404 page, `x-frame-options` and the other security headers, `x-robots-tag` on the preview. The same under `/media/`, `/demo/`, `/img/`, `/showcase/assets/`, `/brand/`, `/illustrations/`, `/fonts/`, for `.mp4` misses, and for a navigation, HEAD, Range, POST and `?x=1`. `/worker/index.js`, `/wrangler.jsonc`, `/_headers`, `/design/`, `/README.md`: 404 `no-store` |
| `worker/index.js`, video ranges | `f3e4c7e6` | 206 with the right `content-range`, checked byte for byte against the files: `1000-1999`, `0-1`, `0-`, `-1000`, `4646000-`, `4000000-9999999` on `marking.mp4`, two ranges on the 9.35 MB `lecture-bio-01.mp4`, `demo/lecture.mp4`, `student-minis-phone.mp4`. Past the end: 416 `bytes */4646953`, `no-store`. Two ranges: 200 whole. `If-Range` mismatch: 200; match: 206. `If-None-Match`: 304. No Range: 200 with `accept-ranges: bytes`. The 206 keeps the day-long `cache-control` |
| `worker/index.js`, probes added | `e03c09d5` | 200 on the version URL and on the alias at once, each with its folder's caching; a Range on the new video: 206 |
| Final preview | `05deebdb` (`new-site`) | §3.1 |

Browsers that fetched a missing file from an earlier preview may keep that 404 for up to a day
(a hard reload clears it). Production never had these rules: `e5660ed5` has no `_headers`.

---

## 3. The preview URL

### 3.1 The preview (2026-10-08): the redesign

**https://new-site-klaro-landing.learnklaro.workers.dev**

- It is the `new-site` alias, and always shows the latest upload made with `--preview-alias new-site`.
- This exact version is also at https://05deebdb-klaro-landing.learnklaro.workers.dev.
- It was uploaded at 19:37 UTC from a clean snapshot of the **`redesign`** branch at `51fd4d8`,
  plus `worker/index.js` and its config (§2.5, not committed when uploaded): version
  `05deebdb-3048-4063-b32a-6700a642a444`, **not deployed**.
- Checked on it: `/`, `/students/`, `/products/`, `/products/marking/`, `/products/quizzes/`,
  `/research/`, `/try/`, `/market/`, `/v1/`, `/showcase/showcase` answer 200 with
  `public, max-age=0, must-revalidate`; `/media/student-minis-phone.mp4` 200 with a day;
  `curl -r 1000-1999 …/media/marking.mp4` 206 `bytes 1000-1999/4646953`; `/does-not-exist`,
  `/design/`, `/worker/index.js` and a missing `/media/*.mp4` 404 with `no-store`.
- learnklaro.com still serves `e5660ed5` (Omar's landing), checked after the upload
  (`wrangler deployments status`).

The table below was checked on the earlier preview `bd595b7b` (`f90ab83`, 357 files; the largest,
`demo/lectures/lecture-bio-01.mp4`, is 8.92 MB, under the 25 MiB limit per file). Since §2.5,
every 404 in it also carries `cache-control: no-store`, and Range requests on videos get 206.

| Check | Result |
|---|---|
| `/`, `/students/`, `/products/`, `/products/marking/`, `/products/quizzes/`, `/research/`, `/try/`, `/market/`, `/v1/` | 200 |
| `/showcase/showcase.html?scene=study&lang=en` | 307 → `/showcase/showcase?scene=study&lang=en`: **the query is kept**, then 200. It costs one round trip before the frame starts; `showcase.md` §1.1 suggests `showcase/index.html` and `/showcase/?scene=…` to avoid it |
| `/showcase/assets/*.js` (and the `.css`, and the pdf.js `.mjs`) | `cache-control: public, max-age=31536000, immutable`, `text/javascript` |
| `/site.css`, `/showcase.js` | `public, max-age=300, must-revalidate`: one value each, no joined header |
| `/media/*.mp4`, `/demo/*` | `public, max-age=86400, stale-while-revalidate=86400`; `/demo/*` also `x-robots-tag: noindex` |
| `/v1/` | 200, `x-robots-tag: noindex` |
| `/does-not-exist` | 404 with the 404 page |
| `/ar/` | 404 (Arabic is out for now) |
| `/design/`, `/tools/`, `/partials/`, `/README.md`, `/CLAUDE.md` | 404 |
| `x-robots-tag` on the preview host | `noindex` on every path |
| **Range request** on `/media/marking.mp4` | **200 with the whole file on the preview, not 206.** See below |

**Byte ranges.** Workers static assets answer a Range request with the whole file (200). Only a
Worker script gives 206. Tests on 2026-10-08:

| Version | Worker script | Deployed? | `curl -r 1000-1999 …/media/marking.mp4` |
|---|---|---|---|
| `e5660ed5` (Omar, live) | Omar's `worker.js`, for `/demo/*` and `/media/*` | yes | **206**, `accept-ranges: bytes` |
| `6820e291` (Omar's first try, live for two minutes) | none | no | 200, whole file |
| `1e5a2451`, `d94c8408`, `958b0aaa`, `bd595b7b`, `02f62da5`, `2072f14c` (redesign) | none, or misses only | no | 200, whole file |
| `f3e4c7e6`, `05deebdb` (redesign, `worker/index.js`) | ours, for `*.mp4` under `/media/` and `/demo/` | no | **206**, `content-range: bytes 1000-1999/4646953` |
| learnklaro.com (= `e5660ed5`), re-checked 19:2x UTC | Omar's | yes | **206** |

- **Corrected on 2026-10-08:** this section used to say the 200 came from previewing a version that
  isn't deployed. It came from the missing Worker script: `e5660ed5` carries Omar's `worker.js`
  (`wrangler versions view` shows `run_worker_first: ["/demo/*", "/media/*"]`), and `6820e291`,
  his first upload without it, gave 200. Now an undeployed preview gives 206 too.
- Without a 206, browsers still play a video sent whole, but seeking waits for the download, and
  Safari on iPhone can refuse to play it.
- **After go-live, check:**
  `curl -s -o /dev/null -r 0-1023 -w '%{http_code}\n' https://learnklaro.com/media/marking.mp4`
  should print `206`. Then play the hero and a recording on a real iPhone (`showcase.md` §7.2).

Notes:

- **Wait about a minute after an upload before checking the alias.** For the first seconds after
  an upload the alias can answer some URLs from the previous version (measured: 8 to 14 seconds,
  §2.5). That is what made `/media/student-minis-phone.mp4` look "cached as 404" at 17:06. The
  version URL (`<8 chars>-klaro-landing…`) is right at once, so check it first.
- A brand-new workers.dev subdomain takes a minute or two to resolve.
- `/404.html` itself redirects to `/404`; unknown URLs get the page with status 404 and
  `cache-control: no-store`, which is what matters.
- Navigation links are relative, so clicking around the preview stays on the preview. The
  canonical, `og:url`, hreflang, sitemap and robots.txt URLs point at `https://learnklaro.com/…`, as
  they should.

### 3.2 How to upload a preview

This uploads a version but doesn't deploy it, so learnklaro.com keeps what it serves.

1. Make a clean snapshot, because other agents may be editing the working tree:
   `git worktree add <scratch>/cf-preview <branch or commit> --detach`.
2. In that folder, run:
   ```sh
   CLOUDFLARE_ACCOUNT_ID=8f32b3259e15052339fe39a63baa1cca npx wrangler versions upload --profile learnklaro --preview-alias new-site --message "new-site preview"
   ```
   `--profile learnklaro` is needed because the snapshot is outside the repository folder.
3. The output should include two lines:
   - `Version Preview URL: https://<8 chars>-klaro-landing.<subdomain>.workers.dev`
   - `Version Preview Alias URL: https://new-site-klaro-landing.<subdomain>.workers.dev`

   The alias always points at the latest upload that used it.
4. Check the preview with curl:
   - `/`, `/products/study-view/`, `/research/` and `/market/` answer 200.
   - `/does-not-exist` answers 404.
   - `/design/`, `/tools/` and `/partials/header.en.html` answer 404.
   - `curl -sI <url>/` shows `x-robots-tag: noindex`.
5. `git worktree remove <scratch>/cf-preview`.

Never run `wrangler deploy` or `wrangler versions deploy` for a preview: both replace learnklaro.com.

Version URLs are public: anyone with the link can open them. That is fine for a marketing site.
Cloudflare Access can put a sign-in in front of them if that is ever wanted.

---

## 4. Going live

1. **Orchestrator:** after QA and with the owner's go-ahead, merge `redesign` into `main` and push.
   - Until step 2 is done, this updates only GitHub Pages.
   - Local `main` is 3 commits ahead of `origin/main` and **1 behind** (2026-10-08): `origin/main`
     has Omar's `8a428a9`, "Answer Range requests for the videos", which is live. Pull it first.
   - **Resolving the merge.** `wrangler.jsonc`, `.assetsignore` and `_config.yml` were changed on
     both sides. `worker/index.js` (§2.5) replaces Omar's `worker.js`, and a Worker has only one
     `main`:
     - Take `redesign`'s `wrangler.jsonc` and `.assetsignore` whole
       (`git checkout redesign -- wrangler.jsonc .assetsignore`).
     - `git rm worker.js`; drop its line from `_config.yml`'s `exclude`.
     - Check: `grep '"main"' wrangler.jsonc` shows `worker/index.js`, and no `worker.js` is left.
     - Tell Omar: his Range handling is kept, in `worker/index.js`, for `*.mp4` only.
2. **Owner:** connect the repository to the Worker (Workers Builds):
   1. In the Cloudflare dashboard, switch to the account that holds learnklaro.com.
   2. Go to Workers & Pages → **klaro-landing** → Settings → **Builds** → **Connect**.
   3. Pick GitHub. The repository belongs to the GitHub account **`klaroplatform`**, so the
      Cloudflare Workers & Pages GitHub app must be installed **on that account**, by someone signed
      in to GitHub as `klaroplatform`. A collaborator account can't install it there. Give the app
      access to `klaro-landing`; "Only select repositories" is fine.
   4. Use these settings:

      | Setting | Value |
      |---|---|
      | Repository | `klaroplatform/klaro-landing` |
      | Production branch | `main` |
      | Build command | *(empty)* |
      | Deploy command | `npx wrangler deploy` |
      | Root directory | `/` (empty) |
      | Build variables | none |
      | Preview (non-production) builds | **Off** for now (see the note below) |

   5. Save.
   - Every push to `main` now deploys learnklaro.com. Builds uses its own token, so no one's
     wrangler login is involved.
   - **Private repository:** Builds keeps working after the repository goes private, as long as the
     GitHub app has access to the repository. With "Only select repositories", check that
     `klaro-landing` is still ticked (GitHub, signed in as `klaroplatform` → Settings → Applications
     → Installed GitHub Apps → Cloudflare Workers and Pages → Configure).
   - Connecting before step 1 is also safe: a build of today's `main` redeploys the old site, which
     is what is live anyway. It does switch Version URLs off (`main`'s config has no
     `preview_urls`, §1.2) until the redesign is merged; turn them back on as in §1.2 if a preview
     is needed in between.
   - Nothing else is needed for the Worker script: `npx wrangler deploy` bundles `worker/index.js`.
   - **Preview builds, later:** they give each branch push its own URL. Newly connected Workers use
     `npx wrangler preview` (Worker Previews), which needs a `"previews": {}` block added to
     `wrangler.jsonc`. Add that only when branch previews are wanted.
3. **Or, until step 2 is done:** with the owner's OK, the orchestrator deploys once by hand from a
   clean snapshot of `main`, using the `learnklaro` profile (§1.1):
   ```sh
   git worktree add <scratch>/cf-live main --detach
   cd <scratch>/cf-live && CLOUDFLARE_ACCOUNT_ID=8f32b3259e15052339fe39a63baa1cca npx wrangler deploy --profile learnklaro
   ```
   This also uploads `worker/index.js` and applies `workers_dev: false` and `preview_urls: true`.
4. **Check** (anyone):
   ```sh
   curl -s https://learnklaro.com/ | grep -o '<title>[^<]*'             # the new title
   curl -sI https://learnklaro.com/products/study-view/ | head -1        # 200
   curl -sI https://learnklaro.com/products/study-view | grep -i location # → /products/study-view/
   curl -sI https://learnklaro.com/market/ | head -1                     # 200
   curl -sI https://learnklaro.com/does-not-exist | grep -iE '^HTTP|cache-control'   # 404, no-store
   curl -sI https://learnklaro.com/media/nope.mp4 | grep -iE '^HTTP|cache-control'   # 404, no-store
   curl -sI https://learnklaro.com/media/marking.mp4 | grep -i cache-control         # max-age=86400, …
   curl -s -o /dev/null -r 0-1023 -w '%{http_code}\n' https://learnklaro.com/media/marking.mp4   # 206
   curl -sI https://learnklaro.com/design/ | head -1                     # 404
   curl -sI https://learnklaro.com/README.md | head -1                   # 404
   curl -sI https://learnklaro.com/ | grep -iE 'x-content-type|referrer-policy|permissions-policy'
   curl -sI https://learnklaro.com/ | grep -i x-robots-tag              # nothing: the real site is indexable
   ```
   After the zone settings in §5, also check:
   ```sh
   curl -sI http://learnklaro.com/ | grep -iE '^HTTP|location'                  # 301 → https://learnklaro.com/
   curl -sI https://www.learnklaro.com/research/ | grep -iE '^HTTP|location'    # 301 → https://learnklaro.com/research/
   curl -s https://learnklaro.com/robots.txt                                    # our file; nothing above it blocks a crawler
   ```
5. **Orchestrator:** `README.md` and `CLAUDE.md` already describe Cloudflare (`51fd4d8`). Two
   things are left:
   - Now: README's "a Worker named `klaro-landing` with no code" is out of date since §2.5. It
     should say a small Worker script (`worker/index.js`) answers video Range requests and 404s;
     everything else is served straight from the files. List `worker/` among the files there.
   - After go-live: drop "Once Workers Builds is connected" and "It is being retired".

---

## 5. Domain and zone settings (owner, by hand in the dashboard)

All of these are in the zone **learnklaro.com**, in the second account. Do them after the new site
is live (§4), in this order. The reasons are in `seo-geo.md` §5.1.

1. **SSL/TLS → Edge Certificates → Always Use HTTPS: On.** http currently answers 200.
2. **Rules → Redirect Rules → Create rule → template "Redirect from WWW to root":**
   - Request URL `https://www.learnklaro.com/*`, target `https://learnklaro.com/${1}`.
   - Status **301**, **preserve query string** on.
   - Keep the www custom domain on the Worker; the redirect needs its record and certificate.
   - `_redirects` can't do this, because it can't redirect from one host to another.
3. **AI bots: the owner's decision is to allow every AI crawler, training included.**
   - **Security → Settings → AI bot policies** (the Search / Agent / Training controls): set all
     three to **Allow**. Never "Block" for Training. Since 15 Sep 2026 that also blocks
     Googlebot, Bingbot and Applebot.
   - The legacy **"Block AI bots"** toggle: **Off**.
   - **AI Crawl Control → Crawlers:** no crawler set to Block. Check GPTBot, OAI-SearchBot,
     ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User,
     Googlebot, Bingbot and Applebot. A block here becomes a firewall rule that robots.txt can't
     override.
4. **Managed robots.txt: Off.**
   - Security → Settings → filter "Bot traffic" → "Set your preference to block training in
     robots.txt" (or "Instruct AI bot traffic with robots.txt"; the name varies) → Off.
   - Bot Preference Sync too, if it appears.
   - The repository will ship its own `robots.txt`. When the managed setting is on, Cloudflare puts
     its own `Disallow` rules for AI bots **above** our file.
   - "Display Content Signals Policy" (zone Overview → Control AI Crawlers) can stay either way. It
     only adds comments and states no preference.
   - Afterwards, open `https://learnklaro.com/robots.txt` and read it: only our file should be there.
5. **Security → Settings → Bot Fight Mode: Off.**
   - Is it safe for verified bots? Cloudflare's docs don't promise that it spares verified bots or
     AI assistants.
   - It can't be given exceptions: custom rules and Skip have no effect on it.
   - The free version can't be tuned.
   - A static marketing site has nothing it needs to protect. The fetchers that open a page when
     someone asks an assistant about Klaro (ChatGPT-User, Claude-User, Perplexity-User) are exactly
     the traffic it challenges.
   - If it must stay on, watch Security → Events for "Bot Fight Mode" challenges against those
     agents.
6. **Security level normal; "I'm Under Attack" off; no WAF custom rule that challenges or blocks
   bots.** A JavaScript challenge in front of the HTML hides the site from every crawler that
   doesn't run JavaScript.
7. **Caching → Configuration → Crawler Hints: On.** It tells Bing and others (IndexNow) when pages
   change.
8. **HSTS:** SSL/TLS → Edge Certificates → HSTS.
   - Turn it on only after a few weeks of stable https.
   - Use max-age 6 months, include subdomains only if every subdomain serves https, and no preload
     at first.
9. **Optional: Web Analytics** (free, no cookies). It shows visits from chatgpt.com, perplexity.ai,
   gemini.google.com, copilot.microsoft.com and claude.ai.
10. **Outside Cloudflare:**
    - Google Search Console: a Domain property, verified by a DNS TXT record added in this zone.
      Submit the sitemap.
    - Bing Webmaster Tools: import the site from Search Console.
    - See `seo-geo.md` §5.3.

Not to touch:

- The DNS records for `learnklaro.com` and `www`. They belong to the Worker's custom domains;
  Cloudflare made them.
- The SSL mode.

---

## 6. Shutting down GitHub Pages

Do this **after** learnklaro.com serves the new site and Builds deploys from `main` (§4, steps 2–4).
Then GitHub Pages is only a stale public duplicate.

1. GitHub → `klaroplatform/klaro-landing` → Settings → **Pages**.
   - Next to "Your site is live at…", open the **⋯** menu → **Unpublish site**.
   - Or, as a repository admin: `gh api -X DELETE repos/klaroplatform/klaro-landing/pages`.
2. Check: `curl -sI https://klaroplatform.github.io/klaro-landing/` answers 404.
3. Orchestrator, later and optional: delete `_config.yml`, which only served GitHub Pages, and its
   line in `.assetsignore`.
4. **Making the repository private** (the orchestrator does this at the end):
   - **Before:** Pages is unpublished (step 1), and Builds is connected and has deployed at least once.
   - **Pages on GitHub Free:** Pages can't publish from a private repository, so the github.io site
     comes down by itself. Unpublish it anyway first: on a paid GitHub plan, a private repository's
     Pages site is still public.
   - **Builds:** Workers Builds keeps working on a private repository, as long as the Cloudflare
     GitHub app has access to it (§4, step 2).
   - **After:** push a small commit to `main` and check that the build runs: Workers & Pages →
     klaro-landing → Deployments, or the check mark next to the commit on GitHub.
   - The public `.assetsignore`, `_headers` and `wrangler.jsonc` contain no secrets. The account id
     in `wrangler.jsonc` is not a secret.

---

## 7. Rolling back a bad deploy

Each deploy is a version, and rolling back switches learnklaro.com to an earlier version within
seconds.

- **Dashboard:** Workers & Pages → klaro-landing → **Deployments**. Pick the last good version, then
  **⋯ → Rollback** (or "Deploy version").
- **CLI**, from the repository folder (the `learnklaro` profile applies there by itself):
  ```sh
  CLOUDFLARE_ACCOUNT_ID=8f32b3259e15052339fe39a63baa1cca npx wrangler deployments list   # find the good version id
  CLOUDFLARE_ACCOUNT_ID=8f32b3259e15052339fe39a63baa1cca npx wrangler rollback <version-id> -m "why"
  ```
  With no id, `wrangler rollback` goes back to the previous version. If the redesign's go-live goes
  wrong, roll back to `e5660ed5-6e6b-4bba-957c-99bb5178c205` (Omar's landing, live since 2026-10-08).
  The old one-page site is `6fd94dd8-23d8-4d96-9a50-6d1a1a068155`.
- **Then fix `main`.** With Builds connected, the next push to `main` deploys whatever `main` holds.
  Revert the bad commit (`git revert <sha>`, push) so the rollback doesn't get undone.
- **What a rollback covers:**
  - It restores the files, including `_headers`, the `assets` settings and the Worker script,
    because they are part of the version. `e5660ed5` brings back Omar's `worker.js` (ranges for
    `/demo/*` and `/media/*`).
  - It does **not** undo zone settings, redirect rules or custom-domain changes. Change those back
    by hand.

---

## 8. klaroplatform.com, the canonical address (added 2026-10-12)

The site moves to **https://klaroplatform.com** (apex; www redirects to it). The app stays at
https://app.klaroplatform.com. learnklaro.com keeps serving the same files, so both addresses work,
but every canonical link, `og:url`, sitemap entry, `llms.txt` line, robots.txt `Sitemap:` line and
JSON-LD node says `https://klaroplatform.com/` (`tools/site.json` `"base"`; `python3 tools/site.py`
restamps it). Search engines therefore fold learnklaro.com into klaroplatform.com.

**The two deploy targets** (both in `wrangler.jsonc`, same files, same `worker/index.js`):

| Target | Account | Command | Custom domains |
|---|---|---|---|
| default | `8f32b3259e15052339fe39a63baa1cca` (zone learnklaro.com) | `npx wrangler deploy` (profile `learnklaro`) | `learnklaro.com`, `www.learnklaro.com` |
| env `klaroplatform` | `bbcdececfdc25f78201b3be407c7de6e` ("Klaroplatform's Account", zone klaroplatform.com) | `npx wrangler deploy --env klaroplatform` (profile `default`) | `klaroplatform.com`, `www.klaroplatform.com` |

A deploy to one target does not touch the other. Deploy both whenever the site changes, or the two
hosts drift apart. A preview of the new target: `npx wrangler versions upload --env klaroplatform
--preview-alias new-site` (its Version URLs are `<id>-klaro-landing.klaroplatform.workers.dev`, which
`_headers` marks `noindex`; klaroplatform.com itself is not matched by any noindex rule).

**Before the first deploy of the new target:**

1. In the klaroplatform.com zone, DNS: delete any existing A, AAAA or CNAME record on the apex
   (`klaroplatform.com`) and on `www`. A Workers custom domain refuses to replace one. Leave
   `app`, MX, TXT and every other record alone.
2. Then deploy. Cloudflare creates the proxied records and the certificates for the two domains.

**After it is live (owner, by hand in the klaroplatform.com zone):**

1. **SSL/TLS → Edge Certificates → Always Use HTTPS: On.**
2. **Rules → Redirect Rules → Create rule** (the template "Redirect from WWW to root"):
   request URL `https://www.klaroplatform.com/*`, target `https://klaroplatform.com/${1}`, status
   **301**, preserve the query string. Keep the `www` custom domain on the Worker: the rule needs its
   record and certificate. Rules run before the Worker, so the redirect needs no code.
3. Same bot and AI-crawler settings as §5, in this zone (AI bot policies allow, managed robots.txt
   off, Bot Fight Mode off), so `https://klaroplatform.com/robots.txt` is our file only.
4. Search Console: add a **Domain** property for klaroplatform.com (DNS TXT in this zone) and submit
   `https://klaroplatform.com/sitemap.xml`. Keep the learnklaro.com property; use the Change of
   address tool only if learnklaro.com is later redirected.

**Check:**

```sh
curl -sI https://klaroplatform.com/ | head -1                                  # 200
curl -s https://klaroplatform.com/ | grep -o '<link rel="canonical"[^>]*>'     # https://klaroplatform.com/
curl -sI https://klaroplatform.com/ | grep -i x-robots-tag                     # nothing: indexable
curl -sI https://www.klaroplatform.com/research/ | grep -iE '^HTTP|location'   # 301 -> https://klaroplatform.com/research/
curl -sI http://klaroplatform.com/ | grep -iE '^HTTP|location'                 # 301 -> https://klaroplatform.com/
curl -s https://klaroplatform.com/robots.txt | grep -i sitemap                 # Sitemap: https://klaroplatform.com/sitemap.xml
curl -sI https://klaroplatform.com/does-not-exist | grep -iE '^HTTP|cache-control'   # 404, no-store
curl -s -o /dev/null -r 0-1023 -w '%{http_code}\n' https://klaroplatform.com/media/marking.mp4   # 206
```

Workers Builds (§4, step 2) is connected to the learnklaro.com Worker only. A second Worker in the
other account needs its own connection (same repository and settings, deploy command
`npx wrangler deploy --env klaroplatform`), or a hand deploy after each merge.
