# Illustrations and scene plates: files, uses and alt text

Written 2026-10-08 by the illustration agent. Read with [redesign.md](redesign.md) §7.9, §8.2 and §8.3
(the plan this list follows) and [arabic.md](arabic.md) (the register used for the Arabic alt text).

**Status: 17 of 20 illustrations are done. Illustrations 18 to 20 and all seven plates (P1 to P7)
are missing.** Gemini stopped answering partway through ("Sorry, something went wrong"). See
[What is missing](#what-is-missing) for the exact prompts to finish the set.

## Style and process

- **Style C, cut paper**, the owner's pick from [`design/image-styles/`](../image-styles/index.html).
  It replaces the riso wording in §8.2: same inks and rules, but cut paper instead of print grain.
- **Made with** Gemini's Images tool, model "Pro" (Nano Banana Pro), aspect ratio 1:1. The originals
  are 2048×2048 JPEGs.
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
- **Originals:** `design/image-styles/originals/ill/<slug>.jpg`. These are the untouched Gemini
  downloads; `design/` isn't published.
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
| `18-answer-sheet.webp` | **Missing** | Subjects strip; closing | A pencil filling in bubbles on an answer sheet. | قلم رصاص يظلّل دوائر على ورقة إجابة. |
| `19-fountain-pen.webp` | **Missing** | Subjects strip; closing | A fountain pen lying across a stack of paperback novels. | قلم حبر فوق مجموعة من الروايات. |
| `20-night-window.webp` | **Missing** | Closing tiles; `/students/` mosaic | A desk by a window at night, with city lights and a minaret on the skyline. | مكتب بجانب نافذة ليلًا، وأضواء المدينة ومئذنة في الأفق. |

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

## Scene plates (`img/plates/`): all missing

None of the seven plates were made, because Gemini stopped responding before the plate run started.
Below is the spec to finish them with the same process. Plates have **empty alt text (`alt=""`)**:
the device and its caption carry the meaning (§8.2).

**Format:**
- Generate at **16:9** (Gemini's widest option).
- Crop to the plan's **12:5** desktop plate, saved at **2000×833** (the coordinator's 2000px cap,
  not the plan's 2400×1000).
- Make a **4:3 phone crop at 1200×900**, taken from the left (inline-start) side so the whole scene
  stays in.
- Files: `img/plates/P<n>-<name>.webp` and `img/plates/P<n>-<name>-phone.webp`. Keep each
  ≤ 180 KB.
- Originals go in `design/image-styles/originals/plates/`.

**Where the device sits:**
- In every plate the scene takes the **left third** of the frame. The **right two-thirds** is calm,
  plain wall or table, where the device sits, vertically centred.
- That is the inline end in English. For Arabic, mirror the plate with `transform: scaleX(-1)` on
  `[dir="rtl"]` so the empty side stays at the inline end. The plates have no text, so they mirror
  safely.

**Plate prompt:**

`Generate an image. Wide landscape scene. Subject: <scene>. Composition: all the objects sit in the
left third of the frame; the right two thirds is a calm, plain, empty paper surface (wall and table)
with nothing in it, where a device will be placed later; keep everything inside the middle band
vertically, with empty space above and below. Quieter than a poster: low contrast, large flat paper
areas. Style recipe: <the recipe above, with "Wide 16:9." in place of "Square 1:1.">`

| Plate | File | Scene (plan §7.9) | Used behind | Device sits |
|---|---|---|---|---|
| P1 | `P1-evening-desk` | A tutor's desk at evening: lamp, mug, a closed laptop pushed aside, papers | `/` live sessions recording; Live sessions page; Course builder page | Right two-thirds, centred |
| P2 | `P2-kitchen-tea` | A kitchen table with a glass of tea and a folded notebook, morning light | Phones: Minis recording and stills; `/students/` overlapping phone | Right two-thirds, centred (a phone: keep the empty band tall) |
| P3 | `P3-chalkboard` | A classroom wall with a chalkboard and a wall clock (tick marks only) | `/` quiz recording; Quizzes and homework page; Practice questions page | Right two-thirds, centred |
| P4 | `P4-marked-papers` | A stack of handwritten answer scripts with a marking pen and a mark-scheme sheet (scribbles only) | `/` marking recording; Marking page | Right two-thirds, centred |
| P5 | `P5-dusk-window` | A desk by a window at dusk, city lights and a minaret on the skyline | `/students/` "got one wrong"; Study view page; `/try/` banner background | Right two-thirds, centred |
| P6 | `P6-library` | Library shelves (plain spines, no titles) with a reading lamp | `/students/` weak spots; Progress page | Right two-thirds, centred |
| P7 | `P7-sofa-corner` | A sofa corner with a cushion and an open book | `/students/` "your own tutor" (tablet); Minis page (tablet still) | Right two-thirds, centred |

## What is missing

Gemini answered "I encountered an error" and then "Sorry, something went wrong" several times in a
row, and the last request hung with no answer. That looks like throttling after about 30 images in
the session.

- **Illustrations 18, 19 and 20.** Prompts (each followed by the recipe):
  - 18: `a sharpened pencil filling in bubbles on a standardised-test answer sheet: neat columns of
    small empty circles, a few already filled in solid deep purple, the pencil tip resting on one
    half-filled circle; no letters, no numbers anywhere on the sheet.`
  - 19: `a fountain pen lying across a small stack of paperback novels with plain coloured spines,
    no titles and no lettering on the covers or spines.`
  - 20: `a desk by an arched window at night: through the window city lights and the silhouette of a
    minaret on the skyline under a crescent moon; on the desk a lamp casting a soft golden yellow
    pool of light and an open notebook (lines as thin strips). No people.`
- **Plates P1 to P7**, as specified above.
