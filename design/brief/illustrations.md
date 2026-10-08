# Illustrations and scene plates: files, uses and alt text

Written 2026-10-08 by the illustration agent. Read with [redesign.md](redesign.md) §7.9, §8.2 and §8.3
(the plan this list follows) and [arabic.md](arabic.md) (the register used for the Arabic alt text).

**Status (2026-10-08, evening): all 20 illustrations are done. The seven plates (P1 to P7) are
still missing.** Both image tools ran out before the plate run:
- Gemini stopped sending prompts. It sent nothing, with no error message, on both the Pro and Flash
  models.
- ChatGPT's free plan hit its image limit ("You're out of images"). It resets at about 19:10
  tomorrow (2026-10-09).

The plates now follow the owner's new approach: the device is drawn into the scene with a green
screen. The full spec, device types and measuring script are in
[Scene plates](#scene-plates-imgplates-missing).

## Style and process

- **Style C, cut paper**, the owner's pick from [`design/image-styles/`](../image-styles/index.html).
  It replaces the riso wording in §8.2: same inks and rules, but cut paper instead of print grain.
- **Made with:**
  - **01 to 17:** Gemini's Images tool, model "Pro" (Nano Banana Pro), aspect ratio 1:1. The
    originals are 2048×2048 JPEGs.
  - **18 to 20:** ChatGPT's image generation, free plan. Gemini had stopped sending, so ChatGPT was
    the fallback. The originals are 1254×1254 PNGs.
  - For 18 to 20, three finished images went in as style references: 01, 09 and 14. The prompt
    began `Create a new square 1:1 image. Match the cut-paper style of the reference images exactly
    … Do not copy their subjects.`, followed by the same subject and recipe text. The three match
    the Gemini set closely: same papers, palette, light and off-white ground.
- **Prompt:** `Generate an image. Subject: <subject>. Style recipe: <recipe>`. After the first image
  in a chat, each prompt started with `Generate a new, separate image (not an edit of the previous
  ones) in exactly the same style.` The recipe, word for word:

  > handmade cut-paper collage, layered pieces of matte coloured paper with crisp scissor-cut and
  > slightly torn edges, visible paper fibre texture, soft natural shadows between the layers giving
  > gentle depth, like a paper-craft piece photographed flat in soft daylight. Limited palette: violet
  > purple (#9254e0), deep grape purple (#7538bb), soft lavender (#f1e8fb), golden yellow (#f0c93d)
  > accents and tiny ink-black (#171717) details, on a plain warm off-white paper background
  > (#f3f3f1). Tactile, crafted, human and calm. The subject centred and small enough to leave
  > generous empty background on every side. Square 1:1. No text, no letters, no numbers, no labels,
  > no logos, no faces, no glossy 3D render, no plastic look, no glow, no neon, no blue, no pink.

- **Checked:** every image was checked at full size. None has letters, numbers, logos, faces or a
  watermark. The pages and papers show only abstract strips or scribbles. Two images were made a
  second time (see the notes under the table).
- **Conversion:** `cwebp` isn't installed, so the files are real WebP made with **ffmpeg's libwebp**
  (`-quality 82 -compression_level 6 -preset drawing`, Lanczos scaling).
  - Illustrations are 1200×1200 and 19 to 54 KB each, well under the 120 KB budget.
  - The opening-collage tiles are 480×480 at quality 80, 8 to 20 KB each.
- **Originals:** `design/image-styles/originals/ill/<slug>.jpg` (01 to 17, Gemini) and
  `<slug>.png` (18 to 20, ChatGPT). These are the untouched downloads; `design/` isn't published.
- **Background:** the paper background is warm off-white with a faint vignette, a little darker at
  the bottom right. It is not exactly `#f3f3f1`. On a white card it reads as the picture's own paper.
  If an image has to melt into the page, give the card a `#f1f0ec`-ish fill, not a padded flat colour.
- **Crops:** the 4:5, 16:10 and 4:3 crops in §8.2 can be done with CSS `object-fit: cover`, because
  every subject sits in the middle with empty paper around it. Images 13 and 14 fill more of the
  frame, so crop those only lightly.

## Illustrations (`img/ill/`)

| File | Subject as drawn | Used on (plan §8.3) | Alt (EN) | Alt (AR) |
|---|---|---|---|---|
| `01-connected.webp` | Open course book, film strip and exam paper joined by one looping gold thread | Deep panel; research featured; share image (see `01-connected-og.jpg`) | An open course book, a film strip and an exam paper, joined by one gold thread. | كتاب كورس مفتوح وشريط فيلم وورقة امتحان، يربطها خيط ذهبي واحد. |
| `02-book-passage.webp` | Open textbook, ribbon bookmark, one passage of strips in gold | Study view (carousel, mosaic); research card 1 | An open textbook with a ribbon bookmark and one passage marked in gold. | كتاب مدرسي مفتوح بشريط علامة، وفقرة واحدة مظلّلة بالذهبي. |
| `03-parcel.webp` | Book, spiral notebook, film reel and exam papers tied with gold string and a bow | Course builder | A book, a notebook, a film reel and exam papers tied together with gold string. | كتاب ودفتر وبكرة فيلم وأوراق امتحان مربوطة معًا بخيط ذهبي. |
| `04-empty-desk.webp` | Empty chair turned away from a desk, lamp on, closed notebook | 404 page | An empty chair turned away from a desk lit by a lamp. | كرسي فارغ مُدار بعيدًا عن مكتب يضيئه مصباح. |
| `05-lamp-laptop.webp` | Evening desk: lamp lighting an open laptop (blank screen), a marker, a small whiteboard with a circles-and-arrows diagram | Live sessions | A desk at evening: a lamp lights an open laptop, a marker and a small whiteboard with a diagram. | مكتب في المساء: مصباح يضيء حاسوبًا محمولًا مفتوحًا وقلم سبورة وسبورة صغيرة عليها رسم توضيحي. |
| `06-paper-plane.webp` | Paper plane folded from a printed paper (strips only), a trail of gold dots | Quizzes and homework | A paper plane folded from a printed exam paper. | طائرة ورقية مطويّة من ورقة امتحان مطبوعة. |
| `07-red-pen.webp` | Marking pen (purple body, gold cap) on a handwritten script (abstract scribbles), a column of gold ticks | Marking | A marking pen resting on a handwritten answer script with gold ticks in the margin. | قلم تصحيح على ورقة إجابة مكتوبة بخط اليد، وعلامات صح ذهبية في الهامش. |
| `08-exam-clock.webp` | Plain wall clock (tick marks, no numbers) above a multiple-choice sheet of circles and a gold pencil | Practice questions; research card 2 | An exam-hall wall clock above a multiple-choice answer sheet and a pencil. | ساعة حائط في قاعة امتحان فوق ورقة إجابة اختيار من متعدد وقلم رصاص. |
| `09-phone-tea.webp` | Phone propped against a glass of tea with mint; the screen shows only a paper leaf and a play triangle | Minis; research card 3 | A phone propped against a glass of mint tea, a short lecture paused on its screen. | هاتف مسنود إلى كوب شاي بالنعناع، وعلى شاشته مقطع قصير من محاضرة متوقف. |
| `10-bookmark.webp` | Closed book with a folded corner and a gold bookmark half out | Progress (carousel); weak spots | A closed book with a folded corner and a gold bookmark pulled half out. | كتاب مغلق بزاوية مطويّة وعلامة ذهبية مسحوبة إلى النصف. |
| `11-calendar.webp` | Wall calendar on a nail, a blank grid with six days in a row crossed in gold | Progress, the streak feature card | A wall calendar with six days in a row crossed out in gold. | تقويم حائط شُطبت فيه ستة أيام متتالية بالذهبي. |
| `12-raised-hand.webp` | Raised hand and sleeve (five fingers, no person) in front of a chalkboard with a half-drawn diagram of three circles | "For your students" card on `/`; "Your own tutor" | A raised hand in front of a chalkboard with a half-drawn diagram. | يد مرفوعة أمام سبورة عليها رسم توضيحي لم يكتمل. |
| `13-parent-tea.webp` | Stylised adult hand setting a glass of tea on its saucer beside an open book and a phone with a blank screen | Parents band on `/students/` | A hand setting down a glass of tea beside an open book and a phone. | يد تضع كوب شاي بجانب كتاب مفتوح وهاتف. |
| `14-osmosis.webp` | Potato slice at the bottom of a plain beaker of water, a few bubbles | Subjects strip; closing tiles; Biology mosaic | A potato slice in a beaker of water: the osmosis experiment. | شريحة بطاطس في كأس زجاجي به ماء: تجربة الخاصية الأسموزية. |
| `15-electrolysis.webp` | Beaker with two electrodes wired to a small battery (no symbols), bubbles rising | Subjects strip; closing | An electrolysis cell: two electrodes in a beaker, wired to a battery, with bubbles rising. | خلية تحليل كهربائي: قطبان في كأس زجاجي موصولان ببطارية، وفقاعات تتصاعد منهما. |
| `16-trolley.webp` | Trolley on a ramp; a ticker timer at the top and a dotted tape with the dots spreading out | Subjects strip; closing | A trolley rolling down a ramp, pulling a dotted ticker tape. | عربة تنزل على سطح مائل وخلفها شريط توقيت منقّط. |
| `17-compass.webp` | Drawing compass with a gold arc on graph paper, a protractor with tick marks only | Subjects strip; closing | A drawing compass drawing a gold arc on graph paper, beside a protractor. | فرجار يرسم قوسًا ذهبيًا على ورق رسم بياني، وبجانبه منقلة. |
| `18-answer-sheet.webp` | Gold pencil filling in circles on a lavender answer sheet (columns of circles, a few filled; no letters or numbers). *ChatGPT* | Subjects strip; closing | A pencil filling in bubbles on an answer sheet. | قلم رصاص يظلّل دوائر على ورقة إجابة. |
| `19-fountain-pen.webp` | Purple fountain pen with gold trim resting on three plain books (gold bands on the spines, no lettering). *ChatGPT* | Subjects strip; closing | A fountain pen resting on a small stack of books. | قلم حبر فوق كومة صغيرة من الكتب. |
| `20-night-window.webp` | Desk with a lamp, an open book and two books by an arched window: crescent moon, city lights, a dome and a minaret; a chair in front. No people. *ChatGPT* | Closing tiles; `/students/` mosaic | A desk by a window at night, with city lights and a minaret on the skyline. | مكتب بجانب نافذة ليلًا، وأضواء المدينة ومئذنة في الأفق. |

Card titles and lines stay as drafted in §8.3. In Arabic, use the product names in
[arabic.md](arabic.md) §3: شاشة المذاكرة، إعداد الكورس، الحصص المباشرة، التصحيح، أسئلة التدريب،
ميني، التقدّم.

**Notes**

- **07** keeps the plan's slug `07-red-pen`, but the pen is purple with a gold cap and the ticks are
  gold. A red pen would add an ink outside the palette. If the owner wants the red marking-pen cue,
  regenerate it with a red pen.
- **08** is the second take. The first had a crumpled-paper tuft for an eraser and the clock sat on
  the sheet. The second hangs the clock on a wall above a desk, so it has a horizon line.
- **13** is the second take. In the first, the adult's hand was a realistic purple hand that looked
  uncanny. The second uses a simple lavender hand silhouette, with the fingers together under the
  saucer.
- **17** is the first take. The compass has its pencil clamped on one leg. The gold arc is drawn
  loosely, not exactly centred on the needle. A retry to fix that failed (Gemini error).
- **Subjects to avoid** (§8.2): none of these use the SchoolAI subjects. There is no microscope; the
  microscope existed only in the style test.

### Extra sizes (`img/ill/`)

| File | What it is | Size |
|---|---|---|
| `02-book-passage-480.webp` | Opening-collage tile (§7.8, §8.2), 480×480 | 10 KB |
| `03-parcel-480.webp` | Opening-collage tile, cropped to the **film reel** and bow, 480×480 | 19 KB |
| `08-exam-clock-480.webp` | Opening-collage tile, 480×480 | 9 KB |
| `09-phone-tea-480.webp` | Opening-collage tile, 480×480 | 8 KB |
| `01-connected-og.jpg` | Share image (`og:image`), 1200×630, a centre crop of 01. JPEG on purpose, because social cards handle it everywhere | 60 KB |

The tiles reuse the alt text of their parent image. Inside a decorative collage, use `alt=""` if
a caption next to the tile already says the same thing.

## Scene plates (`img/plates/`): missing

**Not made yet.** Gemini wouldn't send any prompt (Pro or Flash, no error shown), and ChatGPT's free
image limit was used up by 18 to 20 and two draft plates. Those two drafts used the old empty-space
design and are superseded; they're kept for reference only, in
`design/image-styles/originals/plates/P1-evening-desk-nodevice-superseded.png` and
`P2-kitchen-tea-nodevice-superseded.png`. Next try: ChatGPT after its reset (about 19:10 on
2026-10-09), or Gemini once it sends again.

### The approach (owner's decision, 2026-10-08)

Each plate **contains the device itself, drawn in the same cut-paper style**, as part of the scene.
The page lays the real app UI exactly over the drawn screen. Plates keep **empty alt text
(`alt=""`)**: the UI and the caption carry the meaning.

- **The device faces the viewer straight on:** no perspective, no tilt, no rotation. Its screen is a
  perfect axis-aligned rectangle.
- **The screen is one flat, solid `#00FF00`**, edge to edge, with crisp straight edges. Nothing is
  drawn on it: no gradient, texture, shadow or reflection. The bezel, body and scene are cut paper.
- **Screen aspect ratio:**
  - laptop or monitor: **16:10**, since the recordings are 1440×900;
  - phone: about **9:19.5**, portrait;
  - tablet: **4:3**.
- **Screen size:**
  - laptop or monitor: at least **about 55% of the plate's width**;
  - phone: **70 to 80% of the plate's height**.
- **After generating:**
  1. Measure the green box with the script below.
  2. Record it in the table below.
  3. Paint the screen **`#1b1722`** in the published WebP, so a failed UI load shows a dark screen,
     not green.
  4. Keep the green original in `design/image-styles/originals/plates/` for re-measuring.
- **Format:** generate at 16:9, then crop to **12:5 at 2000×833** for desktop. Also make a **4:3
  phone crop at 1200×900**, centred on the device. Files: `img/plates/<slug>.webp` and
  `<slug>-phone.webp`, each ≤ 180 KB. Screen boxes are measured in each final file.
- **Arabic:** the device is now in the picture, so **don't mirror the plate in RTL**. Mirroring would
  move the screen box. Keep the image as it is in both languages.

### Device per plate (from the pages, grep `img/plates/` → the next `.device--*`)

| Plate | File | Device (screen ratio) | Uses on the pages | Scene |
|---|---|---|---|---|
| P1 | `P1-evening-desk` | Laptop, 16:10 | `/` (live sessions), Course builder ×2, Live sessions ×3: all `device--browser` | Tutor's desk at evening; the laptop is the subject, with a lamp, a mug and loose papers to one side |
| P2 | `P2-kitchen-tea` | **Phone, 9:19.5 portrait** (owner: the Minis reel feed is shown in the phone layout) | `/students/` (student-minis), Minis ×2. The pages still say `device--browser` there, so the markup needs `device--phone` | Phone propped upright on a kitchen table next to a glass of tea and a folded notebook, morning light; phone 70 to 80% of the plate's height |
| P3 | `P3-chalkboard` | Monitor or laptop, 16:10 | `/` (quiz), Practice questions ×3, Quizzes ×4: all `device--browser` | Classroom: a chalkboard (no writing) and a wall clock with tick marks only, the device in front |
| P4 | `P4-marked-papers` | Laptop, 16:10 | `/` (marking), Marking ×3: all `device--browser` | Desk with a stack of handwritten scripts (scribbles only), a marking pen and a mark-scheme sheet beside the laptop |
| P5 | `P5-dusk-window` | Laptop, 16:10 | `/students/` (got one wrong), Study view ×2: all `device--browser`. The plan also lists the `/try/` banner | Desk by a window at dusk, city lights and a minaret |
| P6 | `P6-library` | Monitor, 16:10 | `/students/` (weak spots), Minis ×1, Progress ×1: all `device--browser` | Library shelves (plain spines) with a reading lamp, a monitor on the reading desk |
| P7 | `P7-sofa-corner` | Tablet, 4:3, landscape | `/students/` (your own tutor): `device--tablet` | Sofa corner with a cushion and an open book, the tablet propped on the cushion |

No plate is used with two device types. The only conflict is **P2**: the owner wants a phone, but
the three P2 slots on the pages are `device--browser` today. Once the plate exists, the page agents
need to switch those to the phone frame.

### Screen boxes (fill in after measuring)

| Plate | File | Size | Device | Screen x, y, w, h (px) | Screen x, y, w, h (%) | Corner radius |
|---|---|---|---|---|---|---|
| P1 | `P1-evening-desk.webp` / `-phone.webp` | 2000×833 / 1200×900 | laptop | — | — | — |
| P2 | `P2-kitchen-tea.webp` / `-phone.webp` | 2000×833 / 1200×900 | phone | — | — | — |
| P3 | `P3-chalkboard.webp` / `-phone.webp` | 2000×833 / 1200×900 | monitor | — | — | — |
| P4 | `P4-marked-papers.webp` / `-phone.webp` | 2000×833 / 1200×900 | laptop | — | — | — |
| P5 | `P5-dusk-window.webp` / `-phone.webp` | 2000×833 / 1200×900 | laptop | — | — | — |
| P6 | `P6-library.webp` / `-phone.webp` | 2000×833 / 1200×900 | monitor | — | — | — |
| P7 | `P7-sofa-corner.webp` / `-phone.webp` | 2000×833 / 1200×900 | tablet | — | — | — |

### Prompt (one per plate; for ChatGPT, attach 01, 09 and 14 as style references)

`Wide landscape scene, 16:9, in exactly the same cut-paper style as the reference images. Subject:
<scene>, seen straight on from the front. The <laptop|monitor|tablet|phone> faces the viewer exactly
head-on, with no perspective, no tilt and no rotation, so its screen is a perfect upright rectangle
with a <16:10|4:3|9:19.5> aspect ratio, about <55–60% of the image width | 70–80% of the image height>.
The screen is one flat, solid, pure chroma-key green (#00FF00) from edge to edge, with crisp straight
edges: nothing on it, no gradient, no texture, no reflection, no shadow. The bezel, body and the whole
scene are cut paper. Style recipe: <the recipe above, with "Wide 16:9." in place of "Square 1:1.">`

Regenerate (at most twice) if the screen isn't a clean, flat, axis-aligned green rectangle.

### Measuring script

Requires only `python3` and ffmpeg (no PIL). Run it as
`python3 -I design/image-styles/originals/plates/plate.py <green.png> img/plates/<slug>.webp auto img/plates/<slug>-phone.webp`.

1. It decodes the image through ffmpeg.
2. It finds the rows and columns that are mostly `#00FF00` (g > 200, r and b < 90), which skips
   anti-aliased edges.
3. It estimates the corner radius from the top row of the box.
4. It paints every greenish pixel in the box (plus 4px) `#1b1722`.
5. It crops 12:5 centred on the screen, scales to 2000 wide and encodes WebP at quality 82. The
   4:3 phone crop is also centred on the screen, at 1200×900.
6. It prints both boxes in px and %.

It was tested on a synthetic plate: the box was found exactly, and no green was left after
painting. The script is kept next to the green originals, at
`design/image-styles/originals/plates/plate.py`.
