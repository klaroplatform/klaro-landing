# Reference patterns for the new Klaro site

Phase 1 output (reference research, 2026-10-08). Input for the brand, foundation and page agents.
Read with [README.md](README.md). Everything here describes structure, layout and tone. **Never
copy the references' text, logos, illustrations or images.**

Sources: schoolai.com (home, menus desktop and mobile, /products/spaces, /products/mission-control,
/products/notetaker, /school-leaders, /research, one research article, /careers, /about, /blog,
/stories), curipod.com (home, /case-studies, /c/careers), briskteaching.com/solutions/students,
classcompanion.com (home and the "Try an assignment" preview), khanmigo.ai, magicschool.ai, and
the anti-references eduaistudio.com and eduaiapp.com (live site plus the 2026-06-07 archived
version). Computed fonts and colours were read from the live pages.

---

## 1. Navigation and menus

| Site | Desktop header | Menus | Join-code entry | Mobile |
|---|---|---|---|---|
| **SchoolAI** | Wordmark left; centre: Products ▾, Solutions ▾, Resources ▾, Trust & Safety, Pricing; right: "Join a Space" (white pill), Sign in (pale blue pill), Demo (blue pill). Nav text 14px/500. Open trigger turns into a black pill | **Products**: one-column dropdown, ~360px wide, white, r≈16px, soft shadow. Each row: 32px rounded-square icon tile (outline line icon) + **name** 14px/500 + one grey line 12–13px. 7 rows. **Solutions**: 3-column mega-menu by audience (Teachers, Students, District Leaders): icon tile, heading, dotted rule, plain links. **Resources**: same as Products (AI Readiness, Research & Evidence, Blog, Integrations, Stories, Help Center) | "Join a Space" in the header; "Enter a Space Code" in footer and Solutions › Students | Full-screen sheet. Rows with › chevrons and hairlines; tapping drills in ("‹ Back"), and the product list shows name + line (this is screenshot 01). Bottom stack of three full-width pills: **Space code** (outline), Sign in (pale), Get a demo (primary) |
| Curipod | Logo, then an **"Enter pin to join" input + Join button right in the header**, language picker; right: Solutions ▾, Impact & Efficacy ▾, Resources ▾, Pricing, Log in, Sign up (orange) | Dropdowns | Pin field in header | — |
| Class Companion | Logo; Teachers ▾, Schools & Districts ▾, Resources ▾, **Join code**, Log in, Sign up for free | Dropdowns with item + one line | "Join code" text link | — |
| Brisk | Floating white bar (r 10px) over a coloured hero: Platform ▾, Solutions ▾, Resources ▾, Pricing; Login, Book a call (outline pill), Get started free (dark pill) | Solutions grouped: Built for (audiences) / By subject / By platform | — | — |
| MagicSchool | Promo strip on top; AI Solutions ▾, Outcomes ▾, Resources ▾, Pricing; Login, two outline buttons | Big mega-menu: audience columns with short lines, a "Why" row of six links, a dark promo card on the right, a utility row at the bottom | — | — |
| Khanmigo | Minimal: Learners, Parents, Writing Coach (with "New" badge), Districts ↗; one blue button | Small | — | — |

**Pattern to take:** a short, quiet top bar (3–5 text items at 14px) with one coloured primary
button; menus are lists of *name + one line*, not icon grids; the student join entry always sits
in the header, outside the menus. Three of the six references put a join/pin/code entry in the
header. Klaro's join code belongs there too.

## 2. Type

| Site | Display face | Headline weight / case | Sizes seen (desktop) | Body |
|---|---|---|---|---|
| **SchoolAI** | General Sans (geometric grotesk) | **500**, sentence case, tracking ≈ −0.024em | H1 81/88px; section H2 64/72px; feature H2 32/35px; card H3 25–40px | Lead 25/32px grey `#3a3f48`; nav 14/500 |
| Brisk | **Anton** (heavy condensed) | UPPERCASE, line-height 1.0, almost no tracking | H1 108px; feature H2 56px; block heads 80px | DM Sans 14–16px |
| Curipod | Nunito (rounded) | 700–900, sentence case | 36–48px | Nunito. **Source Serif 4** inside the product cards, with the key phrase in *orange italic*; Caveat handwriting for small notes; tiny letter-spaced caps labels ("TOP MISCONCEPTION") |
| Class Companion | New Spirit (soft display serif) | 400, sentence case | H1 42px; H2 32px | Sans |
| Khanmigo | Lato | **400** (light and friendly) | H1 48px; H2 44px | Lato |
| MagicSchool | Jokker | 600, sentence case | H1 64px; H2 40px | Sans |
| *eduaiapp (anti)* | Newsreader serif with an italic second line | 400 | H1 68px; H2 44px | Geist |

