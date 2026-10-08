/* Klaro site: fixed-audience sign-up links, the Products menu, the join-code field and the Try it demo.
   klaro.js already runs the student/tutor switch, app links, reveal and FAQ. */
(function () {
  var meta = document.querySelector('meta[name="klaro-app"]');
  var APP = (meta && meta.content) || 'https://app.klaroplatform.com';
  var SITE = document.body.dataset.site || '';
  // Arabic pages open the app in Arabic, as in klaro.js.
  var LANG = document.documentElement.lang === 'ar' ? '&lang=ar' : '';

  // Links that always go to one audience's sign-up, whatever the page switch says (klaro.js
  // rewrites every [data-signup] to follow the switch, so these use their own attribute).
  // tools/site.py writes the same addresses into the HTML, so they work without JavaScript too.
  document.querySelectorAll('[data-signup-as]').forEach(function (a) { a.href = APP + '/sign-up?as=' + a.dataset.signupAs + LANG; });
  // Tutor product pages have no student/tutor switch: their header "Get started" goes to tutor sign-up.
  if (document.body.dataset.defaultAs === 'tutor' && !document.querySelector('.seg[data-audience]')) {
    document.querySelectorAll('[data-signup]').forEach(function (a) { a.href = APP + '/sign-up?as=tutor' + LANG; });
  }

  // Products menu: one panel, opened by "Products" on desktop and the menu button on phones.
  // It opens with its CSS animation; closing plays a short fade (.mega.closing), then hides it.
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var panel = document.getElementById('products-menu');
  var openers = document.querySelectorAll('[data-menu]');
  var menuOpen = false, lastOpener = null, closeTimer = 0;
  function setMenu(open) {
    menuOpen = open;
    openers.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
    clearTimeout(closeTimer);
    panel.classList.remove('closing');
    if (open) { panel.hidden = false; return; }
    if (panel.hidden) return;
    if (still) { panel.hidden = true; return; }
    panel.classList.add('closing');
    closeTimer = setTimeout(function () { panel.hidden = true; panel.classList.remove('closing'); }, 180);
  }
  // Escape returns focus to the button that opened the menu, or to whichever opener is on screen.
  function focusOpener() {
    var b = lastOpener && lastOpener.getClientRects().length ? lastOpener : null;
    openers.forEach(function (x) { if (!b && x.getClientRects().length) b = x; });
    if (b) b.focus();
  }
  openers.forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); lastOpener = b; setMenu(!menuOpen); });
  });
  document.addEventListener('click', function (e) { if (menuOpen && !panel.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { setMenu(false); focusOpener(); } });
  // A link to somewhere on this same page (like "Try it" on the home page) closes the menu.
  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { if (a.hash && a.pathname === location.pathname) setMenu(false); });
  });

  // "Have a join code?" turns into a code field, like SchoolAI's "Space code".
  var codeBtn = panel.querySelector('[data-joincode]');
  var codeForm = panel.querySelector('[data-joinform]');
  function showCode() {
    codeBtn.hidden = true;
    codeForm.hidden = false;
    codeForm.code.focus();
  }
  codeBtn.addEventListener('click', showCode);
  // The header's "Join code" button opens the menu straight at the code field.
  document.querySelectorAll('[data-joincode-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); lastOpener = b; setMenu(true); showCode(); });
  });
  codeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = codeForm.code.value.trim().toUpperCase();
    if (!code) { codeForm.code.focus(); return; }
    // The app's join link: /join?code=… lets the student in once they sign in or sign up.
    window.location.href = APP + '/join?code=' + encodeURIComponent(code) + LANG;
  });

  // Try it: example lessons. Real courses carry the tutor's own lecture, book and past papers.
  var LESSONS = {
    'igcse-biology': {
      level: 'igcse', subject: 'Biology', course: 'Biology 0610 · IGCSE', lecno: 'Lecture 4', lecture: 'Osmosis', img: SITE + 'img/lecture-osmosis.webp',
      page: 'Book · p. 48', link: 'Linked to 06:12 in the lecture',
      before: 'Water molecules move freely through a partially permeable membrane. ',
      key: 'Osmosis is the net movement of water from a dilute solution to a more concentrated one',
      after: ' through such a membrane.',
      q: 'A potato slice is left in pure water. Water moves into its cells. What is this called?',
      opts: ['Diffusion', 'Osmosis', 'Active transport'], answer: 1
    },
    'igcse-chemistry': {
      level: 'igcse', subject: 'Chemistry', course: 'Chemistry 0620 · IGCSE', lecno: 'Lecture 2', lecture: 'Electrolysis', img: SITE + 'img/course-chemistry.webp',
      page: 'Book · p. 112', link: 'Linked to 04:40 in the lecture',
      before: 'In electrolysis, an ionic compound that is molten or dissolved is broken down by an electric current. ',
      key: 'Positive ions move to the cathode, where they gain electrons',
      after: ' and are discharged.',
      q: 'Molten lead(II) bromide is electrolysed. What forms at the cathode?',
      opts: ['Bromine', 'Lead', 'Hydrogen'], answer: 1
    },
    'alevel-physics': {
      level: 'alevel', subject: 'Physics', course: 'Physics 9702 · A Level', lecno: 'Lecture 2', lecture: 'Acceleration', img: SITE + 'img/course-physics.webp',
      page: 'Book · p. 21', link: 'Linked to 08:05 in the lecture',
      before: 'Velocity is speed in a stated direction. ',
      key: 'Acceleration is the rate of change of velocity: a = (v − u) / t',
      after: ', measured in m/s².',
      q: 'A car accelerates uniformly from rest to 20 m/s in 8.0 s. What is its acceleration?',
      opts: ['2.5 m/s²', '0.40 m/s²', '160 m/s²'], answer: 0
    },
    'sat-math': {
      level: 'sat', subject: 'Math', course: 'SAT Math', lecno: 'Lecture 3', lecture: 'Linear equations', img: SITE + 'img/course-sat-math.webp',
      page: 'Book · p. 64', link: 'Linked to 02:30 in the lecture',
      before: 'A linear equation in one variable has that variable only to the first power. ',
      key: 'To solve it, undo each operation in reverse order, doing the same to both sides',
      after: '.',
      q: 'If 3x + 5 = 20, what is the value of x?',
      opts: ['3', '25/3', '5'], answer: 2
    }
  };

  var form = document.querySelector('[data-try]');
  var view = document.querySelector('[data-try-view]');
  if (!form || !view) return;
  var level = form.level, subject = form.subject;
  function t(name) { return view.querySelector('[data-t="' + name + '"]'); }

  function fillSubjects() {
    subject.innerHTML = '';
    Object.keys(LESSONS).forEach(function (id) {
      if (LESSONS[id].level !== level.value) return;
      var o = document.createElement('option');
      o.value = id; o.textContent = LESSONS[id].subject;
      subject.appendChild(o);
    });
  }

  function render(id) {
    var L = LESSONS[id];
    ['course', 'lecno', 'lecture', 'page', 'link', 'before', 'key', 'after', 'q'].forEach(function (k) { t(k).textContent = L[k]; });
    t('img').src = L.img;
    t('key').classList.remove('on');
    t('feedback').textContent = '';
    t('feedback').className = 'feedback';
    var box = t('opts');
    box.innerHTML = '';
    L.opts.forEach(function (text, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.innerHTML = '<b>' + 'ABC'[i] + '</b>';
      b.appendChild(document.createTextNode(text));
      b.addEventListener('click', function () {
        box.querySelectorAll('.opt').forEach(function (x) { x.classList.remove('is-right', 'is-wrong'); });
        var right = i === L.answer;
        b.classList.add(right ? 'is-right' : 'is-wrong');
        t('key').classList.add('on');
        t('feedback').className = 'feedback ' + (right ? 'ok' : 'no');
        t('feedback').textContent = right ? 'Correct. It is explained in the highlighted part of the book page.' : 'Not quite. The answer is ' + 'ABC'[L.answer] + '. It is explained in the highlighted part of the book page.';
      });
      box.appendChild(b);
    });
    view.classList.remove('swap');
    void view.offsetWidth;
    view.classList.add('swap');
  }

  level.addEventListener('change', fillSubjects);
  form.addEventListener('submit', function (e) { e.preventDefault(); render(subject.value); });
  fillSubjects();
  render(subject.value);
})();

