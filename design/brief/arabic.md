# Arabic: style guide, glossary and page template

Written 2026-10-08 by the Arabic lead. Read with [README.md](README.md) (the brief and the owner's
answers), [patterns.md](patterns.md) §14 and [app-facts.md](app-facts.md). Every page exists in
English and Arabic (`page/` and `ar/page/`); this file is what an agent needs to write the Arabic one.

**Sources.** The app's own Arabic UI, so the site says what the product says:
`klaro-beta-v2/apps/web/src/i18n/locales/ar/common.json` and its glossary
`klaro-beta-v2/docs/i18n/ar-glossary.md` (both at `d4e6dae`, 2026-10-08), read only. The register
comes from the old `ar/index.html`. Where the app and the old page disagree, the app wins.

**Shared parts.** `partials/header.ar.html` and `partials/footer.ar.html` mirror
`partials/header.en.html` and `partials/footer.en.html` as committed in `688c24b` (2026-10-08): the same
tags, classes, ids, data attributes and placeholders, in the same order, with Arabic text. Two
attributes are added on purpose: `dir="ltr"` on the join-code field, and `hreflang="en"` on the
footer's "Browse courses" link (there is no Arabic market). **When an English partial changes,
change its Arabic twin the same way in the same commit.**

---

## 1. Register

- **Simple, clear Modern Standard Arabic**, the kind Egyptian education apps use: short sentences,
  common words, no flowery phrasing. Write it in Arabic; don't translate word for word. Keep the
  English page's meaning, facts and claims exactly (they are checked against
  [app-facts.md](app-facts.md)); never add a claim.
- **"You" is أنت, masculine singular**, as the neutral default (the app does the same):
  ارفع، انضم، جرّب، كورسك، مدرّسك. Never mix in plural "you" (أنتم) or feminine forms.
- **Imperatives for buttons**, as the app: أنشئ حساب طالب، جرّب درسًا، انضم، أرسل النتائج.
- **Loanwords that Egyptian students and tutors say** win over stiff formal words: كورس (not
  مقرر), كويز (not اختبار قصير), كود (not رمز), حصة (not جلسة).
- **Klaro stays in Latin letters**, inside Arabic sentences too, and takes masculine agreement:
  يربط Klaro، يراجع فريق Klaro. Never كلارو.
- **Same punch, fewer words.** Headlines stay as short as the English, or shorter.
- **Don't mention AI.** The only exception is the approved motto below.

## 2. The approved lines (verbatim; don't edit them)

**Motto** (owner-approved, brief §6 answer 3):

> كفى محتوى مُصطنعًا. لا نصنع المحتوى بالذكاء الاصطناعي كما يفعل الجميع. نربط محتواك كما أردته تمامًا.

How it is set, matching the English blocks:

| English place | Arabic |
|---|---|
| `.motto-big`, line 1 (`.ml`) | `كفى` |
| `.motto-big`, line 2 (`.ml`), last word in `.gold` | `محتوى <span class="gold">مُصطنعًا.</span>` |
| `.motto-lines p`, first | `لا نصنع المحتوى بالذكاء الاصطناعي كما يفعل الجميع.` |
| `.motto-lines p`, second, end in `.gold-text` | `نربط محتواك <span class="gold-text">كما أردته تمامًا.</span>` |
| Footer `.foot-motto` / the line under it | `كفى محتوى مُصطنعًا.` / `نربط محتواك كما أردته تمامًا.` (already in the footer partial) |

**Tutor line** (owner-approved, brief §6 answer 2), wherever the English uses "Upload your
lectures, your books and your past papers. Klaro connects them…":

> ارفع محاضراتك وكتبك وامتحانات السنوات السابقة. يربطها Klaro ببعضها: كل لحظة في المحاضرة بصفحة الكتاب التي تشرحها، وكل درس بأسئلة امتحاناته. لا شيء مُصطنع.

"Nothing generated." is always **لا شيء مُصطنع.** "Generate" is صنع / مُصطنع, as in the motto (not
يولّد).

## 3. Product names: Arabic, as the app

