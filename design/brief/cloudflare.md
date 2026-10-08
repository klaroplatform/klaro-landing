# Cloudflare: how learnklaro.com is deployed

Checked on 2026-10-08. The SEO side of the same settings is in `design/brief/seo-geo.md` §5 (a
local file, not in git).

The plan:

- learnklaro.com is served by the Worker `klaro-landing` (static files, no code).
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
| Live deployment | Version **`6fd94dd8-23d8-4d96-9a50-6d1a1a068155`** at 100%, uploaded by hand with `wrangler deploy` on 2026-10-03. This is the **old one-page site**, and the version to roll back to if go-live goes wrong |
| Preview versions | **`20285892-94de-47af-9713-38a657d18c28`**: the new site at `d8c89e7` (English and Arabic), alias `new-site`, uploaded 2026-10-08, **not deployed** (§3). Earlier preview uploads, superseded: `bbb297dd-…` (`688c24b`) and `04b3477e-…` (`4c8bfa9`) |
| Custom domains | `learnklaro.com` and `www.learnklaro.com`, both → `klaro-landing` (production) |
| workers.dev route | Off |
| Version URLs (`preview_urls`) | Were **off**. Turned **on** on 2026-10-08, for this Worker only, with the owner's go-ahead. Done with one API call (`POST …/workers/scripts/klaro-landing/subdomain` with `{"enabled": false, "previews_enabled": true}`), which touches nothing else. learnklaro.com was checked before and after: still the old site. `preview_urls: true` in `wrangler.jsonc` keeps it on at every deploy |

### 1.3 What each address serves (curl, 2026-10-08)

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

All three files are committed on branch `new-site` (`4c8bfa9`).

### 2.1 `wrangler.jsonc`

- **Kept:** `name` (`klaro-landing`) and both custom domains. Workers Builds refuses to build if the
  name differs from the Worker's name in the dashboard. The `www` custom domain stays, because the
  www → apex redirect needs its DNS record and certificate.
- **Added `"not_found_handling": "404-page"`:** unknown URLs get the nearest `404.html` with status 404.
  Until a `404.html` exists they get an empty 404, so deploys work either way.
- **Added `"html_handling": "auto-trailing-slash"`:** this is the default, written out.
  - `/products/study-view` → 307 to `/products/study-view/`, which serves `products/study-view/index.html`.
  - `/index.html` → `/`.
- **Added `"workers_dev": false`:** there is no public `klaro-landing.<subdomain>.workers.dev` copy.
  The routes already implied this; now it is explicit.
- **Added `"preview_urls": true`:** Version URLs (`<version>-klaro-landing.<subdomain>.workers.dev`)
  stay on, so a version can be checked before it goes live. They are public; `_headers` marks them
  `noindex`.
- Comments rewritten: how deploys and previews run, and the account id every command needs.

### 2.2 `.assetsignore`

The repository root is the assets folder, so anything not listed here is published. It now excludes:

- **Version control, editor, OS and agent files:** `.git`, `.github`, `.gitignore`, `.claude`,
  `.vscode`, `.DS_Store`, …
- **Tooling:** `.wrangler`, `node_modules`, the wrangler config, `package*.json`, `*.py`.
- **Secrets, if they ever appear:** `.env*`, `.dev.vars*`.
- **Notes and internal folders:** `_config.yml`, `/design`, `/partials`, `/tools`, and **every `*.md`**
  (README, CLAUDE.md, the briefs).
- If a public Markdown file is ever wanted, add it back with `!path/file.md`.

The folder names `/design/`, `/partials/` and `/tools/` are now reserved: a public page can't live
there.

### 2.3 `_headers` (new)

Cloudflare reads this file; it is never served. GitHub Pages ignores it.

| URL pattern | Headers | Why |
|---|---|---|
| `/*` | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` turning off camera, microphone, geolocation, payment, USB, motion sensors and Topics | Basic hardening. No page uses any of these features or embeds the site in a frame |
| `https://:version.:subdomain.workers.dev/*` | `X-Robots-Tag: noindex` | Keeps Version URLs and any workers.dev copy out of search. Cloudflare's documented pattern; `_headers` can match on host |
| `/*.css`, `/*.js` | `Cache-Control: public, max-age=300, must-revalidate` | Not fingerprinted, so 5 minutes only |
| `/img/*` | `public, max-age=604800, stale-while-revalidate=86400` (a week) | To change an image, give it a new file name |
| `/fonts/*` | one year, `immutable` | Only if fonts are ever self-hosted (today they come from Google Fonts) |
| favicons | one day | |
| HTML, robots.txt, sitemap.xml, llms.txt | No `Cache-Control` set: Cloudflare's default `public, max-age=0, must-revalidate` plus an ETag | A deploy shows at once |
| `/robots.txt`, `/llms.txt` | `Content-Type: text/plain; charset=utf-8` | Cloudflare sends `.txt` as plain `text/plain` with no charset (seen on the preview); llms.txt may carry Arabic. HTML pages declare UTF-8 in `<meta charset>`. Confirmed on the `20285892` preview |

- **No Content-Security-Policy.** The pages use inline styles, inline JSON-LD and Google Fonts; a CSP
  needs its own careful pass.
- **No HSTS yet.** It is switched on later in the dashboard (§5, step 8).
- **Careful when editing:** if two blocks match one URL and set the same header, Cloudflare joins
  the values with a comma. Never set `Cache-Control` in two blocks that can match one URL.

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

---

## 3. The preview URL

### 3.1 The preview (2026-10-08)