/* Motion, on every page that loads site.js: scroll reveal, the motto's lines and connectors, the
   product visuals filling in. Calm and once; the CSS is the "Motion" block at the end of site.css.
   Nothing is hidden unless html.motion is set, and it is never set with reduced motion. Only what
   starts below the first screen is hidden, so nothing visible on load blinks. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  var fold = window.innerHeight;

  // Where an element starts; one hidden for the other audience counts from its nearest shown parent.
  function topOf(el) {
    while (el && !el.getClientRects().length) el = el.parentElement;
    return el ? el.getBoundingClientRect().top : 0;
  }
  function isRtl(el) { return getComputedStyle(el).direction === 'rtl'; }
  function inOrder(a, b) { return a.target.compareDocumentPosition(b.target) & 4 ? -1 : 1; }

  // 1. Scroll reveal. Elements that come in together are staggered 80ms apart, per parent.
  var lastPiece = 0;
  var io = new IntersectionObserver(function (entries) {
    var parents = [];
    entries.filter(function (en) { return en.isIntersecting; }).sort(inOrder).forEach(function (en) {
      var el = en.target, n = 0, d;
      parents.forEach(function (p) { if (p === el.parentNode) n++; });
      parents.push(el.parentNode);
      d = Math.min(n, 5) * 0.08;
      // The motto's note comes last, after the connectors between the pieces have drawn.
      if (el.classList.contains('piece')) lastPiece = Date.now();
      if (el.classList.contains('connect-note') && lastPiece) d = Math.max(d, 1.35 - (Date.now() - lastPiece) / 1000);
      el.style.setProperty('--k-d', d.toFixed(2) + 's');
      el.classList.add('k-in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  function watch(selector, cls) {
    document.querySelectorAll(selector).forEach(function (el) {
      // skip klaro.js's own .reveal, anything inside an element already watched, and what's on screen
      if (el.classList.contains('reveal') || el.closest('.k-rv, .k-grp') || topOf(el) <= fold) return;
      el.classList.add(cls);
      io.observe(el);
    });
  }
  // Groups: their children move (a feature row's copy then its visual; the motto's two lines).
  // A feature row stacked in one column reveals its copy and visual one by one, as each scrolls in.
  document.querySelectorAll('.p-row').forEach(function (row) {
    if (getComputedStyle(row).gridTemplateColumns.split(' ').length < 2) row.classList.add('k-stack');
  });
  watch('.p-row:not(.k-stack), .motto-big', 'k-grp');
  watch('.section-head, .head-row, .p-proof .wrap, .tile, .rcard, .step, .p-who .card, .p-rel, .closer, .p-row.k-stack > *, ' +
    '.motto .kicker, .motto-lines p, .piece, .connect-note, .try-copy, .try-box, .try-stage', 'k-rv');

  // 2. Product visuals: progress bars and rings fill from 0 to their value, static book highlights
  // sweep in, and timeline marks pop in from the start side. The studio demos keep their own loops.
  var ringOk = getComputedStyle(root).getPropertyValue('--ring').trim() === '0%'; // @property registered
  var fio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('k-go');
      fio.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -20% 0px' });

  var BOXES = '.p-vis, .p-field, .tile-vis';
  document.querySelectorAll(BOXES).forEach(function (box) {
    if (box.parentElement.closest(BOXES)) return;
    var n = 0;
    function prep(el, cls, delay) {
      el.classList.add(cls);
      if (isRtl(el)) el.classList.add('k-rtl');
      el.style.setProperty('--k-fd', delay.toFixed(2) + 's');
      n++;
    }
    box.querySelectorAll('.p-timeline > i, .bar > i, .edge > i').forEach(function (el) {
      if (getComputedStyle(el).animationName === 'none') prep(el, 'k-f', 0.3 + n * 0.08);
    });
    if (ringOk) box.querySelectorAll('.ring').forEach(function (el) { prep(el, 'k-r', 0.3 + n * 0.08); });
    box.querySelectorAll('.p-timeline .mk').forEach(function (el, i) {
      var at = parseFloat(el.style.getPropertyValue('inset-inline-start'));
      prep(el, 'k-mk', 0.35 + (isNaN(at) ? i * 30 : at) / 100 * 0.8);
    });
    box.querySelectorAll('mark').forEach(function (el) {
      var cs = getComputedStyle(el);
      if (cs.animationName === 'none' && /^100%/.test(cs.backgroundSize)) prep(el, 'k-sw', 0.4);
    });
    if (n) { box.classList.add('k-box'); fio.observe(box); }
  });

  // 3. Hero chips need no observer: their CSS plays once html.motion is set.
  root.classList.add('motion');
})();
