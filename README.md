# Klaro landing

The public landing page for Klaro: plain HTML, CSS and a little JavaScript, with no build step.

- `index.html` is English and `ar/index.html` is Arabic (right to left). They share `klaro.css` and `klaro.js`.
- Visitors choose **I'm a student** or **I'm a tutor**. The copy, the animated preview and every sign-up link follow that choice. The sign-up links go to `<app>/sign-up?as=student` or `?as=tutor`, and the app's sign-up card opens on the same choice. `#tutor` in the address opens the tutor version.
- The look is the app's own design system: tokens from `klaro-beta-v2/apps/web/src/styles/tokens.css`, shapes from `src/components/ui/KIT.md`, and images from `apps/web/public`. When the app's tokens change, update the `:root` block in `klaro.css`.

## The app's address

Each page has `<meta name="klaro-app" content="https://klaro-web-staging.klaroplatform.workers.dev">`. Change it in both pages when production gets its own address.

## Preview

```sh
python3 -m http.server 8080
# open http://localhost:8080 and http://localhost:8080/ar/
```

## Deploy

It is a static folder, so any static host works. With Cloudflare Pages (where the app already runs):

```sh
npx wrangler pages deploy . --project-name klaro-landing
```

## Editing copy

The English and Arabic pages are separate files. Change both. Copy for one audience carries `data-aud="student"` or `data-aud="tutor"`. Course material inside the preview (book text, questions, course names) stays in English on the Arabic page, because that is what the courses are written in.