**Decision: product names get Arabic names, the ones the app's Arabic UI already uses.** The app
translates every one of these in its menus and page titles (for example `nav.minis` "ميني",
`tour.chapters.study` "شاشة المذاكرة"), so a student who clicks from the site into the app meets the
same word. Only **Klaro** itself stays in Latin letters. Use these names exactly, in the menu,
headings, chips, cards and running text. In running text, put a name in «» when it could read as an
ordinary word: «التقدّم»، «التصحيح».

| English | Arabic | Source |
|---|---|---|
| Study view | شاشة المذاكرة | `tour.chapters.study` |
| Practice questions | أسئلة التدريب | `courses.content.practice.none`, `practice.noneTitle` (أسئلة تدريب); `nav.practice` التدريب |
| Minis | ميني (masculine; "the minis" = الميني) | `nav.minis`, `minis.title` |
| Progress | التقدّم | `nav.progress` |
| Course builder | إعداد الكورس | `authoring.setup.kicker` "Course setup" |
| Live sessions | الحصص المباشرة (one: حصة مباشرة) | `schedule.filter.live`, `schedule.kind.live` |
| Marking | التصحيح | `nav.marking` |
| Klaro Market | سوق Klaro (the page itself: السوق) | new; from `nav.market` السوق |
| Products (all) | المنتجات / كل المنتجات | new |

The Marking product is what the app calls "Scanned exams" (الامتحانات الورقية, `nav.scannedExams`);
the student sees "Exam results" (نتائج الامتحانات, `nav.results`). Use those two in visuals.

## 4. Glossary

"new" means the app has no string for it; the site sets it here. Keys are `ar/common.json` keys.

### People and joining

| English | Arabic | Source |
|---|---|---|
| tutor / tutors | مدرّس / المدرّسون (المدرّسين) | `role.tutor`; app glossary |
| student / students | طالب / الطلاب | `role.student` |
| For students / For tutors | للطلاب / للمدرّسين | new |
| Students and tutors | للطلاب والمدرّسين | new |
| I'm a student / I'm a tutor | أنا طالب / أنا مدرّس | `signUp.student`, `signUp.tutor` |
| course / courses | كورس / الكورسات | `nav.courses`; app glossary |
| join code | كود الانضمام | `joining.codeLabel` |
| Join code (header button) | كود الانضمام | `joining.codeCard` |
| Have a join code? | لديك كود انضمام؟ | new (cf. `joining.codeTitle` لديّ كود) |
| Join (submit) | انضم | `schedule.join` |
| Join a course | انضم إلى كورس | `joining.entry` |
| Ask to join | اطلب الانضمام | `joining.askTitle` |
| the Klaro team | فريق Klaro | `ingest.review.sendNote` |
| Every tutor account is reviewed before it opens | يراجع فريق Klaro كل حساب مدرّس قبل تفعيله | old ar page |

### Calls to action and navigation

| English | Arabic | Source |
|---|---|---|
| Get started | ابدأ الآن | old ar page |
| Sign in | تسجيل الدخول | `auth.signIn` |
| Create a student account | أنشئ حساب طالب | old ar page (cf. `signUp.title` أنشئ حسابك) |
| Apply as a tutor | قدّم كمدرّس | old ar page |
| Try it (nav) / Try a lesson | جرّب درسًا | new |
| Open the lesson | افتح الدرس | new |
| No account needed. | دون حساب. | new |
| Research (nav) | الأبحاث | new |
| Powered by research | مبنيّ على الأبحاث | new |
| How Klaro uses research | كيف يستخدم Klaro الأبحاث | new |
| Products / All products | المنتجات / كل المنتجات | new |
| Browse courses | تصفّح الكورسات | new |
| Learn more | اعرف المزيد | new |
| How it works | كيف يعمل | old ar page |
| Who it's for | لمن صُمّم | new |
| Related / Works with | يعمل مع | new |
| Questions (FAQ kicker) / Good to know | أسئلة شائعة / معلومات تهمّك | old ar page |
| What we stand for (motto kicker) | ما نؤمن به | new |
| Connected, not generated | مربوط، لا مُصطنع | new |
| side by side | جنبًا إلى جنب | old ar page |
| Klaro only draws the lines between them. | كل ما يفعله Klaro أنه يربط بينها. | new |
| Terms / Privacy | شروط الاستخدام / سياسة الخصوصية | old ar page |
| Menu | القائمة | `nav.menu` |
| Page not found | الصفحة غير موجودة | new |

### Studying

