/* Klaro site behaviour, on every page after klaro.js (which sets the app links, the header's
   hairline on scroll and the FAQ). No libraries. Each part is independent and does nothing on a
   page without its markup:
     1. Links into the app for a fixed audience (data-signup-as, body[data-default-as="tutor"])
     2. The header: Products menu, the phone menu sheet, the join code, the floating bar
     3. Carousels (.carousel): arrows, keys, swipe, right to left
     4. Sticky step lists (.steps-sticky): the pinned titles beside the recordings
     5. The opening's scroll fallback (.opening) where CSS scroll-driven animations are missing
     6. Illustrations and scene plates: a plate's drawn device (img/plates/<data-plate>.webp)
        is loaded here, only once site.css opts it in, and takes over from the CSS frame;
        ?ph shows the placeholders' file names
     7. Scroll reveal, calm and once
   The showcase (live app frames and recordings) is showcase.js; this file never touches it. */
(function () {
  'use strict';
  var root = document.documentElement;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var meta = document.querySelector('meta[name="klaro-app"]');
  var APP = (meta && meta.content) || 'https://app.klaroplatform.com';
  var AR = root.lang === 'ar';
  var LANG = AR ? '&lang=ar' : '';
  root.classList.add('js');

  function rtlOf(el) { return getComputedStyle(el).direction === 'rtl'; }
  function focusables(box) {
    return Array.prototype.filter.call(box.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.getClientRects().length && !el.closest('[hidden]'); });
  }

  /* ---------------------------------------------------------------- 1. Fixed-audience sign-up */
  // Links that always go to one audience's sign-up (tools/site.py writes the same addresses into
  // the HTML, so they work without JavaScript; this adds lang=ar on Arabic pages).
  document.querySelectorAll('[data-signup-as]').forEach(function (a) { a.href = APP + '/sign-up?as=' + a.dataset.signupAs + LANG; });
  // Tutor pages (body data-default-as="tutor"): every plain sign-up link is the tutor's.
  if (document.body.dataset.defaultAs === 'tutor') {
    document.querySelectorAll('[data-signup]').forEach(function (a) { a.href = APP + '/sign-up?as=tutor' + LANG; });
  }

  /* ---------------------------------------------------------------- 2. Header */
  var sheetQuery = window.matchMedia('(max-width: 1024px)');
  var headers = Array.prototype.map.call(document.querySelectorAll('[data-topbar]'), initHeader).filter(Boolean);
  // A join-code button outside a header (the footer's) opens the first header's menu at the field.
  document.querySelectorAll('[data-joincode-open]').forEach(function (b) {
    if (b.closest('[data-topbar]') || !headers[0]) return;
    b.addEventListener('click', function (e) { e.stopPropagation(); headers[0].openCode(b); });
  });

  function initHeader(header) {
    var panel = header.querySelector('.mega');
    if (!panel) return null;
    var openers = Array.prototype.slice.call(header.querySelectorAll('[data-menu]'));
    var drill = panel.querySelector('[data-drill]');
    var back = panel.querySelector('[data-drill-back]');
    var codeBtn = panel.querySelector('[data-joincode]');
    var codeForm = panel.querySelector('[data-joinform]');
    var open = false, opener = null, timer = 0, closer = null;

    function isSheet() { return sheetQuery.matches; }
    function setView(view) {
      panel.dataset.view = view;
      if (drill) drill.setAttribute('aria-expanded', String(view === 'products'));
    }
    function resetCode() { if (codeBtn && codeForm) { codeBtn.hidden = false; codeForm.hidden = true; } }
    function set(state, from) {
      open = state;
      if (from) opener = from;
      openers.forEach(function (b) { b.setAttribute('aria-expanded', String(state)); });
      clearTimeout(timer);
      if (closer) { panel.removeEventListener('animationend', closer); closer = null; }
      panel.classList.remove('is-closing');
      root.classList.toggle('menu-open', state && isSheet());
      if (state) {
        setView('main');
        panel.hidden = false;
        if (isSheet()) { var first = focusables(panel)[0]; if (first) first.focus(); }
        return;
      }
      if (panel.hidden) return;
      var done = function () {
        clearTimeout(timer);
        if (closer) { panel.removeEventListener('animationend', closer); closer = null; }
        panel.hidden = true; panel.classList.remove('is-closing'); resetCode();
      };
      if (still) { done(); return; }
      // Hidden once its closing fade (site.css: k-out, --dur-fast) has run; the timer is a safety net.
      closer = function (e) { if (e.target === panel && e.animationName === 'k-out') done(); };
      panel.addEventListener('animationend', closer);
      panel.classList.add('is-closing');
      timer = setTimeout(done, 500);
    }
    function back2opener() {
      var b = opener && opener.getClientRects().length ? opener : null;
      openers.forEach(function (x) { if (!b && x.getClientRects().length) b = x; });
      if (b) b.focus();
    }

    openers.forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); set(!open, b); });
    });
    document.addEventListener('click', function (e) {
      if (open && !panel.contains(e.target) && !openers.some(function (b) { return b.contains(e.target); })) set(false);
    });
    header.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { set(false); back2opener(); return; }
      if (e.key !== 'Tab') return;
      var items = focusables(panel);
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1], at = document.activeElement;
      if (isSheet()) {
        // The sheet covers the page: Tab stays between the menu button and the sheet.
        var btn = header.querySelector('[data-menu="sheet"]');
        if (!e.shiftKey && at === last) { e.preventDefault(); btn.focus(); }
        else if (e.shiftKey && at === btn) { e.preventDefault(); last.focus(); }
        else if (e.shiftKey && at === first) { e.preventDefault(); btn.focus(); }
        return;
      }
      // Desktop: the panel follows the Products button in the tab order, then the rest of the bar.
      var trigger = header.querySelector('[data-menu="products"]');
      if (!e.shiftKey && at === trigger) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && at === first) { e.preventDefault(); trigger.focus(); }
      else if (!e.shiftKey && at === last) {
        var bar = focusables(header.querySelector('.topbar-row'));
        var next = bar[bar.indexOf(trigger) + 1];
        set(false);
        if (next) { e.preventDefault(); next.focus(); }
      }
    });
    sheetQuery.addEventListener('change', function () { if (open) set(false); });
    // A link to somewhere on this same page closes the menu.
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { if (a.hash && a.pathname === location.pathname) set(false); });
    });

    if (drill && back) {
      drill.addEventListener('click', function () { setView('products'); back.focus(); });
      back.addEventListener('click', function () { setView('main'); drill.focus(); });
    }

    // "Have a join code?" turns into the code field, like SchoolAI's "Space code".
    function showCode() {
      if (!codeBtn || !codeForm) return;
      codeBtn.hidden = true;
      codeForm.hidden = false;
      codeForm.code.focus();
    }
    if (codeBtn) codeBtn.addEventListener('click', showCode);
    function openCode(from) {
      set(true, from);
      if (isSheet() && codeForm) panel.scrollTop = panel.scrollHeight;
      showCode();
    }
    header.querySelectorAll('[data-joincode-open]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); openCode(b); });
    });
    if (codeForm) codeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = codeForm.code.value.trim().toUpperCase();
      if (!code) { codeForm.code.focus(); return; }
      // The app's join link: /join?code=… lets the student in once they sign in or sign up.
      window.location.href = APP + '/join?code=' + encodeURIComponent(code) + LANG;
    });

    // The floating bar (header.topbar--float): an inset pill after 120px of scroll.
    if (header.classList.contains('topbar--float')) {
      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { ticking = false; header.classList.toggle('is-float', window.scrollY > 120); });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    return { openCode: openCode };
  }

  /* ---------------------------------------------------------------- 3. Carousels */
  // <section class="carousel"> … <div class="carousel-nav" hidden><button class="carousel-btn" data-prev>…
  // <button class="carousel-btn" data-next>…</div> … <ul class="carousel-track"><li class="carousel-item">…
  document.querySelectorAll('.carousel').forEach(function (box) {
    var track = box.querySelector('.carousel-track');
    var prev = box.querySelector('[data-prev]');
    var next = box.querySelector('[data-next]');
    if (!track) return;
    var nav = box.querySelector('.carousel-nav');
    if (nav) nav.hidden = false;
    if (!track.id) track.id = 'carousel-' + Math.random().toString(36).slice(2, 8);
    [prev, next].forEach(function (b) { if (b) b.setAttribute('aria-controls', track.id); });

    function items() { return Array.prototype.slice.call(track.querySelectorAll('.carousel-item')); }
    function stepSize() {
      var first = items()[0];
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    }
    // Arrows step one card from where the last step was headed, so quick clicks add up.
    var target = null, settle = 0;
    function go(dir) {
      var step = stepSize(), max = track.scrollWidth - track.clientWidth;
      var from = target !== null ? target : Math.abs(track.scrollLeft);
      target = Math.max(0, Math.min(max, Math.round(from / step) * step + dir * step));
      // Positive scrollLeft runs towards the inline end in LTR; in RTL it is negative.
      track.scrollTo({ left: target * (rtlOf(track) ? -1 : 1), behavior: still ? 'auto' : 'smooth' });
    }
    track.addEventListener('scroll', function () { clearTimeout(settle); settle = setTimeout(function () { target = null; }, 160); }, { passive: true });
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var x = Math.abs(track.scrollLeft);
      if (prev) prev.setAttribute('aria-disabled', String(x <= 2));
      if (next) next.setAttribute('aria-disabled', String(x >= max - 2));
    }
    if (prev) prev.addEventListener('click', function () { if (prev.getAttribute('aria-disabled') !== 'true') go(-1); });
    if (next) next.addEventListener('click', function () { if (next.getAttribute('aria-disabled') !== 'true') go(1); });
    var raf = 0;
    track.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; update(); }); }, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Arrow keys move between cards (the card is the link inside each item); Home and End jump.
    track.addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) < 0) return;
      var links = items().map(function (li) { return focusables(li)[0]; }).filter(Boolean);
      var i = links.indexOf(document.activeElement);
      if (i < 0) return;
      var j = e.key === 'Home' ? 0 : e.key === 'End' ? links.length - 1
        : i + ((e.key === 'ArrowRight') !== rtlOf(track) ? 1 : -1);
      j = Math.max(0, Math.min(links.length - 1, j));
      e.preventDefault();
      links[j].focus({ preventScroll: true });
      links[j].closest('.carousel-item').scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
    });
  });

  /* ---------------------------------------------------------------- 4. Sticky step lists */
  // Desktop with motion: the panels' titles become an accordion pinned on the inline start; the
  // panel crossing the middle of the screen is the open one, and its bar fills as its recording
  // plays. The panels' own copy is hidden there by CSS (.has-nav). Playing the recordings is the
  // showcase driver's job; this only listens to their time.
  if (!still && 'IntersectionObserver' in window) document.querySelectorAll('.steps-sticky').forEach(function (box, n) {
    var panels = Array.prototype.slice.call(box.querySelectorAll('.steps-panel'));
    if (panels.length < 2) return;
    var nav = document.createElement('ol');
    nav.className = 'steps-nav';
    var label = box.getAttribute('aria-label');
    if (label) nav.setAttribute('aria-label', label);
    var entries = panels.map(function (panel, i) {
      if (!panel.id) panel.id = 'steps-' + (n + 1) + '-' + (i + 1);
      var copy = panel.querySelector('.steps-copy');
      var title = copy && copy.querySelector('h2, h3, h4');
      if (!title) return null;
      var li = document.createElement('li');
      li.className = 'steps-nav-item';
      var h = document.createElement('h3');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'steps-nav-title';
      btn.textContent = title.textContent.trim();
      btn.setAttribute('aria-controls', panel.id + '-nav');
      h.appendChild(btn);
      var body = document.createElement('div');
      body.className = 'steps-nav-body';
      body.id = panel.id + '-nav';
      var inner = document.createElement('div');
      Array.prototype.forEach.call(copy.children, function (c) { if (c !== title) inner.appendChild(c.cloneNode(true)); });
      body.appendChild(inner);
      var bar = document.createElement('span');
      bar.className = 'steps-nav-bar';
      bar.setAttribute('aria-hidden', 'true');
      var fill = document.createElement('i');
      bar.appendChild(fill);
      li.appendChild(h); li.appendChild(body); li.appendChild(bar);
      btn.addEventListener('click', function () {
        activate(i);
        var media = panel.querySelector('.rec, .show, figure') || panel;
        media.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
      });
      // Media events don't bubble, but they do pass the capture phase.
      panel.addEventListener('timeupdate', function (e) {
        var v = e.target;
        if (v.duration) fill.style.setProperty('--p', Math.min(1, v.currentTime / v.duration).toFixed(3));
      }, true);
      return { li: li, btn: btn, fill: fill };
    });
    if (entries.some(function (x) { return !x; })) return;
    entries.forEach(function (x) { nav.appendChild(x.li); });
    box.insertBefore(nav, box.firstChild);
    box.classList.add('has-nav');

    var current = -1;
    function activate(i) {
      if (i === current) return;
      current = i;
      entries.forEach(function (x, k) {
        x.li.classList.toggle('is-active', k === i);
        x.btn.setAttribute('aria-expanded', String(k === i));
      });
    }
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) { if (en.isIntersecting) activate(panels.indexOf(en.target)); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    panels.forEach(function (p) { io.observe(p); });
    activate(0);
  });

  /* ---------------------------------------------------------------- 5. The opening, without scroll-driven CSS */
  // Where animation-timeline is missing (Safari before 26, Firefox), the opening's motion follows
  // --od: how far the opening's top has scrolled past the top of the screen, in vh. One rect read
  // and one custom property write per frame, only while the opening is on screen.
  var supportsScrollCSS = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (!still && !supportsScrollCSS && 'IntersectionObserver' in window) document.querySelectorAll('.opening').forEach(function (el) {
    root.classList.add('k-sd-js');
    var raf = 0;
    function update() {
      raf = 0;
      var top = el.getBoundingClientRect().top;
      el.style.setProperty('--od', Math.max(0, -top / (window.innerHeight / 100)).toFixed(2));
    }
    function request() { if (!raf) raf = requestAnimationFrame(update); }
    new IntersectionObserver(function (list) {
      if (list[0].isIntersecting) { window.addEventListener('scroll', request, { passive: true }); request(); }
      else window.removeEventListener('scroll', request);
    }).observe(el);
    window.addEventListener('resize', request);
    update();
  });

  /* ---------------------------------------------------------------- 6. Illustrations and scene plates */
  // ?ph in the address shows each placeholder's file name (data-ph) on tiles and plates, for us
  // while pictures are being made (site.css, html.ph-on). Visitors never see them.
  if (/[?&]ph(?:[=&]|$)/.test(location.search)) root.classList.add('ph-on');
  // A tile or plate whose image is missing (404) keeps its plain field instead of a broken image.
  function missing(img) {
    var box = img.closest('.ill, .plate');
    if (box) box.classList.add('is-missing');
  }
  // A scene plate with a drawn device (.plate--device[data-plate="P4-marked-papers"]) loads its
  // picture, img/plates/<name>.webp, here, so the HTML never links a plate that isn't drawn yet
  // (tools/site.py fails on missing files). Only plates opted in with --drawn: 1 in their site.css
  // box rule are loaded: the opt-in sits next to the measured box, so a picture dropped into
  // img/plates/ changes nothing until its box is measured, and no page asks for a missing file.
  // Once loaded, .is-drawn hides the CSS device frame and the real app sits on the drawn screen;
  // until then, if the file is missing, or without JavaScript, the CSS frame stays in the same box.
  var ROOT = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '') || '/';
  document.querySelectorAll('.plate--device[data-plate]').forEach(function (plate) {
    if (plate.querySelector('.plate-img')) return;
    if (getComputedStyle(plate).getPropertyValue('--drawn').trim() !== '1') return;
    var img = document.createElement('img');
    img.className = 'plate-img';
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.src = ROOT + 'img/plates/' + plate.dataset.plate + '.webp';
    plate.insertBefore(img, plate.firstChild);
  });
  function drawn(img) {
    var plate = img.closest('.plate--device');
    if (plate) plate.classList.add('is-drawn');
  }
  document.querySelectorAll('.ill > img, .ill > picture > img, .plate-img, .plate > picture > img').forEach(function (img) {
    if (img.complete && img.currentSrc && img.naturalWidth === 0) missing(img);
    else if (img.complete && img.naturalWidth) drawn(img);
    else {
      img.addEventListener('error', function () { missing(img); }, { once: true });
      img.addEventListener('load', function () { drawn(img); }, { once: true });
    }
  });

  /* ---------------------------------------------------------------- 7. Scroll reveal */
  // Section heads and cards rise into place once. Only what starts below the first screen is
  // hidden, and it shows as soon as any part of it is on screen, so nothing visible ever waits.
  // Nothing at all with reduced motion, without IntersectionObserver, or in print.
  if (still || !('IntersectionObserver' in window)) return;
  var REVEAL = '.section-head, .strip, .icard-grid > *, .split-card, .band, .rcard, .panel, .faq, .closing-copy, [data-reveal]';
  var fold = window.innerHeight;
  var io = new IntersectionObserver(function (list) {
    var seen = [];
    list.filter(function (en) { return en.isIntersecting; }).forEach(function (en) {
      var el = en.target, n = 0;
      seen.forEach(function (p) { if (p === el.parentNode) n++; });
      seen.push(el.parentNode);
      el.style.setProperty('--k-d', (Math.min(n, 4) * 0.06).toFixed(2) + 's');
      el.classList.add('k-in');
      io.unobserve(el);
    });
  });
  document.querySelectorAll(REVEAL).forEach(function (el) {
    if (el.closest('.k-rv, .carousel-track, .opening') || el.getBoundingClientRect().top <= fold) return;
    el.classList.add('k-rv');
    io.observe(el);
  });
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('.k-rv:not(.k-in)').forEach(function (el) { el.classList.add('k-in'); });
  });
  root.classList.add('motion');
})();
