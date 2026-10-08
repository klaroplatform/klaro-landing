/* Klaro site: fixed-audience sign-up links, the Products menu, the join-code field and the Try it demo.
   klaro.js already runs the student/tutor switch, app links, reveal and FAQ. */
(function () {
  var meta = document.querySelector('meta[name="klaro-app"]');
  var APP = (meta && meta.content) || 'https://app.klaroplatform.com';
  var SITE = document.body.dataset.site || '';

  // Links that always go to one audience's sign-up, whatever the page switch says (klaro.js
  // rewrites every [data-signup] to follow the switch, so these use their own attribute).
  document.querySelectorAll('[data-signup-as]').forEach(function (a) { a.href = APP + '/sign-up?as=' + a.dataset.signupAs; });
  // Tutor product pages have no student/tutor switch: their header "Get started" goes to tutor sign-up.
  if (document.body.dataset.defaultAs === 'tutor' && !document.querySelector('.seg[data-audience]')) {
    document.querySelectorAll('[data-signup]').forEach(function (a) { a.href = APP + '/sign-up?as=tutor'; });
  }

  // Products menu: one panel, opened by "Products" on desktop and the menu button on phones.
  var panel = document.getElementById('products-menu');
  var openers = document.querySelectorAll('[data-menu]');
  function setMenu(open) {
    panel.hidden = !open;
    openers.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
  }
  openers.forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); setMenu(panel.hidden); });
  });
  document.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setMenu(false); openers[0].focus(); } });
  panel.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

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
    b.addEventListener('click', function (e) { e.stopPropagation(); setMenu(true); showCode(); });
  });
  codeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = codeForm.code.value.trim().toUpperCase();
    if (!code) { codeForm.code.focus(); return; }
    // The app doesn't take a code in the address yet; for now this opens student sign-up.
    window.open(APP + '/sign-up?as=student', '_blank', 'noopener');
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
        t('feedback').textContent = right ? 'Correct. The highlighted line on the book page says why.' : 'Not quite. Read the highlighted line on the book page, then try again.';
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
