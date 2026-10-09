# Klaro landing: notes for Claude

`README.md` explains the site: the pages, `tools/site.py`, the showcase, the preview server and
the deploys.

## Read first

1. `design/brief/handover.md`, if it exists. It is kept local (not in git) and holds the current
   state, what is in flight and what comes next.
2. `design/brief/README.md`: the brief. Its latest blocks hold the owner's decisions and win over
   anything older.

They win over this file and `README.md` where they disagree.

## Talking to Mohamed

- Mohamed writes in Egyptian Arabic. Reply in Egyptian Arabic.
- Files, code comments and commit messages stay in English.
- Write AskUserQuestion questions in English, each with a short explanation.

## How to work

- Work as an **orchestrator**. Give each topic to a specialist subagent that researches and
  proposes a plan, then merge, check and commit. Don't decide or build big things alone.
- **One owner per file.** These files are shared by every page; only one agent edits each at a
  time (use separate worktrees and merge): `index.html`, `students/index.html`, `site.css`,
  `klaro.css`, `site.js`, `showcase.js`, `tools/site.py`.
- Don't edit `showcase/` by hand (it is a build of the app) or `v1/` (frozen).

## Site rules

- **English only for now.** Arabic (`ar/` twins, `page/` and `ar/page/`) comes at the very end.
- **Never mention AI on the site.** `--check` fails on it.
- After editing a page, a partial or `tools/site.json`, run:
  ```sh
  python3 tools/site.py
  python3 tools/site.py --check
  ```
- Preview locally with `node tools/serve.cjs 8091` (videos seek; Python's server doesn't).

## Git and deploys

- Commit locally.
- Cloudflare previews (`wrangler versions upload --preview-alias new-site`) are fine.
- **Ask Mohamed before** pushing to `main`, running `wrangler deploy`, or promoting a version to
  production. These change the live site.
- Never sign in, enter credentials, or change DNS, zone or security settings. The owner does those.
- The repository is public: keep account details, internal plans and private app code out of
  committed files.

## Before you stop

- Watch the usage limit while agents run.
- Before stopping, update `design/brief/handover.md` (what is done, what is in flight, what is
  next), commit what is safe, and send Mohamed a summary.
