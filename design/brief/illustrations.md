# Illustrations and scene plates: files, uses and alt text

Written 2026-10-08 by the illustration agent. Read with [redesign.md](redesign.md) §7.9, §8.2 and §8.3
(the plan this list follows) and [arabic.md](arabic.md) (the register used for the Arabic alt text).

**Status (2026-10-09): all 20 illustrations and all seven plates (P1 to P7) are done and on the
pages.** The plates follow the owner's approach: the device is drawn into the scene with a green
screen, measured, and painted dark. Every page shows the **whole device** with some scene round it
(4:3 pictures, P1 3:2). P4 and P5 were drawn again on 2026-10-09 because their laptop keyboards ran
off the bottom of the first pictures. The boxes the pages use are in
[Screen boxes](#screen-boxes-what-the-pages-use); how the plates were made is in
[Plate run notes](#plate-run-notes-2026-10-08-night) and [P4 and P5, second
run](#p4-and-p5-second-run-2026-10-09).

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

## Scene plates (`img/plates/`)

All seven made on 2026-10-08 (night) with Gemini on the owner's second account; see the run notes
below. Two earlier ChatGPT drafts used the old empty-space design and are superseded; they're kept
for reference only, in `design/image-styles/originals/plates/P1-evening-desk-nodevice-superseded.png`
and `P2-kitchen-tea-nodevice-superseded.png`.

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
- **Screen size (bigger, coordinator 2026-10-08):**
  - laptop, monitor or tablet: **more than 56% of the image width** (aim for about 62%);
  - phone (P2): the phone fills **most of the height of the 4:3 crop**.
- **After generating:**
  1. Measure the green box with the script below.
  2. Record it in the table below.
  3. Paint the screen **`#1b1722`** in the published WebP, so a failed UI load shows a dark screen,
     not green.
  4. Keep the green original in `design/image-styles/originals/plates/` for re-measuring.
- **Format (since 2026-10-09):** the pages use **one picture per plate at every width, showing the
  whole device**: 4:3 at 1200×900 (`<slug>-phone.webp`, `<slug>-full.webp` or
  `<slug>-full2.webp`), or 3:2 at 1350×900 for P1. On phones `site.css` crops it round the device
  (`--frac-sm`), never through it. The first run also made 12:5 desktop crops (2000×833,
  `<slug>.webp`); they cut the devices and were deleted. For a new plate, generate at **4:3** with
  the whole device in frame (Gemini's aspect menu has 4:3), so no crop is needed. Each file ≤ 180 KB;
  the screen box is measured in the final file.
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

No plate is used with two device types. **P2** is a phone: its slots hold the app's phone layout
(the Minis feed) in the phone frame.

### Screen boxes (what the pages use)

Each box is written the way `site.css` reads it: unitless percentages of the picture. `--pa` is
the picture aspect (width / height), `--sx --sy` the screen's top-left, `--sw --sh` its size, and
`--sr` its corner radius as a percentage of the picture's width. `plate.py` prints `box_pct` and
`radius_px`; `--sr` is `radius_px / width × 100`. `--frac-sm` is the share of the picture's width
shown on phones (under 640px), centred on the screen: the device's own width plus a little scene.
The page markup names the file in `data-plate` (site.js loads `img/plates/<data-plate>.webp`), and
the `.plate[data-plate="…"]` rule in `site.css` holds the same values as this table, with `--drawn: 1`.

Copied from `site.css` on 2026-10-09:

| Plate | File (`data-plate`) | Size | Device | Box (px) | `--pa --sx --sy --sw --sh --sr` | `--frac-sm` | Pages |
|---|---|---|---|---|---|---|---|
| P1 | `P1-evening-desk-full` | 1350×900 (3:2) | laptop, whole (square corners) | 286, 118, 755×525 | `--pa: 1.5; --sx: 21.18; --sy: 13.15; --sw: 55.9; --sh: 58.33; --sr: 0` | .9 | `/`, Course builder, Live sessions |
| P2 | `P2-kitchen-tea-phone` | 1200×900 | phone (screen 0.451:1) | 438, 99, 324×702 | `--pa: 1.3333; --sx: 36.5; --sy: 11; --sw: 27; --sh: 78; --sr: 3` | .4 | `/students/`, Minis |
| P3 | `P3-chalkboard-phone` | 1200×900 | monitor (1.573:1, square corners) | 135, 147, 931×593 | `--pa: 1.3333; --sx: 11.25; --sy: 16.33; --sw: 77.58; --sh: 65.89; --sr: 0` | .88 | `/`, Practice questions |
| P4 | `P4-marked-papers-full2` | 1200×900 | laptop, whole (1.549:1, square corners) | 321, 141, 558×360 | `--pa: 1.3333; --sx: 26.75; --sy: 15.67; --sw: 46.5; --sh: 40; --sr: 0` | .74 | `/`, Marking |
| P5 | `P5-dusk-window-full2` | 1200×900 | laptop, whole (1.519:1, square corners) | 315, 208, 572×376 | `--pa: 1.3333; --sx: 26.25; --sy: 23.11; --sw: 47.67; --sh: 41.78; --sr: 0` | .82 | `/students/`, Study view |
| P6 | `P6-library-full` | 1200×900 | monitor (1.553:1, square corners) | 180, 149, 836×538 | `--pa: 1.3333; --sx: 15.04; --sy: 16.54; --sw: 69.63; --sh: 59.77; --sr: 0` | .8 | `/students/`, Progress |
| P7 | `P7-sofa-corner-phone` | 1200×900 | tablet (1.317:1, radius about 10px) | 175, 128, 849×645 | `--pa: 1.3333; --sx: 14.58; --sy: 14.22; --sw: 70.75; --sh: 71.67; --sr: .83` | .82 | `/students/` |

Notes on the table:

- **P2:** the box in `site.css` is a few pixels larger than the measured green (444, 103,
  313×690, `--sr: 2.42`), so the phone layout covers the screen's anti-aliased rim.
- **P1 and P6 `-full`** are wider crops of `<slug>-uncropped.png` than the first run's
  pre-crop, so the whole laptop or monitor fits; their boxes were measured in those crops.
- **P4 and P5 `-full2`** come from new pictures (see the second run below). The suffix is a new
  file name so no browser or cache keeps the old picture.
- **Unused:** none. All seven files in `img/plates/` are used, and nothing else is there. Deleted
  on 2026-10-09 because no page, `site.css` or `site.js` used them (they are in git history,
  commits 8936f78 and e06a153): the 12:5 desktop crops `P1-evening-desk`, `P2-kitchen-tea`,
  `P3-chalkboard`, `P4-marked-papers`, `P5-dusk-window`, `P6-library` and `P7-sofa-corner`;
  the 4:3 crops `P1-evening-desk-phone`, `P4-marked-papers-phone`, `P5-dusk-window-phone` and
  `P6-library-phone`; and the superseded `P4-marked-papers-full` and `P5-dusk-window-full`
  (keyboards cut).
- **Green originals** stay in `design/image-styles/originals/plates/` (untracked, local). For P4
  and P5 the files the pages use come from `<slug>-v2.png`. The first-run originals
  (`<slug>.png`, `<slug>-uncropped.png`) are kept for reference only.

### Plate run notes (2026-10-08, night)

- **Tool:** Gemini Images on the owner's second Google account, 16:9 chosen in the aspect menu,
  a fresh chat per plate (in one chat, follow-ups come back as edits of the last image). "Pro" and
  "Flash" both used; Pro sometimes falls back to Flash on its own, and once answered "I am currently
  unable to generate images" (Flash still worked). Output is 1376×768 JPEG. No style references were attached: uploading needs Gemini's "Creating content
  from images and files" agreement, which wasn't accepted, so the prompt relies on the written recipe.
- **Saving:** the full-size image was shown 1:1 on screen and captured losslessly (PNG). The capture
  is kept as `<slug>-uncropped.png`.
- **Screens came out smaller than asked** (41 to 57% of the width; Gemini draws about 0.75 of the
  size it is told, so asking for "about 70% of the width and 70% of the height" works best). To
  reach the >56% rule, the capture is cropped to a 16:9 window around the screen:
  `python3 -I design/image-styles/originals/plates/precrop.py <slug>-uncropped.png <slug>.png <pct>`
  (window width = screen width / pct, centred on the screen, lossless). That window is
  `<slug>.png`, the file `plate.py` runs on. The cost is resolution: the 2000-wide plate is
  upscaled from 1100 to 1310px.
- **Screen shape:** 16:10 is 1.6:1; the screens came out between 1.44:1 (P1) and 1.57:1. A 16:10
  recording in a narrower box is letterboxed or slightly cropped. A screen of aspect `a` can't be
  wider than `a × 41.7%` of a 12:5 plate and still fit its height (60% at 1.44:1).
- **`plate.py` changes:** (1) the box test takes `g > 150` (was 200), because Flash once drew the
  screen a flat `#03C324`-ish green instead of `#00FF00` (P4); (2) the paint test for the
  anti-aliased rim is looser (`g > r+15 and g > b-30`, only inside the box + 4px; safe for this
  palette), which removed a faint green line round the screen; (3) the radius is taken from the
  four corners (minimum), because a screen tilted by a fraction of a degree made the old one-row
  estimate read 105px for a square corner. All plates were re-run with the final script, so
  re-running it on `<slug>.png` gives the boxes in the table.
- **P1:** take 3 of 3 (Pro gave 41%, the two Flash retakes 47%). Square screen corners, so `--sr: 0`.
  The desktop crop is tight: the screen is 97% of the plate's height, the lamp and mug sit at the
  right, the papers at the left.
- **P2:** take 3 of 3, no pre-crop. Take 1 drifted (a busy kitchen with green plants and wood);
  take 2 (a prompt asking for a plain off-white ground and "no brown, no wood, no orange, no green
  paper") matched the set but drew an old phone with a chin (screen 0.52:1, 62% of the height);
  take 3 was an edit of take 2 asking for an edge-to-edge phone. The screen is 76% of the picture's
  height and 0.451:1 (9:19.5 is 0.462). The phone is too tall for the 12:5 desktop crop (it cuts
  1% off the screen's top and bottom), so `P2-kitchen-tea.webp` exists but only the 4:3
  `-phone.webp` should be used, as the pages already do.
- **P3:** take 2 of 2. Take 1 (screen asked at 60%) came out at 47%. Take 2 asked for "about 70%
  of the width and 70% of the height" and got 55% at 1.573:1, near 16:10; pre-cropped to 58%,
  which keeps the clock (tick marks only) whole at the right. Chalkboard blank, square corners.
- **P4:** take 2 of 2, Flash (Pro refused). Take 1: 45%, 1.40:1. Take 2 asked for the lid to nearly
  reach the top and the screen "1.6 times as wide as tall, 72% of the width" and got 57% at
  1.558:1, but in a flat `#03C324` green instead of `#00FF00` (flat and clean, so it measures and
  paints the same). Pre-cropped to 60%. Answer papers with abstract scribbles at the left, a purple
  marker with its gold cap off on a lavender sheet of gold ticks at the right.
- **P5:** take 1, Flash, same size wording as P4 take 2: 55% at 1.433:1, pre-cropped to 57%. Window
  at dusk behind the laptop: crescent moon, low skyline with gold lit windows, a minaret with a small
  dome (right). The 12:5 crop keeps only the bottom of the moon; the 4:3 crop keeps the whole scene.
- **P6:** take 1, Flash: 52% at 1.553:1, pre-cropped to 58%. Monitor on a pale desk in front of
  full shelves of plain spines (purple, lavender, gold bands, no lettering) and a gold-shaded reading
  lamp at the right, partly cut off. Busier than the illustration set (the shelves fill the
  background) but the same papers and palette.
- **P7:** take 3 of 3, Flash, pre-cropped to 53%. **A 4:3 screen can't pass 56% of a 12:5 plate:**
  its height would overflow the plate (the ceiling is 41.7% × 1.317 = 55%), so 53% is the most
  that fits with a thin margin. Take 1 (45%) had the open book lying over the screen's bottom-left
  corner and the tablet off-centre; take 2 was clean and centred but small (36%); take 3 was an
  edit of take 2 ("zoom in"): the tablet grew to 38%, still centred, nothing over the screen. So
  this plate is upscaled the most (from 986px to 2000). Tablet in front of a deep-purple cushion
  on a lavender sofa, open book at the left, sofa arm at the right.

### P4 and P5, second run (2026-10-09)

The first P4 and P5 pictures cut the laptop's keyboard at the bottom edge, so the laptop could
not be shown whole. Both were drawn again.

- **Tool:** Gemini Images ("Flash") on the owner's second Google account
  (`gemini.google.com/u/1/`), **4:3 chosen in the aspect menu**, a fresh chat per plate. Output is
  1024×765. No reference images attached.
- **Saving:** the generated image was shown at its natural size, one image pixel per screen pixel
  (an overlay at half its size on a 2× screen), and captured as a lossless PNG. The capture's
  extra bottom row was trimmed. Saved as `design/image-styles/originals/plates/<slug>-v2.png`
  (1024×765, green screen).
- **Prompt:** the plate prompt below, at 4:3, plus: the laptop in violet and grape purple paper
  with a lavender keyboard base ("not black, not grey"), "it fills about 80% of the image
  height", and "the WHOLE laptop is inside the frame: the top edge of the lid, the bezel, the
  screen, the hinge, the complete keyboard and the front edge of the base are all fully visible,
  with a clear empty margin … Nothing of the laptop is cut off by the image edges."
- **P4:** take 3 of 3. Take 1 drew a black laptop with the screen at 41% of the width. Take 2 was an
  edit of take 1 to make the laptop purple: right colours, but the same small size. Take 3 was a
  fresh chat with the size and colour wording above: screen 46% of the width at 1.549:1, the whole
  laptop with a trackpad, margins of 13% above and 7% below. Answer papers with abstract scribbles
  at the left; at the right, a lavender sheet with a column of gold ticks and a purple
  highlighter, its gold cap off.
- **P5:** take 1 of 1, same wording: screen 47.5% of the width at 1.519:1, the whole laptop with
  6% below its base. A lavender-framed window behind it: a crescent moon at the upper left, a low
  skyline with gold lit windows, and a minaret with a small dome at the right.
- **Made with:** `python3 -I design/image-styles/originals/plates/plate.py <slug>-v2.png
  <scratch>.webp auto img/plates/<slug>-full2.webp`. The source is already 4:3, so the "phone"
  crop is the whole picture (less 4px of its width), scaled to 1200×900. The 12:5 output is
  thrown away. No green is left; the screen corners are square (`--sr: 0`).
- **Screen size:** the price of a whole laptop. The screen is 46 to 48% of the picture's width,
  against 74 to 77% in the cut `-full` crops. At 1440×900 the plate is 880px wide and the screen
  about 410px; on a 375px phone the `--frac-sm` crop gives about 180 to 215px. Cropping the 4:3
  window tighter (6% margins) would give about 51% but would cut the highlighter and the papers.
- **Checked** headless at 1440×900 and 375×812 on `/`, Marking, `/students/` and Study view: the
  app sits on the drawn screen to within 0.02px, and the whole laptop shows at both widths.
  Screenshots: `design/review/plates-v2/` (local).

### Prompt (one per plate; for ChatGPT, attach 01, 09 and 14 as style references)

`Wide landscape scene, 16:9, in exactly the same cut-paper style as the reference images. Subject:
<scene>, seen straight on from the front. The <laptop|monitor|tablet|phone> faces the viewer exactly
head-on, with no perspective, no tilt and no rotation, so its screen is a perfect upright rectangle
with a <16:10|4:3|9:19.5> aspect ratio, about <62% of the image width (must be over 56%) for a laptop, monitor or tablet | most of the image height for the phone>.
The screen is one flat, solid, pure chroma-key green (#00FF00) from edge to edge, with crisp straight
edges: nothing on it, no gradient, no texture, no reflection, no shadow. The bezel, body and the whole
scene are cut paper. Style recipe: <the recipe above, with "Wide 16:9." in place of "Square 1:1.">`

Regenerate (at most twice) if the screen isn't a clean, flat, axis-aligned green rectangle.

Since 2026-10-09 the device must be shown whole. Choose **4:3** (not 16:9) and use "Landscape
scene, 4:3" in place of "Wide landscape scene, 16:9". Add the whole-device and size wording from
[P4 and P5, second run](#p4-and-p5-second-run-2026-10-09), and name the device's colours (purple
and lavender paper), or Gemini may draw a black one.

### Measuring script

Requires only `python3` and ffmpeg (no PIL). Run it as
`python3 -I design/image-styles/originals/plates/plate.py <green.png> <scratch>.webp auto img/plates/<slug>-<suffix>.webp`.
The pages use only the last file (the 4:3 crop at 1200×900), so write the 12:5 output somewhere
outside `img/plates/` and delete it.

1. It decodes the image through ffmpeg.
2. It finds the rows and columns that are mostly green (g > 150, r and b < 90), which skips
   anti-aliased edges.
3. It estimates the corner radius from the four corners of the box (the smallest).
4. It paints every greenish pixel in the box (plus 4px) `#1b1722` (g > r + 15 and g > b − 30).
5. It crops 12:5 centred on the screen, scales to 2000 wide and encodes WebP at quality 82. The
   4:3 phone crop is also centred on the screen, at 1200×900.
6. It prints both boxes in px and %.

It was tested on a synthetic plate: the box was found exactly, and no green was left after
painting. The script is kept next to the green originals, at
`design/image-styles/originals/plates/plate.py`.