Takeaways:
- Respectable sites use **medium weights (400–600) at large sizes**, sentence case, slightly
  negative tracking. Klaro's `.display` (Manrope 600, −0.05em) is already in this family.
- Heavy uppercase (Brisk) works as **one loud moment per page** (hero or closing block), never
  for every heading. That is the right home for the motto.
- A serif accent works when it is confined to *product content* (Curipod's insight card) or a word
  or two. A whole serif headline with an italic second line is now a template cliché (see §11).
- SchoolAI puts a **hand-drawn yellow underline** under one key phrase in each H1 ("every
  student"). Klaro's equivalent should be its own gold mark (the spark, or a straight gold bar),
  not a copy of that brush stroke.

## 3. Colour

| Site | Page field | Accent | How much colour |
|---|---|---|---|
| **SchoolAI** | Warm off-white `#f3f3f0` (Klaro's `--page` is `#f3f3f1`, nearly the same) | One blue `#2869dd` for primary buttons and links; pale blue `#bcd1f4` for secondary; yellow only for the underline and small tags | Calm. Colour sits inside product frames (blue gradient fields behind UI crops) and in **one deep navy panel** ("Built on trust") per page |
| Curipod | Cream `#f9f3eb` | Orange; pastel panels (peach, mauve) behind visuals; teal for research cards | Warm, soft, pastel |
| Brisk | White and cream | **Maroon `#6e1841` full-bleed blocks** (hero, final CTA), lilac pill buttons | Bold blocks, few of them |
| Class Companion | White | Deep green field for hero and demo; mint text accents | One dark field at the top |
| Khanmigo | White | Lavender band `#e0d6f4` for the hero; blue buttons | Soft |
| MagicSchool | Deep purple + peach-to-purple gradient | Purple, sparkle stars, sticker labels | Loud; the most "marketing" of the set |

**Pattern:** a light neutral page, **one** action colour, and at most one or two deep full-width
fields per page used for the moments that matter (motto, trust, final call). Klaro already has
this palette: page `#f3f3f1`, ink `#171717`, purple `#9254e0` / `#7538bb`, gold `#f0c93d`,
purple-soft `#f1e8fb` (close to Khanmigo's lavender band).

## 4. Imagery

| Site | What they show |
|---|---|
| **SchoolAI** | Real **product UI crops** placed on a blue gradient field inside a white-bordered rounded frame (r≈24px). Hero and closing use a signature *stippled/risograph illustration* mosaic (astronaut, Colosseum, frog). Round headshots in testimonials. Compliance badges |
| Curipod | Product UI rebuilt as calm editorial cards (insight card, word cloud), simple diagrams (1 → 2 steps), a photo in the hero |
| Brisk | Product UI composited over a blurred classroom photo; portrait photo in hero |
| Class Companion | Large screenshot of a graded assignment in a rounded frame |
| Khanmigo | Collage: chat bubbles, round teacher photos, floating task chips with small icons |
| MagicSchool | Cut-out teacher/student photos, sparkles, sticker labels, grid of tool cards each with a photo |

**Pattern:** the product is the hero image. Photos are of real people (testimonials, careers)
and never stand in for the product. Klaro has no illustration system and should not invent one
from stock or AI art: its "illustration" is the studio (lecture, book page, question, join code).

## 5. Section rhythm

### SchoolAI home (in order)
1. Hero: "SchoolAI for… [Teachers | Leaders | Students | Higher Ed]" audience chip; H1 (3 lines,
   underlined key phrase); one-sentence sub; two audience buttons ("I'm a …"); compliance badges;
   illustration mosaic on the right.
2. Demo video (poster + "See how it works").
3. Testimonial carousel (round photo + quote + name/role).
4. Logo wall.
5. Four feature cards in a 2×2 grid: coloured ribbon tag, UI visual, H2 32px, 2–3 lines, "Learn
   more →" to the product page.
6. Product grid (5 cards: icon, name, 2 lines) under a 64px centred H2.
7. Research: centred H2, then **stacked sticky cards**: source line in blue, title, summary,
   authors, sample, "Read the research" on the left; 2–3 big-number stat tiles on the right.
8. "Built on trust": a deep navy rounded panel, badges, 2×2 commitments, one button.
9. Final call: centred "Ready to get started?", two buttons, floating illustration tiles.
10. Footer, ending with a giant tagline on a pale arc.

Klaro's current home already has the same audience idea (student/tutor switch).

### Others in one line each
- **Curipod:** photo hero → logo wall → one result stat → alternating text/visual rows (each with an
  underlined "See … →" link) → curriculum list → privacy → video → final call.
- **Brisk (solutions/students):** maroon hero with heavy uppercase H1 → product sub-brand with 6 icon
  cards → 4 alternating feature rows (pill label, uppercase H2, *problem paragraph then solution
  paragraph*, pill CTA + "Explore … ›") → 3 result cards → trust → testimonials → 3 "get started"
  steps → maroon closing block with an uppercase line.
- **Class Companion:** dark green hero (serif H1, screenshot) with the **Try an assignment box
  directly under it** → logos/stat → "Easy as 1-2-3" → features → testimonials → outcomes → FAQ →
  privacy.
- **Khanmigo:** lavender hero → three audience columns with buttons → press quotes in italics →
  alternating audience rows → praise → FAQ → final call.

## 6. Product-page template (SchoolAI, shared by every product page)

| # | Section | Detail |
|---|---|---|
| 1 | Hero | Small grey chip with the product icon and name; H1 (2 lines, one underlined phrase); 2–3 sentences; **one** primary button; rotating UI screenshots (or one big framed UI below) |
| 2 | Proof line | Centred short paragraph with one research figure and a link to the study |
| 3 | Feature rows ×3–5 | Alternating text/visual. H2 is a plain benefit sentence ("Know where every student landed…" style); 2 sentences; text link "Get a demo →" or "Learn about [other product]" (cross-links live here) |
| 4 | Card carousel | "Turn X into Y" heading, 3–4 cards: UI crop on blue top, title, 1–2 lines, arrow buttons |
| 5 | Trust | The navy panel, reused verbatim on every page |
| 6 | Testimonials | 2 quotes about this product |
| 7 | Integrations | One band |
| 8 | Closing | Centred H2 naming the product, 1 sentence, one button |

Notes: no eyebrows/kickers on sections; one CTA label repeated everywhere; related products are
reached through cross-links in feature rows and the footer, not a "related" grid. Klaro should add
an explicit related-products row (the brief asks for it).

## 7. Research and articles

| | SchoolAI /research | Curipod /case-studies |
|---|---|---|
| Hero | Grey chip, H1 with underline, one sentence | Orange band, small caps eyebrow, H1, subtitle, two buttons |
| Featured | One wide blue panel: yellow "Featured research" ribbon, title, summary, dark "Read article" pill, report-cover image | — |
| Filters | None | Row of ~18 pill chips (subject, test, audience, "Independent Research"); selected chip is filled orange |
| Card | Report-cover image, title, month + year, 1–2 sentence summary with the sample size and result | **Case study:** orange header block with a big metric ("+20 pts") and a label; title; subtitle; quote with an orange left rule, name and role; tag pills (school + state, grade/subject, years, class size); "Read case study →". **Research:** teal header with an emoji, "INDEPENDENT RESEARCH" chip, 1–2 sentence summary, topic tags, "Read the research →" |
| Article page | Back link; title; image; one-sentence deck; two PDF buttons (full and quick report); 5 long paragraphs of prose with figures inline; **no section headings, no numbered references**; 2 related cards | — |
| Citations | Source institution and authors on home cards; none in the article body | None (no journal, year or DOI) |

**Gap Klaro can own:** neither reference shows proper citations. Klaro's articles are about how
students learn (practice testing, spacing, studying with the source text), so they can carry real
numbered references with DOI links, which makes "Powered by research" credible instead of a
slogan.

## 8. Careers

| | SchoolAI /careers | Curipod /c/careers |
|---|---|---|
| Hero | "We're hiring" chip (with a wave emoji), centred H1 with underline, one sentence, "See open roles" button | One provocative sentence as H1, short mission paragraph |
| Body | Office video; "Why work at …" (text + photo); "What we're building" (3 audience bullets with check icons); one-line mission; 8 values as bare labels | Two values with a paragraph each; 6 benefits with icons (remote, growth, salary…); investor logos; employee quote cards |
| Roles | Not on the page; button goes to an external ATS | Two roles: title + location line, linked to Notion pages |
| Fallback | None | None |
| Tone | Warm, mission-led, short | Energetic, informal |

**Pattern:** careers pages are short. Mission, how we work, roles, one call. Neither page needs
stock photos. Klaro should add a fallback ("No role that fits? Write to us") because it may have
no open roles at launch.

## 9. The demo pattern (Class Companion "Try an assignment")

- **Where:** a dark green rounded panel directly under the hero, full content width. It is part of
  the first screen.
- **Heading:** serif, 32px.
- **Inputs:** three native selects in one row: *Level* (4 options: AP, 11th, 7th, 4th grade),
  *Subject* (9 options), *Format* (Short answer, Essay, Multiple choice). Defaults are pre-set, so
  the button works with zero choices.
- **Button:** "→ Try assignment" (a plain link that changes with the selection; no form, no
  account).
- **Honesty note:** an ⓘ line under the row saying the real product covers more subjects than the
  demo.
- **Result:** a separate full-screen "playground" page: a top banner ("try it in action" style
  title plus an instruction to answer wrongly or ask for help on purpose), a Back link, a Sign up
  button, and the sample assignment below. (The assignment itself did not render in the session;
  the frame and banner did.)

The ideas to keep are pre-filled choices, one click, no sign-up, a clear "this is a demo" banner,
and an invitation to make a mistake so the product's response shows.

## 10. Voice and copy length

| Site | Tone | Headline length | Sub length | Notes |
|---|---|---|---|---|
| **SchoolAI** | Calm, plain, benefit-led | 3–8 words | 1 sentence (hero), 2 (sections) | Repeats one idea ("every student") everywhere. Few adjectives. Trust claims are concrete (named certifications, named studies) |
| Brisk | Strong, direct, confident | 3–7 words, often two short sentences in parallel | Problem sentence, then solution sentence | "Strong words" = short imperative or declarative lines, not superlatives |
| Curipod | Practical, teacher-to-teacher | 4–8 words | 2–3 sentences | Names real curricula, frameworks and agencies |
| Khanmigo | Warm, second person | 5–9 words | Very little | Borrows credibility from the nonprofit and the press |
| MagicSchool | Upbeat, promotional | Short | Triads ("save time, spark…") | "#1", "magic", unsourced stats. Respectable *look*, louder words |

Klaro voice target: SchoolAI's calm sentences, with Brisk's punch saved for the motto and closing
lines. Concrete nouns (lecture, book page, past paper, mark scheme, join code) instead of "AI".

---

## 11. Anti-references: what looks cheap

### eduaistudio.com ("the peak of cringe")
- The hero has **no headline**. It is a dark navy "command centre" of fake dashboard tiles:
  glowing orbs, a neural-net sphere, 3D bar charts, falling binary digits, monospace HUD labels
  ("STREAMING", "PULSING", "ACTIVE"). Decoration pretending to be the product.
- A word-by-word uppercase ticker making a claim to be one of the first, with a ™ on an invented
  category ("AI-Native School Operating System™").
- Hamburger-only menu even on desktop; a robot-avatar chat bubble floating bottom-right.
- **Invented branded jargon for everything** ("Fortress" security, a "Council" of 24 AI personas,
  a "Sniper", a "Sub-Zero protocol", "Aura points") plus tech words to sound clever ("high-
  dimensional vector database").
- **Kitchen-sink scope:** grading, IEPs, hall passes, cafeteria pre-orders, a school currency.
  There is no focus.
- A wall of 12 testimonials signed "Educator 1", "Student A." with letter avatars. They read as
  made up.
- Generic 3-card grid with an icon in a tinted square; words in a headline coloured green for
  emphasis; "Request **Verified** Demo"; a demo form embedded mid-page; stats that are not stats
  ("100% transparency", "Always"); a 25-question FAQ with duplicated answers.

### eduaiapp.com (the UI *and* the framing)
Archived version (June 2026), the generic SaaS template:
- Title "Homework Helper / solve any math problem": **the product does the student's work**.
- Blue gradient-tinted brand words, a flag emoji in the language picker, exclamation marks ("Try
  web now! It is free", "coming soon!"), "Join Now For Free".
- A pill eyebrow badge above every heading ("SCAN, ASK & SOLVE INSTANTLY!"), every section
  centred, a 3×2 grid of pastel icon cards, "Loved by Students Everywhere", "Got Questions? We Have
  Answers", "24/7 AI tutor", "fast and accurate results".

Live version (October 2026), the "AI-generated landing page" kit:
- Newsreader serif headline with an *italic second line*, Geist body, off-white page, a bento
  grid of six features, "01 / 02 / 03" steps, a pull quote, a stat strip whose "stats" are words
  ("Every answer", "On-device"), and two near-identical buttons ("Start free" / "Try it free").
  Tidy, but it looks like every other generated page. It is literally the look of AI slop.
- Framing: turn your material into a tutor; notes "that write themselves"; "writes the notes for
  you". **It generates new content from the student's material, which is the opposite of
  Klaro's motto.** The meta title still says "AI Math Solver & Homework Helper" (identity
  mismatch), and the blog is SEO listicles ranking itself the top pick.
- Owl mascot logo.

Its pitch (answers cite the page) is close to Klaro's on the surface. Klaro must make the
difference explicit: **the tutor's own lecture, linked to the tutor's own book pages and real past
paper questions, in the order the tutor set. Nothing is generated.**

### "Looks cheap" checklist (check every Klaro design against it)
- [ ] Any gradient on text, glow, neon, or dark sci-fi dashboard visuals
- [ ] Sparkles/stars scattered as decoration (Klaro's spark appears as a mark, once per view)
- [ ] Stock photos, AI-generated art, mascots, robot avatars, emoji in UI or headings
- [ ] A pill eyebrow badge above every section heading
- [ ] Everything centred; 3×2 grids of icon-in-tinted-square cards
- [ ] Bento grid + 01/02/03 steps + pull quote + word-stats, all on one page (the generated-page kit)
- [ ] Serif headline with an italic second line
- [ ] Superlatives and hype: "#1", "best", "revolutionary", "instantly", "in seconds", "24/7",
      "AI-powered" as an adjective, "magic", "supercharge", exclamation marks
- [ ] Invented branded names for features, ™ on categories, tech jargon in marketing copy
- [ ] Numbers without a source, animated counters, "100%"-style non-stats
- [ ] Anonymous or initials-only testimonials; any quote, logo or case study that is not real
- [ ] Two buttons that say the same thing; forms in the middle of a page
- [ ] Hamburger-only nav on desktop; floating chat bubble
- [ ] Copy that says Klaro *generates* lectures, notes, answers or questions
- [ ] More than one loud uppercase block per page

---

## 12. Do / Don't for Klaro

**Do**
1. Keep Klaro's tokens: page `#f3f3f1`, white cards, ink `#171717`, purple `#9254e0` as the
   **only** action colour, gold `#f0c93d` for the spark and one accent per view, purple-soft
   `#f1e8fb` for quiet bands. Light theme only.
2. Use **one deep field per page** (purple-dark `#7538bb` or ink) for the motto or the closing call.
   That is the SchoolAI navy panel and the Brisk maroon block, in Klaro colours.
3. Headlines: Manrope 600 (Readex Pro 600–700 in Arabic), sentence case, tight negative tracking
   at large sizes; one key phrase marked with a gold bar or the spark.
4. The motto is the single heavy moment: Manrope 800, UPPERCASE in English, very large (about
   clamp(48px, 9vw, 128px)), line-height ≈ 0.95, tracking 0 or slightly negative (never wide), on
   the deep field. "Enough AI slop." alone on the first line, the rest smaller beneath.
5. Show the product: reuse the studio pieces (lecture, book page, past-paper question, join code,
   progress) as the visual for every section. Frame crops in a white rounded frame (r 24px) on a
   purple-tint or purple-soft field.
6. Product pages open with a small chip (icon + product name) above the H1, not an eyebrow line.
7. Copy lengths: H1 ≤ 10 words; hero sub ≤ 2 sentences; section H2 = one plain benefit sentence;
   body ≤ 2 sentences; one CTA label per audience used everywhere ("Create a student account",
   "Apply as a tutor").
8. Brisk-style "strong words" = short declaratives in pairs, problem then answer. Use concrete
   nouns: lecture, book page, past paper, mark scheme, join code.
9. Put the join code in the header, the Products menu, the mobile menu and the footer.
10. Keep Klaro's rectangular buttons (40/48px, r 9–11px). Everyone else uses pills, so this is a
    free point of identity.
11. Give credibility with real, linked sources (numbered references, DOIs), real names, and
    "example" labels where content is a placeholder.
12. Keep `prefers-reduced-motion`: reveal-on-scroll is fine; nothing loops forever.

**Don't**
1. Don't copy any reference text, taglines, product names, illustration styles (no stippled
   mosaics), logos or images.
2. No stock photos of smiling students, no AI art, no mascots, no emoji.
3. No superlatives, no "#1", no "AI-powered" headline adjectives, no "instantly / 24/7".
4. No unsourced numbers, animated counters, compliance badges Klaro doesn't hold, or invented
   testimonials and case studies.
5. No eyebrow pill on every section; no 3×2 icon-card grids; no bento-plus-steps generated kit.
6. Don't present Klaro as an "AI" product. Never say it generates lectures, notes or questions.
   (Resolve open question 2 in the brief first.)
7. No wide letter-spacing on headings, and no uppercase except the motto (and small 11px kickers
   in English only).
8. Don't hide navigation behind a hamburger on desktop.

---

## 13. Proposed Klaro site map

### Header (desktop, inline-start → inline-end)
`[K Klaro]`  ·  **Products ▾** · **Research** · **Careers** · **Try it**  ·  `[Join code]` (outline)
· Sign in (quiet) · **Get started** (purple) · عربي

- 14px/600 nav text, 64px bar, sticky, page-coloured background with a hairline on scroll.
- If the bar gets crowded at 1024px, Careers moves to the footer only (SchoolAI keeps it there).
- Current "Courses" link becomes Klaro Market inside the Products menu.

### Products menu (products are to be confirmed by the owner)
A panel about 600px wide, two columns, rows of icon tile (32px, purple-soft, outline icon) + name
(14px/600) + one line (13px, muted):

| For students | For tutors |
|---|---|
| **Study view**: the lecture, the book page and the questions, side by side | **Course setup**: upload your material and set the lecture order |
| **Practice questions**: real past-paper questions, marked as you answer | **Marking**: review papers against the mark scheme and release results |
| **Progress**: lectures finished, quiz marks and streaks | **Klaro Market**: put your course where students can find it |

Bottom row of the panel (hairline above): **[Have a join code? Enter it]** button on the inline
start; "See it working → Try it" link on the inline end. English/Arabic can be a footnote line,
not a product.

Mobile: a full-screen sheet with drill-in rows (Products ›, Research, Careers, Try it), product
rows showing name + line, and a pinned bottom stack: **Join code** (outline), Sign in (purple-soft),
Get started (purple).

### Footer
| Klaro | Products | Students | Tutors | Company |
|---|---|---|---|---|
| K mark, one-line description, language switch | All products from the menu | Join a course with a code · Create an account · Klaro Market · Try it | Apply as a tutor · Course setup · Marking | Research · Careers · Contact · Terms · Privacy |

Below the columns: the motto's first line as a large closing statement ("Enough AI slop." on its
own, ink on page, or white on purple-dark), then a legal row with © 2026 Klaro.

### Section order per page

**Home**
1. Hero: student/tutor switch, H1, sub, two buttons, studio visual.
2. Try it strip (directly under the hero): Level · Subject · Question type → "Open the study view".
3. Motto block: deep purple field, ENOUGH AI SLOP and the two follow-up lines, then one plain
   sentence on what "connected" means and a link.
4. Products: cards with studio crops, "Learn more →" to each product page (switches with the
   audience).
5. How it works: 3 steps (tutor uploads → sets the order and shares a code → student studies side
   by side).
6. Powered by research: 3 article cards.
7. Proof: testimonials or case studies, **only if real**; otherwise leave the section out.
8. FAQ (existing).
9. Closing call: sign up, plus the join code.

**Product page** (one template)
1. Hero: product chip, H1, 1–2 sentences, primary button + "Try it" secondary, studio visual.
2. How it works: 3 short steps.
3. Feature rows ×2–4, alternating, each with a real studio crop.
4. Who it's for: student card and tutor card.
5. Powered by research: one article card that matches this product.
6. Related products: 3 cards (name + line + link).
7. Closing call on a deep field, echoing the motto in one line.

**Research hub**
1. Hero: "Research" chip, H1, one sentence on why Klaro works the way it does.
2. Featured article: wide card.
3. Topic chips (e.g. practice testing, spacing, studying with the source text, feedback).
4. Article grid. Card: topic tag, title, one-line takeaway, "N sources" chip, read time, date.
5. "How we use research": 3 short rules (peer-reviewed, linked, we say what a study doesn't show).
6. Call: Try it.

**Article**
1. Back link, topic tag, H1, one-sentence deck, author · date · read time · N sources.
2. Key points box: 3 bullets.
3. Body with H2s and numbered citations [1].
4. "What this looks like in Klaro": a studio crop + link to the product page.
5. Limits: what the research does not show.
6. References: numbered list with authors, year, title, journal and DOI link.
7. Related articles (2–3) and a closing call.

**Careers**
1. Hero: H1, one sentence, "See open roles" (or "Write to us" if there are none).
2. What we're building: 3 short points tied to the motto.
3. How we work: 3–4 values, one sentence each.
4. Open roles: rows with title, team, location/remote, type and "Apply →", or an honest empty
   state with an email address (the owner supplies roles and email).
5. How hiring works: 3 steps.
6. Closing call: email.

**Try it**
1. Banner: "You're using a sample course", one line on what to do (answer one question wrong on
   purpose), Back link, Sign up button.
2. Picker: Level (IGCSE / A Level / SAT) · Subject · Question type, pre-filled.
3. Study view: lecture clip, the book page it links to (highlighting the passage), a past-paper
   question with "Check answer" that marks it and points to the mark-scheme line and the book
   passage.
4. "What you just saw": three notes (the tutor's lecture, the tutor's book page, a real
   past-paper question) that are *connected, not generated*.
5. Call: create a student account / apply as a tutor; an "example content" note.

---

## 14. Arabic notes

- **Headlines without capitals.** Arabic has no uppercase, and letter-spacing breaks the joined
  letters. Readex Pro carries the force through **weight and size**: motto in Readex Pro 700 at about
  1.1× the English size, line-height 1.15–1.25 (Arabic needs more than Latin's 0.95), no
  `text-transform`, `letter-spacing: 0`. Keep English uppercase in a class that Arabic pages
  override (`[lang="ar"] .motto { text-transform: none; letter-spacing: 0; }`).
- **Same punch, fewer words.** Make the Arabic first line just as short (2–3 words) and set it alone.
  The owner must approve the Arabic motto before it ships.
- **No italics.** Arabic has no true italic, so a serif/italic accent becomes a colour or weight accent
  (purple or gold, 700). The gold underline should sit lower or become a highlight bar behind the
  word, because Arabic descenders cut through a tight underline.
- **Kickers:** the 11px uppercase letter-spaced `.kicker` becomes 13px Readex Pro 600, normal case,
  no tracking.
- **Menus in RTL:** the whole bar mirrors (logo on the right, buttons on the left); dropdowns align to
  the trigger's inline start; icon tiles sit at the inline start of each row; › chevrons and → arrows
  flip (`.flip`); the mobile drill-in "Back" arrow points right. Use logical properties only.
- **Mixed text:** join codes, course codes (0620) and course material stay LTR. Wrap them in `<bdi>`
  or `dir="ltr"` so punctuation doesn't jump. Product visuals keep English course content.
- **Numbers:** use Western digits on both sides for consistency with course material, unless the
  owner prefers Arabic-Indic digits for prose.
- **Line length:** Arabic runs longer. Allow 10–15% more width in menu panels and buttons, and test
  the Products panel at 1024px in Arabic.

---

## 15. Not accessible / gaps

- **classcompanion.com** returned 403 to text fetching. It was viewed in the browser instead. The
  sample assignment inside the "Try an assignment" preview page did not render in either the
  built-in browser or Chrome; only its banner and frame did.
- **curipod.com/learning-principles** returned no body text, so how Curipod cites its research
  principles was not checked.
- **web.archive.org** could not be text-fetched. The June 2026 eduaiapp.com snapshot was viewed in
  the browser before browser use was stopped.
- **schoolai.com/blog** listing and **/stories** detail pages returned little text; their card
  layouts are not described here.
- The anti-reference analysis of eduaiapp.com covers both the live October 2026 site and the June
  2026 archive, because it is not known which one the owners saw. Both versions fail for the
  reasons listed in §11.
