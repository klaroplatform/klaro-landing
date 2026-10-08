# Klaro landing: notes for Claude

Read `README.md` for how the site is built, previewed and deployed.

## Current work

The site is being redone in a new direction: a respectable, tidy brand in the spirit of
schoolai.com, one page per product, the "Enough AI slop" motto, research articles, a careers page
and a "Try it" demo. **The whole brief is in [design/brief/README.md](design/brief/README.md).
Read it before doing anything else.** Start with its open questions for the owner.

## How to work here

- Mohamed writes in Egyptian Arabic; reply in Egyptian Arabic. Files, comments and commit
  messages stay in English.
- Work as an **orchestrator**: split a batch of work across subagents, one owner per file, then
  merge and check. The brief's "How to run the work" section has the rules and phases.
- `index.html`, `ar/index.html`, `klaro.css` and `klaro.js` are shared by everything. Never let two
  agents edit one of them at the same time; use separate worktrees and merge.
- Every page is written in English and Arabic together (`page/` and `ar/page/`).
- Commit locally. Ask before pushing to `main` (it goes live on GitHub Pages) or deploying with
  wrangler.
