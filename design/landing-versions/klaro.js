/* Shared behaviour for the four landing versions: the Student/Tutor switch, the sign-up links,
   the sliding segment pill, scroll reveal, the top bar's hairline and the version switcher. */
(function () {
  var APP = 'https://klaro-web-staging.klaroplatform.workers.dev';
  var root = document.documentElement;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.KLARO = { APP: APP, still: still };

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
    document.querySelectorAll('[data-signup]').forEach(function (a) {
      a.href = APP + '/sign-up?as=' + as;
    });
    if (fromUser) {
      try { history.replaceState(null, '', as === 'tutor' ? '#tutor' : location.pathname); } catch (e) {}
    }
    document.dispatchEvent(new CustomEvent('audience', { detail: as }));
  }
  window.KLARO.setAudience = setAudience;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-signin]').forEach(function (a) { a.href = APP + '/sign-in'; });
    document.querySelectorAll('[data-legal]').forEach(function (a) { a.href = APP + '/' + a.dataset.legal; });

    document.querySelectorAll('.seg').forEach(function (seg) {
      if (!seg.querySelector('.seg-pill')) {
        var pill = document.createElement('span');
        pill.className = 'seg-pill';
        pill.setAttribute('aria-hidden', 'true');
        seg.prepend(pill);
      }
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        if (seg.hasAttribute('data-audience')) setAudience(b.dataset.value, true);
        else {
          seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          placePill(seg);
        }
      });
    });

    setAudience(location.hash === '#tutor' ? 'tutor' : 'student', false);
    // Settle the pill once fonts have their real widths, and on resize.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { document.querySelectorAll('.seg').forEach(placePill); });
    window.addEventListener('resize', function () { document.querySelectorAll('.seg').forEach(placePill); });

    var bar = document.querySelector('.topbar');
    if (bar) {
      var onScroll = function () { bar.classList.toggle('scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Reveal: elements are visible at rest; the rise plays only for ones below the first screen.
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

    // Review aid: jump between the four versions.
    var here = (location.pathname.split('/').pop() || 'index.html');
    var nav = document.createElement('nav');
    nav.className = 'vswitch';
    nav.setAttribute('aria-label', 'Landing versions');
    [['v1.html', 'V1'], ['v2.html', 'V2'], ['v3.html', 'V3'], ['v4.html', 'V4']].forEach(function (v) {
      var a = document.createElement('a');
      a.href = v[0];
      a.textContent = v[1];
      if (here === v[0] || (here === 'index.html' && v[0] === 'v1.html' && document.body.dataset.version === '1')) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
  });
})();
