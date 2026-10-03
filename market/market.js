/* Klaro Market, the public page: example courses, the header and footer, the course card, and
   the course drawer. Enroll leads to sign-up with the course attached.
   Every course, tutor and price here is an example until the market's back end exists. */
(function () {
  var APP = 'https://app.klaroplatform.com';
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
    return { id: id, title: title, subject: subject, level: level, year: year, tutor: tutor, lectures: lectures, quizzes: quizzes, hours: hours, students: students, price: price, per: per, img: '../img/course-' + img + '.webp', flag: flag };
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

  function money(n) { return 'EGP ' + n.toLocaleString('en'); }
  function priceHTML(c) { return '<span class="price"><b>' + money(c.price) + '</b><span>/ ' + c.per + '</span></span>'; }
  function avatar(t, size) { return '<span class="avatar" style="background: linear-gradient(135deg, ' + t.hue + ', #c58be8 70%, #f0c93d)' + (size ? '; width: ' + size + 'px; height: ' + size + 'px; font-size: ' + Math.round(size * .36) + 'px' : '') + '">' + t.initials + '</span>'; }
  function flagTag(c) { return c.flag ? '<span class="tag ' + (c.flag === 'New' ? 'tag-purple' : c.flag === 'Popular' ? 'tag-green' : 'tag-yellow') + '">' + c.flag + '</span>' : ''; }
  function chrome() { return document.body.dataset.chrome || 'public'; }

  /** One market course card: the media card, the tutor, two figures, the price and Enroll. */
  function card(c, extra) {
    var t = TUTORS[c.tutor];
    return '<a class="media mcard lift ' + (extra || '') + '" href="#c-' + c.id + '" data-course="' + c.id + '">' +
      '<div class="pic"><img src="' + c.img + '" alt="" loading="lazy" width="960" height="548"><div class="corner"><span class="tag tag-slate" style="background: rgb(255 255 255 / .9)">' + c.level + '</span>' + flagTag(c) + '</div>' +
      '<div class="scrim"><div class="eyebrow">' + c.level + ' · ' + c.year + '</div><div class="title">' + c.title + '</div></div></div>' +
      '<div class="tutor">' + avatar(t) + t.name + '</div>' +
      '<div class="figs"><span><b>' + c.lectures + '</b> lectures</span><span><b>' + c.quizzes + '</b> quizzes</span><span><b>' + c.students + '</b> students</span></div>' +
      '<div class="foot">' + priceHTML(c) + '<span class="btn btn-primary btn-sm">Enroll</span></div></a>';
  }

  // ---------- chrome: the public header and footer, or the app's top bar ----------
  var ICON = {
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>',
    menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    cart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>'
  };
  function chromeHTML() {
    return '<header class="topbar pub-only"><div class="wrap"><a class="brand" href="../" aria-label="Klaro home"><img src="../img/klaro-wordmark.svg" alt="Klaro" width="100" height="30"></a><span class="spacer"></span>' +
      '<a class="btn btn-quiet hide-sm" href="../#tutor">For tutors</a><a class="btn btn-quiet hide-sm" href="' + APP + '/sign-in">Sign in</a>' +
      '<a class="btn btn-glass" href="' + APP + '/sign-up?as=student">Get started</a></div></header>';
  }
  function footerHTML() {
    return '<footer class="footer pub-only"><div class="wrap"><img src="../img/klaro-icon.svg" alt="Klaro" width="19" height="22"><span>© 2026 Klaro</span><a href="' + APP + '/terms">Terms</a><a href="' + APP + '/privacy">Privacy</a><span class="example">Courses, tutors and prices on this page are examples.</span></div></footer>';
  }

  // ---------- the course drawer ----------
  var drawer, lastFocus;
  function drawerHTML(c) {
    var t = TUTORS[c.tutor], L = LESSONS[c.subject];
    var pub = chrome() === 'public';
    return '<div class="pic"><img src="' + c.img + '" alt=""><button class="close" type="button" aria-label="Close" data-close>' + ICON.close + '</button>' +
      '<div class="scrim"><div class="eyebrow">' + c.level + ' · ' + c.year + ' · ' + c.subject + '</div><h2 id="drawer-title">' + c.title + '</h2></div></div>' +
      '<div class="body" id="drawer-body">' +
        '<div style="display: flex; align-items: center; gap: 12px">' + avatar(t, 44) + '<div><div style="font-weight: 700">' + t.name + '</div><div class="small">' + t.bio + '</div></div></div>' +
        '<dl class="facts" style="margin: 0"><div><dt>Lectures</dt><dd>' + c.lectures + '</dd></div><div><dt>Quizzes</dt><dd>' + c.quizzes + '</dd></div><div><dt>Hours</dt><dd>' + c.hours + '</dd></div></dl>' +
        '<div style="display: flex; flex-direction: column; gap: 10px"><span class="kicker">What you get</span>' +
          '<div style="display: flex; flex-wrap: wrap; gap: 6px"><span class="tag tag-purple">Lectures</span><span class="tag" style="background: var(--teal-soft); color: var(--teal-dark)">The book, linked</span><span class="tag" style="background: var(--amber-soft); color: var(--warn)">Practice questions</span><span class="tag tag-neutral">Past papers</span><span class="tag tag-neutral">Progress</span></div></div>' +
        '<div style="display: flex; flex-direction: column; gap: 10px"><span class="kicker">The first lectures</span><ol class="lessons">' +
          L.map(function (l, i) { return '<li><span class="n">' + (i + 1) + '</span>' + l + '</li>'; }).join('') +
          '<li class="more"><span class="n" style="background: var(--surface); color: var(--muted)">+</span>' + (c.lectures - L.length) + ' more lectures</li></ol></div>' +
        '<p class="small">' + c.students + ' students study this course. ' + (c.per === 'month' ? 'Paid monthly; stop any month.' : 'One payment for the whole course.') + '</p>' +
      '</div>' +
      '<div class="buy">' + priceHTML(c) + (pub
        ? '<a class="btn btn-primary btn-lg" href="' + APP + '/sign-up?as=student&course=' + c.id + '">Create an account to enroll</a>'
        : '<button class="btn btn-primary btn-lg" type="button" data-checkout="' + c.id + '">Enroll</button>') + '</div>';
  }
  function checkoutHTML(c) {
    return '<div class="checkout"><span class="kicker">Enroll</span><h3 class="card-title">' + c.title + ' with ' + TUTORS[c.tutor].name + '</h3>' +
      '<div class="line"><span>' + (c.per === 'month' ? 'Monthly price' : 'Course price') + '</span><span>' + money(c.price) + '</span></div>' +
      '<div class="line"><span>Access</span><span>' + (c.per === 'month' ? 'Renews monthly' : 'Until the exam') + '</span></div>' +
      '<div class="line total"><span>Due today</span><span>' + money(c.price) + '</span></div>' +
      '<button class="btn btn-primary btn-lg" type="button" data-pay>Continue to payment</button>' +
      '<button class="btn btn-quiet" type="button" data-back>Back to the course</button></div>';
  }
  function openCourse(id) {
    var c = COURSES.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    lastFocus = document.activeElement;
    drawer.innerHTML = drawerHTML(c);
    document.body.classList.add('drawer-open');
    try { history.replaceState(null, '', '#c-' + id); } catch (e) {}
    setTimeout(function () { var x = drawer.querySelector('[data-close]'); if (x) x.focus({ preventScroll: true }); }, 50);
  }
  function closeCourse() {
    document.body.classList.remove('drawer-open');
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  var toastEl, toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 3200);
  }

  // ---------- small shared behaviours ----------
  function placePill(seg) {
    var pill = seg.querySelector('.seg-pill'), on = seg.querySelector('button[aria-pressed="true"]');
    if (!pill || !on) return;
    pill.style.width = on.offsetWidth + 'px';
    pill.style.translate = on.offsetLeft + 'px 0';
  }
  function initSegs(root) {
    (root || document).querySelectorAll('.seg').forEach(function (seg) {
      if (!seg.querySelector('.seg-pill')) { var p = document.createElement('span'); p.className = 'seg-pill'; p.setAttribute('aria-hidden', 'true'); seg.prepend(p); }
      placePill(seg);
    });
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
  function setChrome(mode) {
    document.body.dataset.chrome = mode;
    try { localStorage.setItem('klaro.market.chrome', mode); } catch (e) {}
    document.querySelectorAll('.chromeswitch button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === mode)); });
    document.dispatchEvent(new CustomEvent('chrome', { detail: mode }));
    setTimeout(function () { document.querySelectorAll('.seg').forEach(placePill); }, 0);
  }

  window.KM = { APP: APP, still: still, COURSES: COURSES, TUTORS: TUTORS, LESSONS: LESSONS, money: money, priceHTML: priceHTML, avatar: avatar, card: card, openCourse: openCourse, toast: toast, flip: flip, initSegs: initSegs, placePill: placePill, ICON: ICON, chrome: chrome };

  // ---------- boot ----------
  document.body.dataset.chrome = 'public';
  document.body.insertAdjacentHTML('afterbegin', chromeHTML());
  document.body.insertAdjacentHTML('beforeend', footerHTML() +
    '<div class="scrim-bg" data-close></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"></aside><div class="toast" role="status"></div>');
  drawer = document.querySelector('.drawer'); toastEl = document.querySelector('.toast');

  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-course]');
    if (open && !e.target.closest('[data-stop]')) { e.preventDefault(); openCourse(open.dataset.course); return; }
    if (e.target.closest('[data-close]')) { closeCourse(); return; }
    var co = e.target.closest('[data-checkout]');
    if (co) { var c = COURSES.filter(function (x) { return x.id === co.dataset.checkout; })[0]; document.getElementById('drawer-body').innerHTML = checkoutHTML(c); drawer.querySelector('.buy').hidden = true; return; }
    if (e.target.closest('[data-back]')) { openCourse(location.hash.slice(3)); return; }
    if (e.target.closest('[data-pay]')) { toast('Payment comes next. It is not built yet; this is where it starts.'); return; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) closeCourse(); });

  document.addEventListener('DOMContentLoaded', function () {
    initSegs();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { document.querySelectorAll('.seg').forEach(placePill); });
    window.addEventListener('resize', function () { document.querySelectorAll('.seg').forEach(placePill); });
    var bar = function () { document.querySelectorAll('.topbar').forEach(function (t) { t.classList.toggle('scrolled', window.scrollY > 8); }); };
    window.addEventListener('scroll', bar, { passive: true }); bar();
    if (!still && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); });
      document.querySelectorAll('.reveal').forEach(function (el) { if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el); });
    }
    if (location.hash.indexOf('#c-') === 0) openCourse(location.hash.slice(3));
  });
})();
