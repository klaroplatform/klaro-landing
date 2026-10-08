# Brief: Klaro's new website direction (2026-10-08)

Omar Askar (in a WhatsApp chat) and Mohamed Maslooh (in a Claude Code session) sent this feedback on 2026-10-08.
They want the landing site redone: a respectable, tidy brand in the
spirit of SchoolAI, one page per product, a bold motto, research-backed articles, a careers page
and a "try it" demo.

This file is the handoff. The session that wrote it only documented the work and changed no site
files. A new agent session carries it out, working as an **orchestrator** (see
[How to run the work](#how-to-run-the-work)).

The chat screenshots are in `refs/`. That folder is gitignored because the repository is public
and the screenshots are an internal chat. Everything in them is written out below, so this file
is enough on its own.

---

## 1. The motto (use it, it is ours)

Omar wrote this and then said "this is our motto":

> **ENOUGH AI SLOP.**
>
> **WE DON'T GENERATE AI CONTENT LIKE EVERYBODY DOES.**
>
> **WE CONNECT YOUR CURRENT CONTENT EXACTLY HOW YOU INTENDED IT TO LOOK. NO AI SLOP.**

Omar also said "you can put a bold statement like this." So the motto should be a **bold
statement** on the site: big, confident and hard to miss. It is not a footnote.

- Polish the English wording a little if needed, but keep the meaning and the punch. Keep "AI
  slop" and "Enough".
- The Arabic page needs its own version with the same force. Write it in Arabic, don't translate
  word for word, and **ask the owner to approve the Arabic line** before it ships.
- ⚠️ **Check the current copy against the motto.** The landing page says today: *"Upload your books
  and past papers. The Klaro team turns them into lectures and practice questions."* and *"We
  prepare lectures and questions and check them."* The motto says Klaro connects the tutor's
  *existing* content and does not generate it. Ask the owner what Klaro actually does to tutors'
  material (does it link it, or does it produce new lectures and questions from it, and who does
  that work?). Then make every page tell the same story.

## 2. One page per product

> "Can we split every product we have into its own page?"

The reference is SchoolAI's **Products menu** (screenshot 01). It is a clean list with **product
name in bold** and **one short line under it**:

| SchoolAI product | Its line |
|---|---|
| Spaces | Explore, create, and learn with an AI assistant |
| PowerUps | Enhance the learning experience in Spaces |
| Browser Extension | Bring SchoolAI to every tab |
| Notetaker | Stay present while AI takes notes |
| Mission Control | Instantly see who's thriving and who needs support |
| District Management | Manage AI across your district from one place |
| Student Portals | Give every student a personal learning portal |

Under the list, the menu has a **"Space code"** button (and a primary button under that). Klaro has
the same idea in its **join code**, so put a "Join code" entry in the menu the same way.

**Klaro's product list is not decided yet.** This is a list to *confirm with the owner*, taken from
what the site and the app show today:

- **Study view**: the lecture, the linked book pages and the practice questions side by side
- **Practice questions**: marked as you answer
- **Progress**: finished lectures, quiz marks, streaks
- **Course setup for tutors**: upload material, set the lecture order
- **Join codes**: students join a tutor's course with a code
- **Marking**: exam papers reviewed against the mark scheme, results released to students
- **Klaro Market**: the public course catalogue (`market/`)
- English and Arabic everywhere (this might be a cross-cutting point instead of a product)

Each product page needs the same template: a hero with a strong headline, a real product visual
(the existing "studio" animations in `index.html` show the style), how it works, who it is for, a
link to the related products, and a sign-up call.

## 3. Brand and look: what they want

> "https://schoolai.com/ this is perfect. Look at how the branding is done. I want us to have an
> identity like that, and our website to look respectable and tidy like that. You can copy from
> them."

> "I want to be more of SchoolAI than eduaiapp."

**The main reference is schoolai.com.** The other references below are praised for one thing each:

| Site | What they liked | What the screenshots show |
|---|---|---|
| **schoolai.com** | "Perfect." Branding, identity, a respectable and tidy site | Products menu with name and one line each; the join-code-style button (screenshot 01) |
| **khanmigo.ai** | "The respectable, well-raised ones" | Soft lavender header; headline "Khanmigo is your go-to AI-powered tool for education."; floating task chips ("Craft essay rubrics", "Write exit tickets", "Design lesson plans") with small icons; round photos of real teachers (screenshot 04) |
| **magicschool.ai** | "Respectable branding" | Deep purple field, sparkle stars, a confident line "The #1 AI platform for schools", a warm photo of a teacher and a student in a rounded frame (screenshot 04) |
| **curipod.com** | "This one is beautiful"; "the people here are respectable too" | Cream background, a serif accent in italic orange inside a sans headline, a calm insight card ("TOP MISCONCEPTION", "3 STUDENTS NEED HELP · flagged for follow-up" with initials avatars). Case-study cards with a quote, the lecturer's name, tags (university, subject, "~50 students per lecture") and "Read case study →". Research cards tagged "INDEPENDENT RESEARCH" with a peer-reviewed summary and topic tags (screenshots 05, 06) |
| **briskteaching.com** ([/solutions/students](https://www.briskteaching.com/solutions/students)) | "They use strong words" | Heavy condensed UPPERCASE headlines: "TURN ANY TEACHABLE MOMENT INTO AN ACTIVITY", "BUILT BY YOU. PERSONALIZED FOR THEM." A maroon block CTA with one pill button. Solutions pages per audience (screenshot 07) |
| **classcompanion.com** | Inspiration for "Try an assignment" | Dark green, a serif headline, a product screenshot of a graded assignment, and an interactive **"Try an assignment"** box: three dropdowns (grade, subject, question type) and one button (screenshot 07) |

The pattern to take from them: a calm, confident brand; plenty of whitespace; real product pieces
instead of stock AI art; short, strong words; credibility through research and real people;
structure through Products and Solutions menus. **Find the pattern that fits Klaro and build a
Klaro identity. Don't build a SchoolAI clone.** Borrow structure, layout ideas and tone. Don't copy
their text, logos, illustrations or images.

What stays Klaro: the purple and gold, the K mark and its spark, Manrope and Readex Pro (a serif
accent like Curipod's is open to try), and the real product pieces (lecture, book page,
past-paper question, join code). The app's design tokens live in `klaro.css` `:root` and come from
`klaro-beta-v2/apps/web/src/styles/tokens.css`.

## 4. What they don't want

> "https://eduaistudio.com/ — this is the peak of cringe. First of all, we don't like this site at
> all, so we don't want a design that looks like this."

> (About eduaiapp.com) "I want to stay away from their UI as much as we can, because it's cringey.
> And their framing."

**Anti-references: eduaistudio.com and eduaiapp.com.** Open both and write down what makes them
feel cheap: their UI *and* their framing (how they pitch themselves). Then check every design
against that list. Also avoid the generic "AI-powered everything" pitch. The motto says Klaro is
the opposite of that.

## 5. New pages and features

| Request (their words) | What to build |
|---|---|
| "Split every product into its own page" | `products/<name>/` pages and a Products menu in the header (section 2) |
| "I want articles that show we understand, and say *powered by research*" | A **Research** section: articles on how students learn (for example, studying with the source text next to the lecture, practice testing, spaced revision), each one citing **real, checkable studies**. Add a "Powered by research" line where it fits |
| "Put a career page for us" | A **Careers** page |
| "I want try-assignment" | An interactive **Try it** demo in the spirit of Class Companion's "Try an assignment" |

Notes:

- **Never make up research, citations, case studies, quotes, numbers or job openings.** If real
  material isn't available yet, build the layout with content clearly marked as an example (the
  repo already does this: "Courses, tutors and prices are examples"), and list what the owner has
  to supply.
- **Try it, the Klaro way.** Class Companion's demo shows AI feedback. Klaro's should show what the
  motto promises: the student picks a level (IGCSE / A Level / SAT), a subject and maybe a question
  type, and gets a small working study view. A lecture clip, the book page it links to, and a real
  practice question that marks the answer. It should be the tutor's own content, connected, not
  generated. Reuse the studio markup and animations already in `index.html` and `klaro.css`.
- **Case studies** (Curipod's cards) were shown and liked but not asked for directly. Offer them,
  and build them only with real stories.

## 6. Open questions for the owner (ask before building)

1. Which products get their own page? (The list in section 2 is a guess.)
2. Does Klaro produce lectures and questions from tutors' material, or only connect what the tutor
   already has? (Section 1. The current copy and the motto disagree.)
3. The Arabic version of the motto.
4. Research: which real studies or sources? Who writes the articles?
5. Careers: real open roles, or a general "work with us" page and an email address?
6. The playful heyclicky versions in `design/playful-versions/`: are they dropped now that the
   direction is "respectable and tidy"?
7. Are there real testimonials or case studies from the beta?

## 7. Constraints from the repo

- Plain HTML, CSS and JS, no build step (see `README.md`). With many pages, the header and footer
  would be copied into every file, so decide early how to share them: inject them with JS (as
  `market/market.js` already does in `chromeHTML()`), or bring in a small build step. **Ask the
  owner before adding a build step**, because deployment (GitHub Pages and Cloudflare via
  `wrangler.jsonc`) currently serves the folder as it is.
- Every page exists in **English and Arabic**: `page/` and `ar/page/`. Arabic is RTL, uses logical
  CSS properties only, no letter spacing, and no uppercase. The Brisk-style uppercase headlines
  need an Arabic equivalent that is just as strong (weight and size, not capitals). Course material
  inside product visuals stays in English on Arabic pages.
- Links into the app go through `<meta name="klaro-app">` and `data-signup` / `data-signin`
  (`klaro.js`). Arabic links add `lang=ar`.
- New top-level folders are served automatically. Keep notes out of the site: `design/` is
  excluded in `_config.yml` and `.assetsignore`, and any new notes folder needs adding to both.
- Light theme only, like the app. Respect `prefers-reduced-motion`.
- Fix the small issues found while reading the repo:
  - `market/market.js` hardcodes the app address instead of reading the meta tag.
  - There is no Arabic market, but `ar/` links to `../market/`.
  - `og:image` uses relative paths, which link previews can't load.

---

## How to run the work

This is how Mohamed and Claude agreed to work: **the session runs as an orchestrator** and sends
pieces of the work to several subagents, each owning one piece. The orchestrator plans, assigns,
merges, checks and reports. It does not write all the pages itself.

**Talk to Mohamed in Egyptian Arabic.** Repo files, code comments and commit messages stay in
English.

### Rules

1. **One owner per file.** Two agents never edit the same file at the same time. `index.html`,
   `ar/index.html`, `klaro.css` and `klaro.js` are shared by everything: give each one a single
   owner, or run the agents in separate git worktrees and let the orchestrator merge.
2. **English and Arabic together.** The agent that writes a page writes both languages.
3. **Foundation first, pages after.** Shared tokens, type, the header with the Products menu, and
   the footer land before the page agents start, so every page is built on the same parts.
4. **Explore, then build.** As with earlier work in this repo (`design/landing-versions`,
   `design/market-versions`), show 2–4 directions in `design/` for the owner to pick from before
   rebuilding the live site.
5. **Check before reporting done.** Open each page in the browser at desktop and phone width, in
   English and Arabic. Check links, RTL, keyboard focus and reduced motion.
6. **Commit locally. Ask before pushing or deploying.** A push to `main` goes live on GitHub Pages.

### Suggested phases and agents

| Phase | Agent | Owns | Output |
|---|---|---|---|
| 0 | Orchestrator | Asks the owner the open questions (section 6) | Answers recorded in this file |
| 1 | **Reference research** (read only) | `design/brief/patterns.md` | Goes through schoolai.com closely, then khanmigo.ai, magicschool.ai, curipod.com, briskteaching.com, classcompanion.com, and the anti-references eduaistudio.com and eduaiapp.com. Writes down nav and menus, type, colour, imagery, section rhythm, product-page template, research and articles, careers, demo, voice. Ends with "do" and "don't" lists for Klaro |
| 2 | **Brand directions** | `design/brand-versions/` | 2–4 directions for the new identity: home page hero, motto treatment, one product page, the Products menu. The owner picks one |
| 3 | **Foundation** | `klaro.css` (or a new shared CSS file), the shared header and footer | Tokens, type scale, components, the header with the Products menu and the join code entry, the footer with Research, Careers and Products |
| 4, in parallel | **Home** | `index.html`, `ar/index.html` | The new home page with the motto as the bold statement |
|  | **Product pages** | `products/`, `ar/products/` | One page per confirmed product, from one shared template |
|  | **Research** | `research/`, `ar/research/` | The research hub and its articles (real sources only) |
|  | **Careers** | `careers/`, `ar/careers/` | The careers page |
|  | **Try it** | `try/`, `ar/try/`, its own JS | The interactive demo |
| 5 | **QA** (read only, reports back) | — | Broken links, RTL, phone layout, accessibility, copy that drifts from the motto, anything that looks like the anti-references |
| 6 | Orchestrator | — | Merges, fixes what QA found, commits locally, reports to Mohamed in Egyptian Arabic, and asks before any push or deploy |

---

## Their words (original, for reference)

Mohamed, in the Claude Code session:

> https://eduaistudio.com/. ده قمة البلح
> أولاً كده، الموقع ده مش عاجبنا خالص، فمش عايزين نعمل design نفس ده بالظهور.
> أنا هبعتلك كذا مثال، مثال حاجات مش عايزينها ومثال حاجات عايزينها أو حابين شكلها، فانت القط بقى الـ pattern المناسب اللي احنا نقدر نعمله لينا.
> https://schoolai.com/ this is perfect
> شوف الbranding عامل ازاي عايز يبقى عندنا هوية كده وشكل الويبسايت بتاعنا يبقى محترم ومرتب كده ممكن تنسخ من عندهم ابغى articles تبينا فاهمين وقول powered by research بقى وبتاع
> ابغى تراي اساينمنت

Omar, in the WhatsApp chat (screenshots in `refs/`):

> ممكن نقسم كل product عندنا في page لوحده
> ممكن تحط كمان bold statement كده
> ENOUGH AI SLOP / WE DONT GENERATE AI CONTENT LIKE EVERYBODY DOES / WE CONNECT YOUR CURRENT CONTENT EXACTLY HOW YOU INTENDED IT TO LOOK - NO AI SLOP
> ده ال moto بتاعنا
> (eduaiapp.com) وعايز نبعد عن ال ui بتاعهم على قد ما نقدر … والframing بتاعهم
> I want to be more of schoolai than eduaiapp
> (khanmigo.ai) المحترمين ولاد الاصول
> (magicschool.ai) يحترم Branding
> (curipod.com) هذي جميله … حطلنا career page … الناس دي محترمة برضو
> (briskteaching.com/solutions/students) هذول يستخدمون كلمات قوية
> (classcompanion.com) Try an assignment
