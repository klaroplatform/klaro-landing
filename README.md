# Klaro landing

The public landing page for Klaro: plain HTML, CSS and a little JavaScript, with no build step.

- `index.html` is English and `ar/index.html` is Arabic (right to left). They share `klaro.css` and `klaro.js`. The Arabic page's links into the app carry `lang=ar`, so the app opens in Arabic.
- `market/` is the public course market ("V1 Catalog"): search, level, subjects, sorting and a course drawer. Its courses, tutors and prices are examples until the back end has a market. Enroll goes to `<app>/sign-up?as=student&course=<id>`.
- Visitors choose **I'm a student** or **I'm a tutor**. The copy, the animated preview and every sign-up link follow that choice. The sign-up links go to `<app>/sign-up?as=student` or `?as=tutor`, and the app's sign-up card opens on the same choice. `#tutor` in the address opens the tutor version.
- The look is the app's own design system: tokens from `klaro-beta-v2/apps/web/src/styles/tokens.css`, shapes from `src/components/ui/KIT.md`, and images from `apps/web/public`. When the app's tokens change, update the `:root` block in `klaro.css`.

## The app's address

Each page has `<meta name="klaro-app" content="https://app.klaroplatform.com">`. Change it in both pages when production gets its own address.

## Preview

```sh
python3 -m http.server 8080
# open http://localhost:8080 and http://localhost:8080/ar/
```

## Deploy

GitHub Pages serves `main` from the repository root: push to `main` and it is live in about a minute at https://klaroplatform.github.io/klaro-landing/. `_config.yml` keeps `README.md` and `design/` off the site.

## Editing copy

The English and Arabic pages are separate files. Change both. Copy for one audience carries `data-aud="student"` or `data-aud="tutor"`. Course material inside the preview (book text, questions, course names) stays in English on the Arabic page, because that is what the courses are written in.