**https://new-site-klaro-landing.learnklaro.workers.dev**

- It is the `new-site` alias, and always shows the latest upload made with `--preview-alias new-site`.
- This exact version is also at https://20285892-klaro-landing.learnklaro.workers.dev.
- It was uploaded from a clean snapshot of `new-site` at `d8c89e7`, which has the full Arabic site:
  version `20285892-94de-47af-9713-38a657d18c28`, **not deployed**.
- learnklaro.com still serves `6fd94dd8`, the old site (checked after the upload).

Checked with curl:

| Check | Result |
|---|---|
| English: `/`, `/products/`, `/products/minis/`, `/research/`, `/market/` | 200 |
| Arabic: `/ar/`, `/ar/products/`, all 7 `/ar/products/<name>/` pages, `/ar/research/` | 200; Arabic titles; `<html lang="ar" dir="rtl">` |
| `/ar/products/minis` (no slash) | 307 → `/ar/products/minis/` |
| `/does-not-exist` | **404 with the English 404 page** ("Page not found · Klaro") |
| `/ar/nope/`, `/ar/products/nope/` | **404 with the Arabic 404 page** ("الصفحة غير موجودة · Klaro"): Cloudflare serves the nearest `404.html`, which is `ar/404.html` |
| `/robots.txt`, `/llms.txt` | 200, `text/plain; charset=utf-8` (llms.txt now carries non-ASCII text) |
| `/sitemap.xml` | 200, `application/xml` |
| `/design/`, `/tools/`, `/partials/`, `/README.md`, `/CLAUDE.md` (and, on the earlier preview, `_config.yml`, `wrangler.jsonc`, `_headers`, `.assetsignore`, `.git/config`) | 404 |
| `x-robots-tag` on the alias and version URLs | `noindex` (the `_headers` host rule works) |
| `x-robots-tag` on learnklaro.com | none (the real site stays indexable) |
| Security headers, cache rules | As in §2.3: CSS 5 minutes, images a week, HTML `max-age=0` |

Notes:

- **Wait about a minute after an upload before checking the alias.** Right after this upload, for a
  few seconds the alias answered some URLs from the previous version: old `/ar/`, and 404s for the
  new Arabic pages. The version URL was right at once, and the alias caught up within a minute.
  The version URL (`<8 chars>-klaro-landing…`) is the one to check first.
- A brand-new workers.dev subdomain takes a minute or two to resolve. On the first upload the
  preview didn't answer at all for the first couple of minutes.
- `/404.html` itself redirects to `/404`; unknown URLs get the page with status 404, which is what
  matters.
- Navigation links are relative (`products/…`, `../../research/`, `/products/…` on the 404 page), so
  clicking around the preview stays on the preview.
- The canonical, `og:url`, hreflang, sitemap and robots.txt URLs point at `https://learnklaro.com/…`,
  as they should. Until go-live, those addresses still serve the old site.

### 3.2 How to upload a preview

This uploads a version but doesn't deploy it, so learnklaro.com keeps what it serves.

1. Make a clean snapshot, because other agents may be editing the working tree:
   `git worktree add <scratch>/cf-preview new-site --detach`.
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

1. **Orchestrator:** after QA and with the owner's go-ahead, merge `new-site` into `main` and push.
   - Until step 2 is done, this updates only GitHub Pages.
   - Local `main` is 3 commits ahead of `origin/main` today.
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
     is what is live anyway.
   - **Preview builds, later:** they give each branch push its own URL. Newly connected Workers use
     `npx wrangler preview` (Worker Previews), which needs a `"previews": {}` block added to
     `wrangler.jsonc`. Add that only when branch previews are wanted.
3. **Or, until step 2 is done:** with the owner's OK, the orchestrator deploys once by hand from a
   clean snapshot of `main`, using the `learnklaro` profile (§1.1):
   ```sh
   git worktree add <scratch>/cf-live main --detach
   cd <scratch>/cf-live && CLOUDFLARE_ACCOUNT_ID=8f32b3259e15052339fe39a63baa1cca npx wrangler deploy --profile learnklaro
   ```
   This also applies `workers_dev: false` and `preview_urls: true` to the Worker.
4. **Check** (anyone):
   ```sh
   curl -s https://learnklaro.com/ | grep -o '<title>[^<]*'             # the new title
   curl -sI https://learnklaro.com/products/study-view/ | head -1        # 200
   curl -sI https://learnklaro.com/products/study-view | grep -i location # → /products/study-view/
   curl -sI https://learnklaro.com/market/ | head -1                     # 200
   curl -sI https://learnklaro.com/does-not-exist | head -1              # 404 (with the 404 page once it exists)
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
5. **Orchestrator:** update `README.md` ("Deploy" still describes GitHub Pages) and `CLAUDE.md` ("it
   goes live on GitHub Pages"). Both should say: a push to `main` goes live on learnklaro.com through
   Cloudflare.

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
  With no id, `wrangler rollback` goes back to the previous version. To go back to the old one-page
  site after the first go-live, roll back to `6fd94dd8-23d8-4d96-9a50-6d1a1a068155`.
- **Then fix `main`.** With Builds connected, the next push to `main` deploys whatever `main` holds.
  Revert the bad commit (`git revert <sha>`, push) so the rollback doesn't get undone.
- **What a rollback covers:**
  - It restores the files, including `_headers` and the `assets` settings, because they are part of
    the version.
  - It does **not** undo zone settings, redirect rules or custom-domain changes. Change those back
    by hand.
