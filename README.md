# Klaro landing

The public landing page for Klaro: plain HTML, CSS and a little JavaScript, with no build step.

- `index.html` is English and `ar/index.html` is Arabic (right to left). They share `klaro.css` and `klaro.js`. The Arabic page's links into the app carry `lang=ar`, so the app opens in Arabic.
- `market/` is the public course market ("V1 Catalog"): search, level, subjects, sorting and a course drawer. Its courses, tutors and prices are examples until the back end has a market. Enroll goes to `<app>/sign-up?as=student&course=<id>`.
- Visitors choose **I'm a student** or **I'm a tutor**. The copy, the animated preview and every sign-up link follow that choice. The sign-up links go to `<app>/sign-up?as=student` or `?as=tutor`, and the app's sign-up card opens on the same choice. `#tutor` in the address opens the tutor version.
- The look is the app's own design system: tokens from `klaro-beta-v2/apps/web/src/styles/tokens.css`, shapes from `src/components/ui/KIT.md`, and images from `apps/web/public`. When the app's tokens change, update the `:root` block in `klaro.css`.

## The app's address

It lives once, in `tools/site.json` (`"app"`). `tools/site.py` writes it into every page's `<meta name="klaro-app">` and into the `href` of every sign-up, sign-in, Terms and Privacy link (`data-signup`, `data-signup-as`, `data-signin`, `data-legal`), so the links work without JavaScript; `klaro.js` and `site.js` read the meta tag and refine them for the audience switch and `lang=ar`. When production gets its own address, change `site.json` and run the tool.

## Shared parts, metadata, sitemap and llms.txt

There is still no build step: `python3 tools/site.py` (standard library only) rewrites the committed files. Each page owns its `<title>` and `<meta name="description">`; the tool fills the `<!-- chrome:meta -->` block under them (canonical, hreflang, Open Graph, icons, the app address and JSON-LD) from those, the page's path and `tools/site.json`, stamps the shared sprite, header and footer from `partials/`, and writes `sitemap.xml` and `llms.txt`. `robots.txt` is written by hand.

```sh
python3 tools/site.py            # after changing a page, a partial or site.json
python3 tools/site.py --check    # writes nothing; exit 1 if anything is stale or a page breaks a rule
python3 tools/site.py --report   # every page's title and description, with lengths
```

`--check` also fails on: a title over 60 characters, a description outside 50–160, not exactly one `<h1>`, an `<img>` without `alt`, JSON-LD that doesn't parse or uses a property schema.org doesn't have, an internal link, asset or `#fragment` that doesn't resolve, a link to a file `.assetsignore` keeps off the site, `href="#"`, and an example mock-up (`.studio`, `.p-vis`, `.tile-vis`…) without `data-nosnippet`. A page is in the sitemap unless `site.json` sets `"index": false` for it (the market's switch is there) or `.assetsignore` keeps it off the site. hreflang is added only when both `x/` and `ar/x/` exist.

## Preview

```sh
python3 -m http.server 8080
# open http://localhost:8080 and http://localhost:8080/ar/
```

## Deploy

GitHub Pages serves `main` from the repository root: push to `main` and it is live in about a minute at https://klaroplatform.github.io/klaro-landing/. `_config.yml` keeps `README.md` and `design/` off the site.

## Editing copy

The English and Arabic pages are separate files. Change both, then run `python3 tools/site.py`. Copy for one audience carries `data-aud="student"` or `data-aud="tutor"`. Course material inside the preview (book text, questions, course names) stays in English on the Arabic page, because that is what the courses are written in.
