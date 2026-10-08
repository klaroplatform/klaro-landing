/* Frame only: one header, one footer and one icon sprite for every frame page.
   Each page puts <div data-chrome="header"></div> and <div data-chrome="footer"></div> in the body
   and says where it sits: <body data-frame="../../" data-site="../../../../">
   data-frame is the path to design/frame/, data-site the path to the site root (klaro.css, img/).
   Load order at the end of the body: chrome.js, then ../klaro.js, then frame.js. */
(function () {
  var F = document.body.dataset.frame || '';
  var S = document.body.dataset.site || '../../';
  var P = F + 'products/';

  var STUDENTS = [
    ['study-view', 'i-study', '', 'Study view', 'The lecture, the book page and the questions, side by side'],
    ['practice-questions', 'i-check', 'amber', 'Practice questions', 'Real past-paper questions, marked the moment you answer'],
    ['progress', 'i-chart', 'teal', 'Progress', 'Lectures finished, quiz marks and your streak'],
    ['klaro-market', 'i-market', '', 'Klaro Market', 'Find a course and the tutor who teaches it']
  ];
  var TUTORS = [
    ['course-builder', 'i-upload', '', 'Course builder', 'Upload your lectures, books and past papers. Set the order.'],
    ['study-view', 'i-study', 'teal', 'Study view', 'See your course the way your students see it'],
    ['live-sessions', 'i-live', 'teal', 'Live sessions', 'Teach your students live, straight from your Klaro course'],
    ['marking', 'i-pen', 'amber', 'Marking', 'Review papers against the mark scheme and release results']
  ];
  function item(p) {
    return '<a class="mega-item" href="' + P + p[0] + '/"><span class="icon-tile ' + p[2] + '"><svg class="i" width="18" height="18"><use href="#' + p[1] + '"/></svg></span>' +
      '<span><b>' + p[3] + '</b><small>' + p[4] + '</small></span></a>';
  }
  function link(p) { return '<li><a href="' + P + p[0] + '/">' + p[3] + '</a></li>'; }

  var SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<path id="spark" d="M215.67 51.56C203.93 55.66 189.46 58.46 180.24 67.68C171.02 76.9 168.22 91.37 164.12 103.11C160.02 91.37 157.21 76.9 147.99 67.68C138.77 58.46 124.3 55.66 112.56 51.56C124.3 47.46 138.77 44.65 147.99 35.43C157.21 26.21 160.02 11.74 164.12 0C168.22 11.74 171.02 26.21 180.24 35.43C189.46 44.65 203.93 47.46 215.67 51.56Z"/>' +
    sym('i-study', '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9.5 4v16M15 4v16"/>') +
    sym('i-check', '<path d="M20 6 9 17l-5-5"/>', 2) +
    sym('i-chart', '<path d="M3 20h18M7 16v-5M12 16V7M17 16v-8"/>') +
    sym('i-market', '<path d="M3 9l1.5-5h15L21 9M3 9h18v11H3zM9 20v-6h6v6"/>') +
    sym('i-upload', '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>') +
    sym('i-pen', '<path d="M4 20h4L19 9l-4-4L4 16z"/>') +
    sym('i-video', '<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>') +
    sym('i-book', '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2.5z"/>') +
    sym('i-doc', '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>') +
    sym('i-link', '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>') +
    sym('i-down', '<path d="m6 9 6 6 6-6"/>', 2) +
    sym('i-arrow', '<path d="M5 12h14M13 6l6 6-6 6"/>', 2) +
    sym('i-back', '<path d="M19 12H5M11 18l-6-6 6-6"/>', 2) +
    sym('i-menu', '<path d="M4 7h16M4 12h16M4 17h16"/>', 2) +
    sym('i-code', '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M7.5 12h.01M12 12h.01M16.5 12h.01"/>') +
    sym('i-info', '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>') +
    sym('i-users', '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>') +
    sym('i-search', '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>') +
    sym('i-flame', '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.7 2.2-4.8.3 1.6 1.1 2.6 2.3 3.1C11 9 11 6 12 3z"/>') +
    sym('i-send', '<path d="M4 12 20 4l-6 16-3-7z"/>') +
    sym('i-clock', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>') +
    sym('i-live', '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19.1 4.9a10 10 0 0 1 0 14.2M4.9 19.1a10 10 0 0 1 0-14.2"/>') +
    sym('i-calendar', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>') +
    sym('i-grip', '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>', 2.6) +
    '</defs></svg>';
  function sym(id, paths, w) {
    return '<symbol id="' + id + '" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">' + paths + '</g></symbol>';
  }

  var HEADER =
    '<header class="topbar">' +
    '<div class="wrap">' +
      '<a class="brand" href="' + F + 'index.html" aria-label="Klaro home"><img src="' + S + 'img/klaro-wordmark.svg" alt="Klaro" width="100" height="30"></a>' +
      '<nav class="nav" aria-label="Main">' +
        '<button class="nav-btn" type="button" aria-expanded="false" aria-controls="products-menu" data-menu>Products <svg class="i chev" width="14" height="14"><use href="#i-down"/></svg></button>' +
        '<a class="nav-btn" href="' + F + 'index.html#research">Research</a>' +
        '<a class="nav-btn" href="' + F + 'index.html#try">Try it</a>' +
      '</nav>' +
      '<span class="spacer"></span>' +
      '<button class="btn btn-secondary hide-sm" type="button" data-joincode-open><svg class="i" width="16" height="16"><use href="#i-code"/></svg>Join code</button>' +
      '<a class="btn btn-quiet" href="#" lang="ar">عربي</a>' +
      '<a class="btn btn-quiet hide-sm" data-signin href="#">Sign in</a>' +
      '<a class="btn btn-glass" data-signup href="#">Get started</a>' +
      '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="products-menu" aria-label="Menu" data-menu><svg class="i" width="18" height="18"><use href="#i-menu"/></svg></button>' +
    '</div>' +
    '<div class="mega-wrap"><div class="mega" id="products-menu" hidden>' +
      '<div class="mega-cols">' +
        '<div class="mega-col"><p class="mega-head">For students</p>' + STUDENTS.map(item).join('') + '</div>' +
        '<div class="mega-col"><p class="mega-head">For tutors</p>' + TUTORS.map(item).join('') + '</div>' +
      '</div>' +
      '<div class="mega-links">' +
        '<a class="nav-btn" href="' + F + 'index.html#research">Research</a>' +
        '<a class="nav-btn" href="' + F + 'index.html#try">Try it</a>' +
        '<a class="nav-btn" data-signin href="#">Sign in</a>' +
      '</div>' +
      '<div class="mega-foot">' +
        '<button class="btn-code" type="button" data-joincode><svg class="i" width="18" height="18"><use href="#i-code"/></svg>Have a join code?</button>' +
        '<form class="joinform" data-joinform hidden><input name="code" placeholder="K7Q-2PX" aria-label="Join code" autocomplete="off" maxlength="9"><button class="btn btn-primary" type="submit">Join</button></form>' +
        '<a class="btn btn-primary btn-lg" data-signup href="#">Get started</a>' +
      '</div>' +
    '</div></div>' +
    '</header>';

  var FOOTER =
    '<footer class="foot2"><div class="wrap">' +
      '<div class="brandcol">' +
        '<img src="' + S + 'img/klaro-wordmark.svg" alt="Klaro" width="93" height="28">' +
        '<p class="foot-motto">Enough AI slop.</p>' +
        '<p class="small">We connect your content exactly how you intended it to look.</p>' +
      '</div>' +
      '<div><h4>For students</h4><ul>' + STUDENTS.map(link).join('') + '</ul></div>' +
      '<div><h4>For tutors</h4><ul>' + TUTORS.map(link).join('') + '<li><a data-signup-as="tutor" href="#">Apply as a tutor</a></li></ul></div>' +
      '<div><h4>Klaro</h4><ul>' +
        '<li><a href="' + F + 'index.html#research">Research</a></li>' +
        '<li><a href="' + F + 'index.html#try">Try it</a></li>' +
        '<li><a href="' + S + 'market/">Browse courses</a></li>' +
        '<li><a data-signin href="#">Sign in</a></li>' +
        '<li><a href="#" lang="ar">عربي</a></li>' +
      '</ul></div>' +
      '<div class="base"><span>© 2026 Klaro</span><span class="grow"></span><a data-legal="terms" href="#">Terms</a><a data-legal="privacy" href="#">Privacy</a></div>' +
    '</div></footer>';

  document.body.insertAdjacentHTML('afterbegin', SPRITE);
  var h = document.querySelector('[data-chrome="header"]');
  var f = document.querySelector('[data-chrome="footer"]');
  if (h) h.outerHTML = HEADER;
  if (f) f.outerHTML = FOOTER;
})();