| English | Arabic | Source |
|---|---|---|
| lecture / lectures | محاضرة / المحاضرات | `nav.lectures`, `study.pane.lecture` |
| Lecture 4 | المحاضرة 4 | `lecture.positionOf` pattern |
| lecture clip / clips | مقطع من المحاضرة / مقاطع المحاضرة | `study.lecture.clips` |
| Clips in this lecture | مقاطع هذه المحاضرة | `study.lecture.clips` |
| lecture moment | لحظة من المحاضرة | `minis.intro.title` |
| book / the course book | الكتاب / كتاب الكورس | `study.pane.book`, `ingest.book.title` |
| book page / p. 48 | صفحة الكتاب / ص 48 | `study.book.card.page` |
| Book · p. 48 | الكتاب · ص 48 | built from the two above |
| part of the book; chapter, section, unit | جزء من الكتاب؛ فصل، قسم، وحدة | `adminContent.editor.kind.*` |
| questions (pane) | الأسئلة | `study.pane.questions` |
| Question 3 of 8 | السؤال 3 من 8 | `quiz.questionOf` |
| past paper | امتحان سابق (plural الامتحانات السابقة) | `ingest.papers.types.past_paper`, `minis.question.paper` |
| past papers, in the approved tutor line and other "upload" sentences | امتحانات السنوات السابقة | approved line; old ar page |
| past-paper questions | أسئلة الامتحانات السابقة / سؤال من امتحان سابق | `study.lecture.questionsHint`, `study.book.card.questions_one` |
| question paper | ورقة الأسئلة | `ingest.papers.paperFile` |
| mark scheme (the tutor's) | نموذج الإجابة | `ingest.kind.mark_scheme`; app glossary |
| marking scheme (what Klaro prepares; rarely needed) | نموذج التصحيح | `markingExams.scheme.title` |
| multiple choice / written answer | اختيار من متعدد / إجابة مكتوبة | app glossary |
| practice (noun) / practise | التدريب / تدرّب | `nav.practice`, `study.klaro.tiles.practise` |
| checked as you answer | تُصحَّح فور إجابتك | new (old ar page: أسئلة تُصحَّح فورًا) |
| Correct | إجابة صحيحة | `study.practice.correct` |
| Not quite. The answer is B. | ليس تمامًا. الإجابة هي B. | `practice.run.wrong` |
| Where to look | أين تراجع | `homework.hints.title` |
| In the book / In the lecture · at 06:12 | في الكتاب / في المحاضرة · عند 06:12 | `homework.hints.*` |
| Watch it explained / Read it in the book / Practise it | شاهد الشرح / اقرأه في الكتاب / تدرّب عليه | `study.klaro.tiles.*` |
| Linked to 06:12 in the lecture | مرتبط بالدقيقة 06:12 من المحاضرة | old ar page |
| From the clip playing | من المقطع الذي يعمل الآن | new |
| the Klaro cursor | مؤشر Klaro | `tour.steps.studyCursor.title` (not مؤشر كلارو) |
| weak spots | نقاط الضعف / نقاط ضعفك | `minis.intro.titleWeak` |
| Try again | حاول مرة أخرى | `study.practice.again` |
| Level / Subject | المستوى / المادة | `market.level`, `market.subject` |
| min (duration) | دقيقة (12 دقيقة) | `ingest.meta.minutes_other` |

### Progress, quizzes and marking

| English | Arabic | Source |
|---|---|---|
| Next up | التالي | `courses.nextLabel` |
| Continue learning | واصل التعلّم | `home.continueTitle` |
| Lectures finished | المحاضرات المنتهية | `progress.lecturesDone` |
| quiz / quizzes | كويز / الكويزات | `nav.quizzes` |
| homework | واجب | `homework.kind.homework` |
| Quizzes handed in | الكويزات المسلَّمة | `progress.quizzesSat` |
| mark (score) / Average mark | درجة / متوسط الدرجات | `progress.averageMark` |
| streak / study streak | أيام المذاكرة المتتالية (5 أيام متتالية) | new, from `streak.inARow_other` |
| marking / to mark | التصحيح / يصحّح | `nav.marking`; app glossary |
| Scanned exams / Exam results | الامتحانات الورقية / نتائج الامتحانات | `nav.scannedExams`, `nav.results` |
| Automatic / Tutor reviewed | تلقائي / راجعه المدرّس | `markingResults.source_*` |
| Change this mark | غيّر هذه الدرجة | `markingExams.reviewOverride` |
| Send to student / Send results | أرسل إلى الطالب / أرسل النتائج | `markingExams.reviewRelease`, `markingExams.send.*` |
| 57 / 80 marks | 57 من 80 درجة | `markingResults.score` |
| against your mark scheme | وفق نموذج إجابتك | new |

### Course builder and live sessions

| English | Arabic | Source |
|---|---|---|
| upload / Uploading | رفع، ارفع / جارٍ الرفع | `ingest.upload.uploading` |
| Processing / Ready | قيد المعالجة / جاهز | `ingest.status.*` |
| Added to the course | أُضيف إلى الكورس | `ingest.progress.stage.ready` |
| lecture videos | فيديوهات المحاضرات | `ingest.lectures.title` |
| Save order / In order | احفظ الترتيب / بالترتيب | `authoring.order.save`, `authoring.settings.unlock.sequential` |
| New course / Course setup | كورس جديد / إعداد الكورس | `authoring.entry.newCourse`, `authoring.setup.kicker` |
| draft / published | مسودة / منشور | app glossary |
| Schedule (page) / Schedule a session | الجدول / جدولة حصة | `nav.schedule`, `schedule.newSession` |
| Live now / Upcoming | مباشر الآن / قادم | `status.live`, `status.upcoming` |
| attendance / present | الحضور / حاضر | app glossary |
| Klaro sets up the meeting | يُعِدّ Klaro الاجتماع بنفسه | new |
| Students join from Klaro | ينضم الطلاب من Klaro | new |

## 5. Writing rules

**Spelling** (follow the app's spellings of glossary words exactly):
- Final ي keeps its dots (في، الذي، التي، مدرّسي); ى is only for alif maqsura (على، إلى، كفى،
  محتوى، مستوى).
- Hamza as standard: إلى، أسئلة، إجابة، أنشئ؛ امتحان، انضم، ارفع (hamzat wasl, no hamza).
- Shadda where the app writes it: مدرّس، التقدّم، تدرّب، جرّب، قدّم. Other harakat only where a word
  would be misread (the motto's مُصطنعًا keeps its damma).
- Tanween fath on the alef: فورًا، أولًا، جنبًا، أيضًا.

**Punctuation:** Arabic comma ، semicolon ؛ question mark ؟ and quotes «». Full stop and colon as
in English. A list of three is "أ، ب، وج" or "أ وب وج".

**Numbers:** Western digits (0–9) everywhere, as the app and the course material. Percent: 62%.
"x of y" is worded, never slashed: **6 من 10**, السؤال 3 من 8. Times: 06:12, 7:00 م.

**Latin words inside Arabic:**
- لـ and بـ before a Latin word take a tatweel and a space, as the app: لـ Klaro، بـ Klaro.
  و before a Latin word takes a space: IGCSE و A Level. Don't put الـ on a Latin name: امتحانات IGCSE.
- Anything whose order could flip in right-to-left text goes in `<bdi dir="ltr">` or
  `<span lang="en" dir="ltr">`: time ranges (`04:30–06:10`), slashed scores with spaces
  (`57 / 80`), join codes, file names, and any English phrase that ends in punctuation.
  A plain number, "62%" or "6/10" without spaces is safe as it is.

**Course material stays English.** It is written in English in the real courses, and the app shows
it as it is. Mark it so it reads left to right and keeps its English styling:
- inline: `<span lang="en" dir="ltr">Biology 0610</span>` (or `<bdi lang="en">`);
- a block (a book paragraph, a question and its options): add `class="course-content"` **and**
  `lang="en" dir="ltr"`: `<div class="course-content" lang="en" dir="ltr">`. The class sets the
  direction and left alignment; `lang` keeps the Arabic typography rules off it; `dir` makes the
  bidi algorithm and screen readers treat it as English.

What is course material and what is interface, inside the product visuals:

| Keep in English (course material) | Translate (the app's interface, which is Arabic for an Arabic user) |
|---|---|
| Book text, lecture titles (Osmosis), question stems and options, unit and chapter titles from the book | Pane labels and studio head: المحاضرة 4، الكتاب · ص 48، السؤال 3 من 8، المحاضرة / الكتاب / الأسئلة |
| Course names: Biology 0610 · IGCSE, Chemistry 0620 | Status tags: إجابة صحيحة، قيد المعالجة، أُضيف، مباشر الآن، تلقائي |
| File names (Lecture 2, Electrolysis.mp4), join codes, paper source lines (Paper 2 · 2024 · May/June, P2 2023 O/N v21) | Buttons drawn in a visual: شاهد الشرح، أرسل النتائج، ابدأ الحصة |
| Mark-scheme text, a student's handwritten answer | Counts and helper lines: 12 دقيقة · 8 أسئلة تدريب، مرتبط بالدقيقة 06:12 من المحاضرة |
| Levels: IGCSE, O Level, A Level, SAT | `aria-label` of a `role="img"` visual, and every `alt`: Arabic, describing the picture (course names inside them may stay Latin) |
| Research references (authors, year, title, journal, DOI) | Captions and notes under visuals |

**Arrows.** Use the sprite's SVG icons with `.flip` (`#i-arrow`, `#i-back`); they mirror in RTL.
Never put `.flip` on a text character: `›` already mirrors itself in RTL (site.css neutralises
`span.chev.flip` as a safety net, but write `<span class="chev">›</span>`). A text arrow `→` does
**not** mirror: in Arabic copy write `←` ("كيف يستخدم Klaro الأبحاث ←"), or use the SVG.

**Emphasis.** No italics in Arabic (no `<i>`, `<em>` or `.serif` for an Arabic word). Emphasise
with weight (`<b>`) or colour (`.gold-text`, `.key`).

**The gold key bar (`.key`) and other inline marks** (`.gold`, `.gold-text`, `mark`) wrap **whole
words**. Starting or ending one inside a word breaks the joining of the letters at that point.
One `.key` per headline, as in English.

## 6. Typography and CSS (what site.css already does)

You don't need to write CSS for the shared components; site.css has an "Arabic" block. It uses
`.x:lang(ar)` on the element itself, so anything marked `lang="en"` keeps English styling.

- **Font:** the stack is Manrope, then Readex Pro. Manrope has no Arabic letters, so Arabic text is
  set in Readex Pro and Latin words stay in Manrope. Readex Pro is loaded at 400–700, so Arabic
  headlines are 700 where English uses 800. Keep the same Google Fonts link as the English page.
- **No letter-spacing and no uppercase** on any Arabic text. site.css resets every shared
  component that has tracking or capitals: `.display.big`, `.shout`, `.closer-h`, `.foot-motto`,
  `.foot-h`, `.mega-head`, `.mega-item b`, `.motto-lines p`, `.piece .who`, `.tile-body .who`,
  `.rcard .label`, `.rcard h3`, `.p-proof p`, `.p-row-copy h2`, `.p-who h3`, `.p-rel b`,
  `.try-box h3`, `.try-box label`, `.phone`, `.serif`, `.case blockquote` (klaro.css already does
  `.display`, `.h2`, `.card-title`, `.kicker`, `.pane-label`, `.media .foot .label`).
- **Kickers and small labels** become 13px Readex Pro 600, normal case (`.kicker`, `.mega-head`,
  `.foot-h`, `.rcard .label`, `.tile-body .who`, `.piece .who`, `.try-box label`); pane labels,
  card labels and tags are 12px.
- **Leading:** headlines 1.2–1.35 (Latin's 0.9–1.1 would make Arabic lines touch), short
  paragraphs 1.5, `.lead` 1.75, body 1.7.
- **The motto:** `.shout` keeps its force through weight and size: Readex Pro 700, line height 1.2,
  no capitals, no tracking, `clamp(52px, 11.5vw, 160px)` (a touch under the English at the top end,
  because "محتوى مُصطنعًا." is wider than "AI slop.").
- **The key bar** on Arabic is thicker (0.45em) and set higher (78%), a highlight behind the lower
  half of the letters, because a thin bar at the English position would run through the
  descenders. It still draws in from the right, and its animation has an Arabic version.
- **Mirroring:** layouts use logical properties, so grids, menus and cards mirror by themselves.
  site.css also mirrors the few drawn details that need it: the select's chevron, the tilted
  course covers, the timeline labels, the chip and product-chip padding, the hover nudge on
  "Works with" cards, the bars and highlights that fill from the start side, the motto's
  connectors (they draw from the piece before, on the right), and the hero chips (each slides in
  from its own side).
- **Room:** the Products panel is 860px wide in Arabic (780px in English); a few `ch` measures
  are a little wider.

**Page-local styles.** Each English page has its own `<style>` block with a prefix (`sv-`, `pq-`,
`mn-`, `pg-`, `cb-`, `ls-`, `mk-`, `rs-`, `ph-`, `nf-`, `hm-`). Copy it unchanged, then add one
rule at its end for the page's own classes that set `letter-spacing` or `text-transform` **and hold
Arabic text on this page** (find them with `grep -nE "letter-spacing|uppercase"` in the block):

```css
/* Arabic: no tracking, no capitals (see design/brief/arabic.md) */
:is(.mn-eyebrow, .mn-day-title, .mn-rh):lang(ar) { letter-spacing: 0; text-transform: none; }
```

Classes that hold only English course material (for example a mark-scheme table, or the scanned
answer) need no rule, as long as their container is marked `lang="en"`. Don't edit site.css or
klaro.css from a page; tell the Arabic lead if a shared component looks wrong in Arabic.

## 7. Links into the app

Arabic pages open the app in Arabic (`lang=ar`). Nothing to write by hand:
- `tools/site.py` writes every `data-signup`, `data-signup-as`, `data-signin` and `data-legal`
  link's real address, with `lang=ar` on Arabic pages. Write them as in English (`href="#"` is
  fine before stamping).
- `klaro.js` and `site.js` read `<html lang="ar">` and add `lang=ar` to the sign-up, sign-in,
  legal and join-code links at run time.
- The language link is `{twin}` in the partials: the same page in the other language.

## 8. The page template

The Arabic tree mirrors the English one, one folder deeper. Two consequences:
- **Links between pages stay exactly as in the English page.** `../` from `ar/products/x/` is
  `ar/products/`, `../../#try` is the Arabic home's Try it, `../../research/` is `ar/research/`.
- **Every asset path gets one more `../`:** `img/`, `klaro.css`, `site.css`, `klaro.js`,
  `site.js`, and `data-site`.
- The exceptions: a link to the market (no Arabic market) gets one more `../` and `hreflang="en"`;
  a link to a page that has no Arabic version yet goes to the English page the same way.

| Arabic page | Asset prefix and `data-site` | English twin |
|---|---|---|
| `ar/index.html` | `../` | `index.html` |
| `ar/products/index.html`, `ar/research/index.html` | `../../` | `products/index.html`, `research/index.html` |
| `ar/products/<slug>/index.html` | `../../../` | `products/<slug>/index.html` |
| `ar/404.html` | `/` (root-absolute, as `404.html`) | `404.html` |

The skeleton, for `ar/products/<slug>/index.html` (body markers left empty: the tool fills them):

```html
<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<title>شاشة المذاكرة: المحاضرة مربوطة بصفحات الكتاب · Klaro</title>
<meta name="description" content="…50 to 160 characters, Arabic, the page's own summary…">
<!-- chrome:meta -->
<!-- /chrome:meta -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&family=Readex+Pro:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="../../../klaro.css">
<link rel="stylesheet" href="../../../site.css">
<style>
/* the English page's <style> block, unchanged, then its Arabic rule (section 6) */
</style>
</head>
<body data-site="../../../">   <!-- tutor pages (course-builder, live-sessions, marking): add data-default-as="tutor" -->
<!-- chrome:sprite -->
<!-- /chrome:sprite -->
<!-- chrome:header -->
<!-- /chrome:header -->

<main id="top">
<!-- the English page's sections, same order, same classes and ids, Arabic text -->
</main>

<!-- chrome:footer -->
<!-- /chrome:footer -->
<script src="../../../klaro.js"></script>
<script src="../../../site.js"></script>
</body>
</html>
```

- **Title:** the English pattern, in Arabic: "<short name>: <one short benefit> · Klaro", at most
  60 characters, different from every other page's title. The part before the colon is the page's
  name in the breadcrumbs (`tools/site.py` takes it from there for Arabic pages), so start with the
  name from section 3 or 4: "شاشة المذاكرة: …", hub "المنتجات: …", research "مبنيّ على الأبحاث: …",
  404 "الصفحة غير موجودة · Klaro". The home page keeps "Klaro: …".
- **Description:** 50–160 characters, Arabic, not a copy of the title.
- **Same ids** as the English page (`top`, `try`, `motto`, `products`, `how`, `research`, `faq`, the
  research page's principle and reference ids), because links and the partials point at them.
- **One `<h1>`.** Keep `data-nosnippet` on every illustrative visual (`.stage`, `.studio`,
  `.p-vis`, `.tile-vis`, `.connect`, `.mn-stage`), as in English.
- Then run `python3 tools/site.py ar/…/index.html` to stamp the head and chrome, and
  `python3 tools/site.py --check`.

## 9. Checklist for each Arabic page

- [ ] `<html lang="ar" dir="rtl">`; asset paths and `data-site` one level deeper; page links as in
      English; `data-default-as="tutor"` on tutor pages.
- [ ] Empty `chrome:meta`, `chrome:sprite`, `chrome:header`, `chrome:footer` markers (the tool fills
      them; never hand-edit inside them).
- [ ] Title and description in Arabic, within limits, unique.
- [ ] Every sentence of the English page has its Arabic version; no English UI text left (buttons,
      tags, labels, aria-labels, alt text, captions, notes). Course material stays English and is
      marked `lang="en" dir="ltr"` (`.course-content` on blocks).
- [ ] Glossary words exactly as in section 4; product names as in section 3; approved lines
      verbatim.
- [ ] Claims match the English page and [app-facts.md](app-facts.md); nothing added. No "AI"
      outside the motto. "Example" labels kept: مثال، أمثلة.
- [ ] Western digits; "x من y"; time ranges and spaced fractions in `<bdi dir="ltr">`.
- [ ] Arabic punctuation (، ؛ ؟ «»). Final ي with dots; ى only for alif maqsura.
- [ ] No italics on Arabic; `.key`, `.gold`, `.gold-text` and `mark` wrap whole words.
- [ ] Arrows: SVG icons with `.flip`; `›` without `.flip`; `←` in Arabic text, never `→`.
- [ ] Page-local `<style>` copied, plus its Arabic rule for classes with tracking or capitals.
- [ ] `python3 tools/site.py --check` passes (until every Arabic page exists, links to the missing
      ones are expected problems).
- [ ] Looked at in the browser at desktop and phone width: nothing overflows, lines don't touch,
      the menu and the footer mirror, the language link opens the English twin, and the app links
      carry `lang=ar`.

## 10. Known gaps (not for the page agents)

- **`site.js` Try it is English-only.** Its feedback lines ("Correct. It is explained in…", "Not
  quite. The answer is…") and the lesson labels (`lecno`, `page`, `link`, subject names) need Arabic
  versions chosen by `<html lang>`: إجابة صحيحة. الشرح في الجزء المظلَّل من صفحة الكتاب. /
  ليس تمامًا. الإجابة هي B. الشرح في الجزء المظلَّل من صفحة الكتاب. / المحاضرة 4 / الكتاب · ص 48 /
  مرتبط بالدقيقة 06:12 من المحاضرة / الأحياء، الكيمياء، الفيزياء، الرياضيات. The lesson text itself
  (book passage, question, options) stays English. Whoever owns `site.js` does this.
- **No Arabic market.** Arabic pages link to `market/` with `hreflang="en"`.
- **The stamp tool** (`tools/site.py`, as of `688c24b`) already picks the `.ar` partials from
  `<html lang>`, fills `{home}` (this language's home) and `{twin}` (this page in the other
  language, else the other home), gives an `ar/` page its English twin's hints from `site.json`
  (type, group, audience, index), writes hreflang and sitemap alternates once both twins exist, and
  builds Arabic breadcrumbs. Still missing: (1) on a future `ar/404.html`, `{twin}` gives
  `/404.html` (and the English 404 would point to `/ar/404.html`); both should go to the other
  home. (2) `og:image:alt` comes from `site.json` in English on Arabic pages; it needs an Arabic
  alt. (3) Until every Arabic page exists, the partials' links to the missing ones fail
  `--check`; land the Arabic pages together, or let the tool send a link to a missing `ar/` page
  to its English twin.
