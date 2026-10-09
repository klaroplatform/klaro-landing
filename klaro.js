/* Klaro landing, on every page before site.js: the links into the app (sign up, sign in, terms and
   privacy), the header's hairline on scroll (.topbar.scrolled) and the FAQ (one answer open at a
   time). The app's address is the <meta name="klaro-app"> that tools/site.py writes into each
   page, so moving it is one line in tools/site.json.
   Kept for the frozen old landing (v1/), whose markup only it has: the Student/Tutor switch
   (.seg[data-audience], #tutor in the address, the sliding .seg-pill) and the .reveal scroll
   reveal. On the new pages the switch's only effect is that plain [data-signup] links get
   ?as=student (?as=tutor with #tutor); site.js then gives tutor pages the tutor's sign-up, and
   does the new pages' scroll reveal. */
(function () {
  var meta = document.querySelector('meta[name="klaro-app"]');
  var APP = (meta && meta.content) || 'https://app.klaroplatform.com';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The Arabic page opens the app in Arabic (the app reads ?lang= as the reader's choice).
  var LANG = document.documentElement.lang === 'ar' ? 'lang=ar' : '';
  function appLink(path, query) { var q = [query, LANG].filter(Boolean).join('&'); return APP + path + (q ? '?' + q : ''); }

  function placePill(seg) {
    var pill = seg.querySelector('.seg-pill');
    var on = seg.querySelector('button[aria-pressed="true"]');
    if (!pill || !on) return;
    pill.style.width = on.offsetWidth + 'px';
    pill.style.translate = on.offsetLeft + 'px 0';
  }

  function setAudience(as, fromUser) {
    if (as !== 'tutor') as = 'student';
    document.body.dataset.as = as;
    document.querySelectorAll('.seg[data-audience] button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.value === as));
    });
    document.querySelectorAll('.seg[data-audience]').forEach(placePill);
    document.querySelectorAll('[data-signup]').forEach(function (a) { a.href = appLink('/sign-up', 'as=' + as); });
    // The language link keeps the audience, so a tutor reading in English stays a tutor in Arabic.
    document.querySelectorAll('[data-lang-link]').forEach(function (a) { a.hash = as === 'tutor' ? 'tutor' : ''; });
    if (fromUser) {
      try { history.replaceState(null, '', as === 'tutor' ? '#tutor' : location.pathname); } catch (e) {}
    }
  }

  document.querySelectorAll('[data-signin]').forEach(function (a) { a.href = appLink('/sign-in'); });
  document.querySelectorAll('[data-legal]').forEach(function (a) { a.href = appLink('/' + a.dataset.legal); });

  document.querySelectorAll('.seg').forEach(function (seg) {
    var pill = document.createElement('span');
    pill.className = 'seg-pill';
    pill.setAttribute('aria-hidden', 'true');
    seg.prepend(pill);
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) setAudience(b.dataset.value, true);
    });
  });
  setAudience(location.hash === '#tutor' ? 'tutor' : 'student', false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { document.querySelectorAll('.seg').forEach(placePill); });
  window.addEventListener('resize', function () { document.querySelectorAll('.seg').forEach(placePill); });

  var bar = document.querySelector('.topbar');
  if (bar) {
    var onScroll = function () { bar.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Reveal: everything is visible at rest; the rise plays only for what starts below the first screen.
  if (!still && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    });
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el);
    });
  }

  // FAQ: one answer open at a time; its height animates.
  var faq = document.querySelectorAll('.faq-item button');
  faq.forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') !== 'true';
      faq.forEach(function (x) { x.setAttribute('aria-expanded', 'false'); x.nextElementSibling.classList.remove('open'); });
      b.setAttribute('aria-expanded', String(open));
      b.nextElementSibling.classList.toggle('open', open);
    });
  });
})();
