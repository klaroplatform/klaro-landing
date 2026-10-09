/* Klaro Market (/market/): the example courses, the course card, search and filters, and the course
   drawer. Enroll leads to student sign-up with the course attached: <app>/sign-up?as=student&course=<id>.
   Every course, tutor and price here is an example until the market's back end exists.

   The header, footer and icon sprite are the site's own (stamped by tools/site.py), run by
   klaro.js and site.js. This file stays out of their way: it uses km- classes only, never .seg
   (klaro.js drives every .seg as the student/tutor switch) and never [data-signup]. */
(function () {
  // The app's address comes from the page, as in klaro.js, so staging and production differ by one line.
  var meta = document.querySelector('meta[name="klaro-app"]');
  var APP = (meta && meta.content) || 'https://app.klaroplatform.com';
  var LANG = document.documentElement.lang === 'ar' ? '&lang=ar' : '';
  var RTL = document.documentElement.dir === 'rtl';
  var SITE = document.body.dataset.site; if (SITE == null) SITE = '../';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TUTORS = {
    mona: { name: 'Mona Adel', initials: 'MA', hue: '#3f8f69', bio: 'Biology tutor for IGCSE and A Level, nine years in the classroom.' },
    karim: { name: 'Karim Hassan', initials: 'KH', hue: '#536a7c', bio: 'Chemistry, from first atoms to A Level organic.' },
    youssef: { name: 'Youssef Nabil', initials: 'YN', hue: '#9254e0', bio: 'Physics with lots of worked examples and past papers.' },
    salma: { name: 'Salma Fathy', initials: 'SF', hue: '#d49e37', bio: 'Mathematics tutor; pure, statistics and exam technique.' },
    nour: { name: 'Nour Samir', initials: 'NS', hue: '#b94a48', bio: 'English language and writing, first and second language.' },
    hana: { name: 'Hana Mostafa', initials: 'HM', hue: '#3f6b62', bio: 'SAT preparation, Math and Reading and Writing.' }
  };
  var LESSONS = {
    Biology: ['Cell structure', 'Movement in and out of cells', 'Enzymes', 'Photosynthesis', 'Transport in plants'],
    Chemistry: ['States of matter', 'Atomic structure', 'Bonding', 'Stoichiometry', 'Electrolysis'],
    Physics: ['Motion', 'Forces', 'Energy, work and power', 'Waves', 'Electricity'],
    Mathematics: ['Number', 'Algebra', 'Coordinate geometry', 'Trigonometry', 'Probability'],
    English: ['Reading for meaning', 'Directed writing', 'Summary writing', 'Narrative writing', 'Persuasive writing'],
    'SAT Math': ['Linear equations', 'Systems of equations', 'Quadratics', 'Data analysis', 'Geometry'],
    'SAT Reading and Writing': ['Words in context', 'Text structure', 'Command of evidence', 'Transitions', 'Grammar and punctuation']
  };
  var C = function (id, title, subject, level, year, tutor, lectures, quizzes, hours, students, price, per, img, flag) {
    return { id: id, title: title, subject: subject, level: level, year: year, tutor: tutor, lectures: lectures, quizzes: quizzes, hours: hours, students: students, price: price, per: per, img: SITE + 'img/course-' + img + '.webp', flag: flag };
  };
  var COURSES = [
    C('bio-0610', 'Biology 0610', 'Biology', 'IGCSE', 'Year 11', 'mona', 18, 9, 14, 320, 450, 'month', 'biology', 'Popular'),
    C('chem-0620', 'Chemistry 0620', 'Chemistry', 'IGCSE', 'Year 10', 'karim', 22, 10, 17, 280, 450, 'month', 'chemistry'),
    C('phys-9702', 'Physics 9702', 'Physics', 'A Level', 'Year 12', 'youssef', 26, 12, 22, 190, 600, 'month', 'physics', 'New'),
    C('math-0580', 'Mathematics 0580', 'Mathematics', 'IGCSE', 'Year 11', 'salma', 30, 15, 24, 410, 500, 'month', 'mathematics', 'Popular'),
    C('eng-0500', 'English 0500', 'English', 'IGCSE', 'Year 10', 'nour', 16, 8, 12, 150, 400, 'month', 'english'),
    C('sat-math', 'SAT Math', 'SAT Math', 'SAT', 'Any year', 'hana', 20, 14, 18, 260, 1800, 'course', 'sat-math', 'Starts 12 Oct'),
    C('sat-rw', 'SAT Reading and Writing', 'SAT Reading and Writing', 'SAT', 'Any year', 'hana', 18, 12, 15, 210, 1800, 'course', 'sat-rw'),
    C('bio-9700', 'Biology 9700', 'Biology', 'A Level', 'Year 12', 'mona', 24, 11, 20, 120, 600, 'month', 'biology'),
    C('chem-9701', 'Chemistry 9701', 'Chemistry', 'A Level', 'Year 13', 'karim', 28, 13, 23, 95, 650, 'month', 'chemistry'),
    C('phys-0625', 'Physics 0625', 'Physics', 'IGCSE', 'Year 10', 'youssef', 20, 10, 16, 230, 450, 'month', 'physics'),
    C('math-9709', 'Mathematics 9709', 'Mathematics', 'A Level', 'Year 12', 'salma', 32, 16, 27, 140, 600, 'month', 'mathematics', 'New'),
    C('eng-0510', 'English 0510', 'English', 'IGCSE', 'Year 9', 'nour', 14, 7, 10, 175, 350, 'month', 'english')
  ];
  function byId(id) { return COURSES.filter(function (x) { return x.id === id; })[0]; }

  var ICON_CLOSE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  function money(n) { return 'EGP ' + n.toLocaleString('en'); }
  function priceHTML(c) { return '<span class="km-price"><b>' + money(c.price) + '</b><span>/ ' + c.per + '</span></span>'; }
  function avatar(t, large) { return '<span class="km-avatar' + (large ? ' lg' : '') + '" style="--h: ' + t.hue + '" aria-hidden="true">' + t.initials + '</span>'; }
  function flagTag(c) { return c.flag ? '<span class="tag ' + (c.flag === 'New' ? 'tag-purple' : c.flag === 'Popular' ? 'tag-green' : 'tag-yellow') + '">' + c.flag + '</span>' : ''; }
  function enrollHref(c) { return APP + '/sign-up?as=student&course=' + encodeURIComponent(c.id) + LANG; }

  /** One course card: the kit's media card, the tutor, three figures, the price and Enroll. */
  function card(c) {
    var t = TUTORS[c.tutor];
    return '<a class="media km-card lift" href="#c-' + c.id + '" data-course="' + c.id + '">' +
      '<div class="pic"><img src="' + c.img + '" alt="" loading="lazy" width="960" height="548"><div class="corner"><span class="tag tag-slate">' + c.level + '</span>' + flagTag(c) + '</div>' +
      '<div class="scrim"><div class="eyebrow">' + c.level + ' · ' + c.year + '</div><h3 class="title">' + c.title + '</h3></div></div>' +
      '<div class="km-tutor">' + avatar(t) + t.name + '</div>' +
      '<div class="figs"><span><b>' + c.lectures + '</b> lectures</span><span><b>' + c.quizzes + '</b> quizzes</span><span><b>' + c.students + '</b> students</span></div>' +
      '<div class="foot">' + priceHTML(c) + '<span class="btn btn-primary km-btn-sm">Enroll</span></div></a>';
  }

  // ---------- the course drawer ----------
  var drawer = document.querySelector('.km-drawer');
  var lastFocus;
  function drawerHTML(c) {
    var t = TUTORS[c.tutor], L = LESSONS[c.subject];
    return '<div class="pic"><img src="' + c.img + '" alt=""><div class="corner"><span class="p-draft">Example course</span></div>' +
        '<button class="km-close" type="button" aria-label="Close" data-close>' + ICON_CLOSE + '</button>' +
        '<div class="scrim"><div class="eyebrow">' + c.level + ' · ' + c.year + ' · ' + c.subject + '</div><h2 id="km-drawer-title">' + c.title + '</h2></div></div>' +
      '<div class="km-drawer-body">' +
        '<div class="km-who">' + avatar(t, true) + '<div><b>' + t.name + '</b><p class="small">' + t.bio + '</p></div></div>' +
        '<dl class="km-facts"><div><dt>Lectures</dt><dd>' + c.lectures + '</dd></div><div><dt>Quizzes</dt><dd>' + c.quizzes + '</dd></div><div><dt>Hours</dt><dd>' + c.hours + '</dd></div></dl>' +
        '<div class="km-block"><span class="kicker">What you get</span><div class="km-tags">' +
          '<span class="tag tag-purple">Lectures</span><span class="tag km-tag-teal">The book, linked</span><span class="tag km-tag-amber">Practice questions</span><span class="tag tag-neutral">Past papers</span><span class="tag tag-neutral">Progress</span></div></div>' +
        '<div class="km-block"><span class="kicker">The first lectures</span><ol class="km-lessons">' +
          L.map(function (l, i) { return '<li><span class="n">' + (i + 1) + '</span>' + l + '</li>'; }).join('') +
          '<li class="more"><span class="n">+</span>' + (c.lectures - L.length) + ' more lectures</li></ol></div>' +
        '<p class="small">' + c.students + ' students study this course. ' + (c.per === 'month' ? 'Paid monthly.' : 'One payment for the whole course.') + '</p>' +
      '</div>' +
      '<div class="km-buy">' + priceHTML(c) + '<a class="btn btn-primary btn-lg" href="' + enrollHref(c) + '">Create an account to enroll</a></div>';
  }
  function isOpen() { return document.body.classList.contains('km-open'); }
  function openCourse(id) {
    var c = byId(id);
    if (!c || !drawer) return;
    if (!isOpen()) lastFocus = document.activeElement;
    drawer.innerHTML = drawerHTML(c);
    document.body.classList.add('km-open');
    try { history.replaceState(null, '', '#c-' + id); } catch (e) {}
    setTimeout(function () { var x = drawer.querySelector('[data-close]'); if (x) x.focus({ preventScroll: true }); }, 50);
  }
  function closeCourse() {
    if (!isOpen()) return;
    document.body.classList.remove('km-open');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-course]');
    if (open) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; // let a new tab open the course's own link
      e.preventDefault(); openCourse(open.dataset.course); return;
    }
    if (e.target.closest('[data-close]')) closeCourse();
  });
  // Escape closes; Tab stays inside the open drawer.
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { closeCourse(); return; }
    if (e.key !== 'Tab') return;
    var f = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], at = document.activeElement;
    if (!drawer.contains(at)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && at === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  });

  // ---------- small shared behaviours ----------
  /** The level control's sliding pill. It sits at the inline start, so in RTL it moves the other way. */
  function placePill(seg) {
    var pill = seg.querySelector('.km-pill'), on = seg.querySelector('button[aria-pressed="true"]');
    if (!pill || !on) return;
    var x = RTL ? on.offsetLeft + on.offsetWidth - seg.clientWidth : on.offsetLeft;
    pill.style.width = on.offsetWidth + 'px';
    pill.style.translate = x + 'px 0';
  }
  /** Animate items from their old place to their new one (FLIP), after `change` moves them. */
  function flip(items, change) {
    var first = new Map();
    items.forEach(function (el) { first.set(el, el.getBoundingClientRect()); });
    change();
    if (still) return;
    items.forEach(function (el) {
      if (el.hidden || !el.isConnected) return;
      var a = first.get(el), b = el.getBoundingClientRect();
      if (!a || (!a.width && !a.height)) { el.animate([{ opacity: 0, scale: .96 }, { opacity: 1, scale: 1 }], { duration: 320, easing: 'cubic-bezier(.23,1,.32,1)' }); return; }
      var dx = a.left - b.left, dy = a.top - b.top;
      if (dx || dy) el.animate([{ translate: dx + 'px ' + dy + 'px' }, { translate: '0 0' }], { duration: 480, easing: 'cubic-bezier(.22,1.12,.36,1)' });
    });
  }

  // ---------- the catalogue: search, level, subjects, sort ----------
  var grid = document.getElementById('grid');
  if (grid) {
    var state = { level: 'all', subject: 'all', q: '', sort: 'popular' };
    var SUBJECTS = ['all', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English', 'SAT'];
    var group = function (c) { return c.level === 'SAT' ? 'SAT' : c.subject; };
    var level = document.getElementById('level');
    var subjects = document.getElementById('subjects');
    var sort = document.getElementById('sort');
    var input = document.getElementById('q');

    grid.innerHTML = COURSES.map(card).join('') +
      '<div class="km-empty" id="km-empty" hidden><img src="' + SITE + 'img/empty-no-courses.webp" alt="" width="150" height="150">' +
      '<h3 class="card-title">No course matches that</h3><p class="small">Try another subject or level.</p>' +
      '<button class="btn btn-primary" type="button" data-clear>Clear the filters</button></div>';
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.km-card'));
    var empty = document.getElementById('km-empty');

    // Subject buttons are built once and updated in place, so keyboard focus stays where it was.
    subjects.innerHTML = SUBJECTS.map(function (s) {
      return '<button class="km-chip" type="button" data-sub="' + s + '" aria-pressed="' + (s === 'all') + '">' + (s === 'all' ? 'All subjects' : s) + '<span class="km-count"></span></button>';
    }).join('');

    var matches = function (c, ignoreSubject) {
      var hay = (c.title + ' ' + c.subject + ' ' + c.level + ' ' + TUTORS[c.tutor].name).toLowerCase();
      return (state.level === 'all' || c.level === state.level) &&
        (ignoreSubject || state.subject === 'all' || group(c) === state.subject) &&
        (!state.q || state.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; }));
    };
    var updateSubjects = function () {
      subjects.querySelectorAll('.km-chip').forEach(function (b) {
        var s = b.dataset.sub;
        var n = COURSES.filter(function (c) { return matches(c, true) && (s === 'all' || group(c) === s); }).length;
        b.setAttribute('aria-pressed', String(state.subject === s));
        b.querySelector('.km-count').textContent = n;
      });
    };
    var apply = function () {
      updateSubjects();
      var shown = 0;
      var order = COURSES.slice().sort(function (a, b) {
        return state.sort === 'price' ? (a.per === b.per ? a.price - b.price : a.per === 'month' ? -1 : 1)
          : state.sort === 'lectures' ? b.lectures - a.lectures : b.students - a.students;
      });
      flip(cards, function () {
        order.forEach(function (c) {
          var el = grid.querySelector('[data-course="' + c.id + '"]');
          el.hidden = !matches(c); if (!el.hidden) shown++;
          grid.insertBefore(el, empty);
        });
      });
      document.getElementById('count').textContent = shown;
      document.getElementById('noun').textContent = shown === 1 ? 'course' : 'courses';
      document.getElementById('what').textContent = state.q ? 'for “' + state.q + '”' : '';
      empty.hidden = shown > 0;
    };
    var setLevel = function (v) {
      state.level = v;
      level.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.v === v)); });
      placePill(level);
    };

    var pill = document.createElement('span');
    pill.className = 'km-pill'; pill.setAttribute('aria-hidden', 'true');
    level.prepend(pill);
    placePill(level);
    requestAnimationFrame(function () { level.classList.add('ready'); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placePill(level); });
    window.addEventListener('resize', function () { placePill(level); });

    level.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      setLevel(b.dataset.v); apply();
    });
    subjects.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state.subject = b.dataset.sub; apply();
    });
    sort.addEventListener('change', function () { state.sort = sort.value; apply(); });
    var typing;
    input.addEventListener('input', function () {
      state.q = input.value.trim();
      clearTimeout(typing); typing = setTimeout(apply, 120);
    });
    grid.addEventListener('click', function (e) {
      if (!e.target.closest('[data-clear]')) return;
      state.subject = 'all'; state.q = ''; input.value = '';
      setLevel('all'); apply(); input.focus();
    });

    sort.value = state.sort;
    apply();
    // Announce the count only after the first render, so the page doesn't speak on load.
    document.getElementById('result').setAttribute('aria-live', 'polite');
  }

  // A shared link to one course (#c-bio-0610) opens its drawer.
  if (location.hash.indexOf('#c-') === 0) openCourse(location.hash.slice(3));

  window.KM = { APP: APP, COURSES: COURSES, TUTORS: TUTORS, open: openCourse, close: closeCourse };
})();
