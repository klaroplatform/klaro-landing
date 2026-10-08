/*
  showcase.js: the real Klaro app on the landing pages, and its recordings.

  One driver for every page. It replaces Omar's hero.js, examples.js and students/*.js. The words
  live in the HTML, so search engines, assistants and visitors without JavaScript can read them.
  The script moves things and marks state; site.css does the styling. This file only sets
  classes, data attributes, CSS custom properties, and the inline geometry the camera needs.

  The protocol with the showcase build (/showcase/, the app on sample data) is in
  design/brief/showcase.md §2. The page plans are in design/brief/redesign.md §7.6–7.9.

  ── 1. A live scene (one per page at most) ─────────────────────────────────────────────────

    <figure class="show" data-showcase="study" data-phone-recording="study-hero">
      <div class="show-screen" data-screen data-nosnippet>
        <img src="img/showcase/study.webp" alt="…" width="1440" height="900" fetchpriority="high">
      </div>
      <figcaption>Sample course. …</figcaption>
      <ol class="show-steps" data-steps>
        <li>A student taps a passage in your book.</li>
        <li>Your lecture jumps to that moment and explains exactly that passage.</li>
        <li>The question on that passage is right there.</li>
        <li>Your turn. Tap any part of the book.</li>
      </ol>
      <p class="show-tapped" data-after-tap hidden>Every page links to the moment you explained it.</p>
      <div class="show-actions" data-actions>
        <a class="show-try" href="try/">Try it full screen</a>
        <button type="button" data-action="replay" hidden>Replay</button>
      </div>
    </figure>

    data-showcase   The scene (showcase.md §3): study, student-study, student-practice, lives, quiz,
                    marking, student-minis, student-tutor. A name starting with student- runs as
                    the sample student.
    data-play       "story" (the default when the scene has one; study and student-study do): the
                    camera story, then the visitor's turn. "steps": each <li> is a step of the
                    scene (<li data-step="n"> picks one), and there is no camera. "free": the
                    visitor's turn at once; on a scene with a story, Replay (or a step) plays the
                    whole story on the clock and hands over again. The visitor's turn only
                    exists on study, student-study and student-practice; elsewhere the frame stays
                    read-only.
    data-story      A story by name (default: the scene's own). "none" means no camera.
    data-fit        "fill": the frame fills the screen at its own size, in the app's own layout,
                    with no camera and no story (data-play defaults to "free"), so the app's text
                    is at its real size. On phones and with Save-Data it stays a poster like any
                    scene, unless data-phone="live" (/try/, where phones get the phone layout).
                    The default draws the app at 1440 × 900, scaled to the screen.
    data-phone-recording
                    On phones (< 900px) the page plays this recording instead of loading the live
                    app, stepped like the story: media/<name>.mp4 and media/<name>.json (one cue
                    per <li>). It loads on the visitor's first scroll or tap, not before. The
                    screen's <img> stays the poster until the video has a frame: give phones their
                    own with <picture><source media="(max-width: 899px)" srcset="…">, or set
                    data-phone-poster. Without a phone recording, phones (and big screens with
                    Save-Data) keep the poster and the Try link.
    data-app-width  The width the app is drawn at before it is scaled to the screen (default 1440,
                    at least 1000, where the study view still has its three panes; the height
                    follows at 16:10). A product page's frame uses 1000, so the app's text is
                    about 45% larger on the same screen than at 1440.
    data-title      The frame's title (default "Klaro sample workspace").
    <li data-at>    Where the step starts in the opening's pin, from 0 to 1 (defaults: 0.15, 0.35,
                    0.6, 0.85). The study story's four <li> are the tap, the lecture, the question
                    and the visitor's turn.

  ── 2. A recording ──────────────────────────────────────────────────────────────────────────

    <figure class="rec" id="marking" data-recording="marking">
      <div class="rec-screen" data-screen data-nosnippet>
        <img src="media/marking-poster.webp" alt="…" width="1440" height="900" loading="lazy" decoding="async">
        <video muted playsinline preload="none"
               aria-label="A recording of Klaro on a sample course: the tutor's marking queue"></video>
      </div>
      <ol class="rec-cues" data-steps>
        <li data-t="0">Every paper handed in waits here, one card per paper.</li>
        <li data-t="4.8">Each answer comes back marked…</li>
      </ol>
      <button type="button" data-action="play" hidden>Play</button>
      <button type="button" data-action="replay" hidden>Replay</button>
    </figure>

    The poster is a lazy <img> under a video without poster=: browsers fetch poster= at once,
    wherever the video is, and the <img> also serves visitors without JavaScript.

    data-recording  Plays media/<name>.mp4 (or <video data-src>). Use "ar/marking" for
                    media/ar/marking.mp4.
    <li data-t>     The cue's start, in seconds. Without it, the times come from media/<name>.json,
                    fetched once the video is near.
    data-camera="0 .9 260 300; 4.8 .7 640 420"
                    A camera over the video, keyed to the video's own time and independent of the
                    captions (redesign.md §7.6, §7.9): from each time (seconds) it eases, over
                    0.8 s, to show the point x, y (the recording's own pixels, 1440 × 900 for
                    the desktop recordings) in the middle of the screen at the given scale (screen
                    pixels per recording pixel: .9 shows the app's 14px text at about 13px). A big
                    screen keeps the scale and shows more round the point; a small one shows less.
                    It never zooms out past the whole recording, nor in more than 4×. The poster
                    gets the first view, so it reads before the video plays. A still (a figure
                    with data-camera and an <img>, no recording) gets the first view too; its
                    pixels are the <img>'s width and height.
                    A second number above 8 is a width instead of a scale: "4.8 700 380 700"
                    puts 700 of the recording's pixels across the screen, whatever its size, so a
                    component that fits stays whole on every phone.
    data-camera-narrow="0 420 260 400; 4.7 760 420 380"
                    The track used while the screen is narrower than 480px (phones, and the
                    plates of the 768 layout), keyed on whole components so no word is cut at the
                    screen's edge. Written in widths. Without it the narrow screen uses data-camera.
    media/<name>-sm.mp4
                    On a screen narrower than 480px the recording plays its -sm file (960 × 600,
                    H.264, +faststart: about a sixth of the bytes; data-sm="none" opts out), and
                    the full one if the -sm is missing. The camera stays in the full recording's
                    pixels (the poster's width and height). Give the poster a phone source too:
                    srcset="media/<name>-poster-sm.webp 960w, media/<name>-poster.jpg 1440w"
                    sizes="(max-width: 640px) 320px, 1440px".
    <li data-cam="2.2 980 420">
                    Older form, per caption: zoom (1 = the whole recording), x and y. A "cam" in
                    the JSON cue does the same. data-camera wins when both are given.
    The camera works in the recording's pixels from the top left of the screen, which is how
    site.css fits it (object-fit: cover, object-position: 0 0), so a screen of any shape works
    (the drawn screens on the scene plates are not exactly 16:10).
    The source is set only when the video comes within 200px of the screen. It plays when 60% of it
    is on screen and pauses when it leaves. With reduced motion or Save-Data it waits for Play.
    A live scene loads its app only after the page's load event, once it is within a quarter of a
    screen of view. During the visitor's turn the app takes a pointer at once, but the keyboard and
    screen readers skip it until the visitor taps in it or presses "Use the sample app with the
    keyboard" (a button that shows when it has focus), so a keyboard doesn't wade through its ~50
    stops to reach the page.

  ── 3. The opening (redesign.md §7.8) ───────────────────────────────────────────────────────

    <section class="opening" data-opening> … the live figure, in a sticky stage … </section>

    The scroll position through the wrapper picks the story's step, and each step plays on its own
    clock. If the visitor doesn't scroll, the steps advance every ~4 s after a 2 s pause. Scrolling
    back resets the story to that step. Once the visitor has used the app, scrolling no longer takes
    it back (Replay does). The wrapper and the figure get data-step and --step (0 before the first
    step, then 1 to n), plus --steps (n). The wrapper also gets --progress (0–1 through the pin).

  ── 4. The sticky step list beside the recordings ──────────────────────────────────────────

    <ol class="steps-sticky" data-showcase-nav>
      <li><a href="#lives">Teach live from your schedule</a></li>
    </ol>

    Each link points at a recording's figure, or at something that holds one. The link of the one on
    screen gets aria-current="step", and its <li> gets data-current. Every <li> gets --fill, its
    recording's progress from 0 to 1. A click scrolls to the recording and plays it.

  ── 5. What the script sets, for site.css ──────────────────────────────────────────────────

    figure            data-mode="live|phone|poster" (scenes), and data-state:
                      scenes poster|loading|live|story|free|done|failed,
                      recordings poster|playing|paused|done|failed.
    [data-steps] li   data-current on the current item, data-done on the ones before it, and --fill
                      (0–1) on each. Its words are wrapped in <button class="step-go"> (inline-reset
                      to look like the text; the focus ring is kept). A click jumps there. Use
                      data-steps="static" for a list that should not be clickable.
    [data-screen]     gets .show-cam > iframe.show-frame, .show-cursor (a drawn pointer and its tap)
                      and .show-hint > .show-hint-ring (the "your turn" ring: style it in site.css),
                      or video.show-video (the phone recording).
    [data-action="play"|"replay"]
                      The script toggles their hidden attribute, and creates them if they are
                      missing (inside [data-actions], or at the end of the figure).
    [data-after-tap]  Unhidden after the visitor's first tap in the app.

  With reduced motion there is no story, no clock and no autoplay. A live study scene is handed to
  the visitor at once, and recordings wait for Play. If JavaScript is off or the frame fails, the
  poster and the words stay.

  window.KlaroShowcase.get(figure) returns a figure's controller (for tests and pages added later).
*/
(function () {
  'use strict';
  var W = window, D = document, HTML = D.documentElement;
  if (!('IntersectionObserver' in W) || !W.requestAnimationFrame || !D.querySelector || !HTML.closest) return;

  // The site's root is the folder this file is in, so page depth and a sub-path don't matter.
  var ME = D.currentScript && D.currentScript.src;
  var ROOT = ME ? ME.slice(0, ME.lastIndexOf('/') + 1) : '/';
  var LANG = /^ar/i.test(HTML.lang || '') ? 'ar' : 'en';
  var APP_W = 1440, APP_H = 900;
  var WHOLE = { z: 1, x: 720, y: 450 };
  var FRAME = 'showcase/showcase.html';
  // The visitor's turn (free.ts) only works inside the study view. On any other scene the app's
  // guard loops until the stack overflows (showcase.md §4.2). Practice redirects into the study
  // view, so it may be freed once it has drawn (2), but never from the start.
  var FREE = { study: 1, 'student-study': 1, 'student-practice': 2 };
  var STORY_OF = { study: 'study', 'student-study': 'study' };
  var WORDS = {
    en: { frame: 'Klaro sample workspace', play: 'Play', replay: 'Replay', use: 'Use the sample app with the keyboard' },
    ar: { frame: 'مساحة Klaro التجريبية', play: 'تشغيل', replay: 'إعادة التشغيل', use: 'استخدم التطبيق التجريبي بلوحة المفاتيح' }
  }[LANG];
  // A button that looks exactly like the text it wraps. It keeps the browser's focus ring.
  var RESET = 'display:block;width:100%;margin:0;padding:0;border:0;background:none;font:inherit;' +
    'color:inherit;letter-spacing:inherit;line-height:inherit;text-align:inherit;cursor:pointer';

  function mq(q) { try { return W.matchMedia(q); } catch (e) { return { matches: false }; } }
  var REDUCE = mq('(prefers-reduced-motion: reduce)');
  var PHONE = mq('(max-width: 899px)');
  function still() { return !!REDUCE.matches; }
  // Only the visitor's own Save-Data setting. effectiveType is an estimate (a fresh browser can
  // say "2g" on a fast line), too noisy to take the live app away for.
  function lean() {
    var c = navigator.connection;
    return !!(c && c.saveData);
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lin(p, a, b) { return b === a ? (p >= b ? 1 : 0) : clamp((p - a) / (b - a), 0, 1); }
  function smooth(p, a, b) { var x = lin(p, a, b); return x * x * (3 - 2 * x); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function now() { return W.performance && performance.now ? performance.now() : Date.now(); }
  function noop() {}
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function make(tag, cls, css) {
    var el = D.createElement(tag);
    if (cls) el.className = cls;
    if (css) el.style.cssText = css;
    return el;
  }

  // Errors are said once each, then the page carries on with what it has.
  var said = {};
  function warn(what, detail) {
    if (said[what]) return;
    said[what] = 1;
    try { console.warn('[showcase] ' + what + (detail ? ': ' + detail : '')); } catch (e) { /* no console */ }
  }
  function guard(fn, what) {
    return function () {
      try { return fn.apply(this, arguments); } catch (e) { warn(what || 'error', e && e.message); }
    };
  }

  function afterLoad(fn) {
    if (D.readyState === 'complete') setTimeout(fn, 0);
    else W.addEventListener('load', function () { setTimeout(fn, 0); });
  }
  // Calls fn once, when el comes within `margin` of the screen.
  function near(el, margin, fn) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.disconnect(); guard(fn, 'near')(); return; }
      }
    }, { rootMargin: margin });
    io.observe(el);
  }
  // Calls fn with the latest entry whenever el crosses one of the thresholds.
  function watch(el, thresholds, fn) {
    var io = new IntersectionObserver(function (entries) {
      guard(fn, 'watch')(entries[entries.length - 1]);
    }, { threshold: thresholds });
    io.observe(el);
    return io;
  }
  var onShow = [];
  D.addEventListener('visibilitychange', function () {
    for (var i = 0; i < onShow.length; i++) guard(onShow[i], 'visibility')();
  });

  function screenOf(fig) {
    var s = fig.querySelector('[data-screen]') || fig.querySelector('[data-nosnippet]');
    if (!s) { var m = fig.querySelector('img, video'); s = m ? m.parentNode : fig; }
    return s;
  }
  // The camera needs a positioned box that clips, in the app's shape. site.css should give it
  // that; this only fills in what is missing.
  function boxIn(screen) {
    var cs = W.getComputedStyle(screen);
    if (cs.position === 'static') screen.style.position = 'relative';
    if (cs.overflow === 'visible') screen.style.overflow = 'hidden';
    if (!screen.clientHeight) screen.style.aspectRatio = APP_W + ' / ' + APP_H;
  }
  function readCam(text) {
    var v = (text || '').trim().split(/[\s,]+/).map(parseFloat);
    return v.length === 3 && v.every(isFinite) ? { z: v[0], x: v[1], y: v[2] } : null;
  }
  // data-camera: "t s x y; t s x y; …", sorted by time. s up to 8 is a scale (screen px per
  // recording px); above 8 it is a width: that many recording px across the screen, whatever the
  // screen's size, so a component that fits stays whole on every phone.
  function readTrack(text) {
    return (text || '').split(';').map(function (part) {
      var v = part.trim().split(/[\s,]+/).map(parseFloat);
      if (!(v.length === 4 && v.every(isFinite) && v[1] > 0)) return null;
      return v[1] > 8 ? { t: v[0], w: v[1], x: v[2], y: v[3] } : { t: v[0], s: v[1], x: v[2], y: v[3] };
    }).filter(Boolean).sort(function (a, b) { return a.t - b.t; });
  }
  // A key's scale on a screen `sw` px wide.
  function keyScale(c, sw) { return c.w ? sw / c.w : c.s; }
  // A screen narrower than this uses the figure's data-camera-narrow (when it has one) and the
  // recording's -sm file: phones, and the plates of the 768 layout.
  var NARROW = 480;
  function tracks(fig) {
    var wide = readTrack(fig.getAttribute('data-camera')), narrow = readTrack(fig.getAttribute('data-camera-narrow'));
    return function (sw) { return narrow.length && sw < NARROW ? narrow : wide; };
  }
  var CAM_EASE = 0.8, CAM_MAX = 4;
  // A recording fills its screen like object-fit: cover from the top left (site.css): at zoom 1
  // its pixels are drawn at `base`, and the camera's transform scales from there.
  function coverBase(w, h, vw, vh) { return Math.max(w / vw, h / vh); }
  // Lays a recording, its poster or a still out for the camera: the element is the whole
  // picture at the cover scale (not the screen's box, which would clip what the camera pans to),
  // its top left at the screen's, and the camera's transform on it. The screen clips. css ''
  // gives the element back to site.css.
  function lay(el, css, w, h, vw, vh) {
    if (!el) return;
    var st = el.style;
    if (!css) {
      if (st.transform) { st.transform = st.transformOrigin = st.width = st.height = st.left = st.top = st.right = st.bottom = st.objectFit = st.maxWidth = st.maxHeight = ''; }
      return;
    }
    var b = coverBase(w, h, vw, vh);
    // Wider than the screen when the screen is narrower than the picture (every drawn screen is):
    // klaro.css caps img and video at 100%, which would squeeze the picture and leave a dark band.
    st.maxWidth = st.maxHeight = 'none';
    st.left = st.top = '0';
    st.right = st.bottom = 'auto';
    st.width = (vw * b).toFixed(1) + 'px';
    st.height = (vh * b).toFixed(1) + 'px';
    st.objectFit = 'fill';
    st.transformOrigin = '0 0';
    if (st.transform !== css) st.transform = css;
  }
  function camTransform(w, h, vw, vh, z, x, y) {
    var s = coverBase(w, h, vw, vh) * z;
    var tx = Math.min(0, Math.max(w - vw * s, w / 2 - x * s));
    var ty = Math.min(0, Math.max(h - vh * s, h / 2 - y * s));
    return 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + z.toFixed(4) + ')';
  }
  // Cue times (and cameras) from media/<name>.json, for the <li> that don't carry their own.
  function cuesFrom(name, times, cams, done) {
    if (!W.fetch) return;
    fetch(ROOT + 'media/' + name + '.json').then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (meta) {
      var cues = (meta && meta.cues) || [];
      if (cues.length !== times.length) warn('the cues of ' + name + ' don’t match its list', cues.length + ' cues, ' + times.length + ' items');
      for (var k = 0; k < times.length; k++) {
        if (!isFinite(times[k]) && cues[k] && isFinite(+cues[k].t)) times[k] = +cues[k].t;
        if (!cams[k] && cues[k] && cues[k].cam) cams[k] = cues[k].cam;
      }
      done();
    }).catch(function (e) { warn('no cues for ' + name, e && e.message); });
  }

  // A step list: the words stay in the HTML, the script marks the current one and fills its bar.
  function Steps(list, pick) {
    var items = [], ctl = [], cur = -2, lastFill = -1;
    if (list) {
      for (var c = list.firstElementChild; c; c = c.nextElementSibling) if (c.tagName === 'LI') items.push(c);
      if (list.getAttribute('data-steps') === 'static') pick = null;
    }
    items.forEach(function (li, k) {
      var b = li;
      if (pick) {
        b = make('button', 'step-go', RESET);
        b.type = 'button';
        while (li.firstChild) b.appendChild(li.firstChild);
        li.appendChild(b);
        b.addEventListener('click', guard(function () { pick(k); }, 'step'));
      }
      ctl.push(b);
    });
    function set(k, fill) {
      if (k !== cur) {
        cur = k;
        lastFill = -1;
        items.forEach(function (li, i) {
          if (i === k) { li.setAttribute('data-current', ''); ctl[i].setAttribute('aria-current', 'step'); }
          else { li.removeAttribute('data-current'); ctl[i].removeAttribute('aria-current'); }
          if (i < k) li.setAttribute('data-done', ''); else li.removeAttribute('data-done');
          li.style.setProperty('--fill', i < k ? '1' : '0');
        });
      }
      if (fill != null && items[k] && Math.abs(fill - lastFill) > 0.004) {
        lastFill = fill;
        items[k].style.setProperty('--fill', fill.toFixed(3));
      }
    }
    return { items: items, set: set };
  }

  // A Play or Replay button: the page's own (translated, with its icon), or a plain one.
  function action(fig, name, label, fn) {
    var b = fig.querySelector('[data-action="' + name + '"]');
    if (!b) {
      b = make('button', 'show-' + name);
      b.type = 'button';
      b.setAttribute('data-action', name);
      b.textContent = label;
      b.hidden = true;
      (fig.querySelector('[data-actions]') || fig).appendChild(b);
    }
    b.addEventListener('click', guard(function (e) { e.preventDefault(); fn(); }, name));
    return b;
  }

  /*
    Plays a <video> from one second to another. Safari in Low Power Mode (and an iPhone in it)
    refuses to start a video by itself, and play() is rejected. The video is then stepped through,
    one seek per frame, which is always allowed (Omar's examples.js). The clock runs at real speed;
    a frame that is still loading is skipped, never waited for.
  */
  function Player(video, onTime, onEnd, onStop) {
    var manual = false, run = false, until = 0, clock = 0, last = 0;
    function end() { return Math.min(until || Infinity, video.duration || Infinity); }
    function frame(t) {
      if (!run) return;
      if (manual) {
        clock += Math.min(0.1, Math.max(0, (t - last) / 1000));
        last = t;
        if (video.readyState >= 1) {
          clock = Math.min(clock, end());
          if (!video.seeking) video.currentTime = clock;
        }
      }
      var at = manual ? clock : video.currentTime;
      onTime(at);
      if (video.readyState >= 1 && at >= end() - 0.04) { stop(); onEnd(); return; }
      // Paused by the browser (a background tab saving power, a stall): say so, and wait.
      if (!manual && video.paused) { run = false; if (onStop) onStop(); return; }
      requestAnimationFrame(frame);
    }
    function start() { run = true; last = now(); requestAnimationFrame(frame); }
    function stop() { run = false; if (!video.paused) video.pause(); }
    video.addEventListener('ended', function () { if (run && !manual) { run = false; onTime(video.currentTime); onEnd(); } });
    // Keeps the words in step when the frame loop isn't running (a seek while paused).
    ['seeked', 'timeupdate'].forEach(function (type) {
      video.addEventListener(type, function () { if (!run) onTime(video.currentTime); });
    });
    return {
      play: function (from, to) {
        until = to || 0;
        if (from != null && isFinite(from)) {
          clock = from;
          try { video.currentTime = from; } catch (e) { /* not seekable yet */ }
        } else {
          clock = video.currentTime || 0;
        }
        if (manual) {
          if (video.readyState === 0 && video.networkState !== 2) { video.preload = 'auto'; video.load(); }
          start();
          return;
        }
        var p;
        try { p = video.play(); } catch (e) { p = null; }
        start();
        if (p && p.catch) {
          p.catch(function (err) {
            if ((err && err.name === 'AbortError') || video.error) return;
            manual = true;
            if (video.readyState === 0) { video.preload = 'auto'; video.load(); }
            start();
          });
        }
      },
      pause: stop,
      seek: function (t) {
        clock = t;
        try { video.currentTime = t; } catch (e) { /* not seekable yet */ }
        onTime(t);
      },
      playing: function () { return run; }
    };
  }

  /*
    Picks the step: the scroll position through the opening (redesign.md §7.8), or a clock when
    the visitor doesn't scroll (2 s, then every ~4 s), or a click on a step. `play(i, prev, how)`
    shows step i (-1 is the state before the first step).
  */
  function Conductor(fig, n, play, ms, auto) {
    var op = fig.closest('[data-opening]');
    var lis = fig.querySelectorAll('[data-steps] > li');
    var spread = n === 4 ? [0.15, 0.35, 0.6, 0.85] : null;
    var at = [];
    for (var k = 0; k < n; k++) {
      var v = lis[k] ? parseFloat(lis[k].getAttribute('data-at')) : NaN;
      at.push(isFinite(v) ? v : spread ? spread[k] : 0.15 + 0.7 * (n > 1 ? k / (n - 1) : 0));
    }
    var cur = -1, timer = 0, on = false, held = false, seen = false, lastS = -1, raf = 0;

    function mark() {
      var s = String(cur + 1);
      [fig, op].forEach(function (el) {
        if (!el) return;
        el.setAttribute('data-step', s);
        el.style.setProperty('--step', s);
        el.style.setProperty('--steps', String(n));
      });
    }
    function go(i, how) {
      i = clamp(i, -1, n - 1);
      var prev = cur;
      cur = i;
      mark();
      play(i, prev, how || '');
      arm();
    }
    function arm() {
      clearTimeout(timer);
      timer = 0;
      if (!on || held || !seen || D.hidden || still() || cur >= n - 1 || !auto()) return;
      timer = setTimeout(function () { timer = 0; go(cur + 1, 'clock'); }, cur < 0 ? 2000 : Math.max(4000, ms(cur) + 800));
    }
    // How far the visitor is through the pin: 0 when it starts, 1 when the stage lets go.
    function pin() {
      var r = op.getBoundingClientRect(), span = r.height - W.innerHeight;
      return span > 0 ? clamp(-r.top / span, 0, 1) : r.top < 0 ? 1 : 0;
    }
    function stepAt(p) {
      var s = -1;
      for (var i = 0; i < n; i++) if (p >= at[i]) s = i;
      return s;
    }
    function scrolled() {
      raf = 0;
      var p = pin();
      op.style.setProperty('--progress', p.toFixed(3));
      if (!on || held || still()) return;
      var s = stepAt(p);
      if (s === lastS) return;
      var back = s < lastS;
      lastS = s;
      // Forward never rewinds what the clock already played; back always resets to that step.
      if (back || s > cur) go(s, 'scroll');
    }
    if (op) {
      var later = function () { if (!raf) raf = requestAnimationFrame(guard(scrolled, 'scroll')); };
      W.addEventListener('scroll', later, { passive: true });
      W.addEventListener('resize', later);
      later();
    }
    watch(fig, [0, 0.25], function (e) { seen = e.isIntersecting && e.intersectionRatio >= 0.25; arm(); });
    onShow.push(arm);
    mark();
    return {
      start: function () {
        if (on) return;
        on = true;
        lastS = op ? stepAt(pin()) : -1;
        if (lastS >= 0) go(lastS, 'scroll');
        else arm();
      },
      go: go,
      // The visitor asked for the story (Replay, or a step): let the clock carry it on from there,
      // even where it never started by itself (data-play="free").
      wake: function () { on = true; },
      hold: function (v) { held = !!v; arm(); },
      cur: function () { return cur; },
      jump: function (i) { cur = i; mark(); },
      stop: function () { on = false; clearTimeout(timer); }
    };
  }

  /*
    Stories: a camera over the live app, as Omar's hero.js plays it, but every point is found in
    the app with `measure` (showcase.md §2.1), so it also works in Arabic, where the panes mirror.
    `px` are Omar's English pixels, used only when a target can't be measured (mirrored in Arabic).
    The book page is a PDF and never mirrors, so points inside it are fractions of the page.
  */
  var STORIES = {
    study: {
      shown: { selector: '[data-book-page="2"] .textLayer span' },
      targets: {
        page: { selector: '[data-book-page="2"]' },
        video: { selector: '[data-pane="lecture"] video' },
        question: { selector: '[data-pane="questions"] article' }
      },
      points: {
        passage: { from: 'page', at: [0.58, 0.33], px: [215, 395] },   // "Parts every cell has"
        tap: { from: 'page', at: [0.545, 0.318], px: [205, 392] },
        hint: { from: 'page', at: [0.53, 0.51], px: [200, 470] },      // "The cell membrane"
        lecture: { from: 'video', at: [0.5, 0.5], px: [700, 470] },
        question: { from: 'question', at: [0.5, 0.17], px: [1228, 420] }
      },
      beats: [
        { // A passage of the book is tapped (the app points at it, as a click would).
          ms: 2800,
          enter: function (S) { S.tell({ free: false, scrub: false, step: 0 }); S.measure(); },
          draw: function (S, q) {
            var p = S.point('passage'), t = S.point('tap'), g = smooth(q, 0.15, 0.6);
            S.camTo({ z: 2.1, x: p.x, y: p.y }, smooth(q, 0, 0.5));
            S.cursor(mix(t.x + S.dir * 330, t.x, g), mix(t.y + 230, t.y, g), smooth(q, 0.1, 0.2) * (1 - smooth(q, 0.86, 1)));
            S.ripple(lin(q, 0.62, 0.86));
            if (q >= 0.62) S.once('point', function () { S.tell({ step: 1 }); });
          }
        },
        { // The lecture jumps to that moment and plays the explanation (scrubbed, 113 s to 163 s).
          ms: 4200,
          enter: function (S) { S.tell({ step: 1 }); S.tell({ step: 2, scrub: true }); S.time(113, true); S.measure(); },
          draw: function (S, q) {
            var v = S.point('lecture');
            S.cursor(0, 0, 0);
            S.camTo({ z: mix(1.9, 2.0, lin(q, 0.3, 1)), x: v.x, y: v.y }, smooth(q, 0, 0.3));
            S.time(113 + 50 * lin(q, 0.2, 1));
          }
        },
        { // The past-paper question on that passage, beside it.
          ms: 2800,
          enter: function (S) { S.tell({ step: 2, scrub: true }); S.measure(); },
          draw: function (S, q) {
            var p = S.point('question');
            S.camTo({ z: 2.3, x: p.x, y: p.y }, smooth(q, 0, 0.45));
          }
        },
        { // Back out to the book and the lecture, side by side; then the study view is the visitor's.
          ms: 1500,
          enter: function (S) { S.tell({ step: 2 }); },
          draw: function (S, q) { S.camTo(S.freeView(), smooth(q, 0, 1)); },
          end: function (S) { S.handOver(); }
        }
      ]
    }
  };
  // Before the first step: the whole app, as it opened.
  var INTRO = {
    ms: 700,
    enter: function (S) { S.tell({ free: false, scrub: false, step: 0 }); S.cursor(0, 0, 0); },
    draw: function (S, q) { S.camTo(WHOLE, smooth(q, 0, 1)); }
  };
  // "steps": each <li> is a step of the scene, with no camera.
  function stepBeats(items) {
    return items.map(function (li, k) {
      var s = parseInt(li.getAttribute('data-step'), 10);
      if (!isFinite(s)) s = k;
      return {
        ms: 3000,
        enter: function (S) { S.tell({ step: s }); },
        draw: function (S, q) { S.camTo(WHOLE, smooth(q, 0, 1)); }
      };
    });
  }

  // Every live frame on the page, for the one message listener below.
  var frames = [];
  // Attached before any frame exists, so `ready` can never be missed (showcase.md §5.4, item 1).
  W.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    var d = e.data;
    if (!d || typeof d.type !== 'string' || d.type.indexOf('klaro-showcase') !== 0) return;
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].source() === e.source) { guard(frames[i].hear, 'message')(d); return; }
    }
  });

  var liveCount = 0;
  function Live(fig) {
    var scene = fig.getAttribute('data-showcase') || 'study';
    var fill = fig.getAttribute('data-fit') === 'fill';
    var storyName = fig.getAttribute('data-story');
    // A frame at its own size has no camera, so no story.
    var story = fill ? null : STORIES[storyName == null ? STORY_OF[scene] || '' : storyName] || null;
    var mode = fig.getAttribute('data-play') || (story ? 'story' : fill ? 'free' : 'steps');
    var freeKind = FREE[scene] || 0;
    if (mode === 'free' && !freeKind) {
      warn('the visitor’s turn only works on the study scenes', scene);
      mode = 'steps';
    }
    var screen = screenOf(fig);
    var api = { fig: fig, scene: scene };
    fig._showcase = api;
    // The app's own size in the frame (data-app-width, 1440 by default; 16:10). Narrower draws the
    // app larger on a small screen while it keeps its three panes (they need about 1000px).
    var AW = Math.max(1000, +fig.getAttribute('data-app-width') || APP_W), AH = Math.round(AW * APP_H / APP_W);

    // Phones and Save-Data: no live app inline (it is the whole app, ~1.1 MB of code). Phones
    // get the phone recording; a big screen on Save-Data keeps the poster. Only /try/, where the
    // app is the page, asks for it on phones too (data-phone="live").
    if (fig.getAttribute('data-phone') !== 'live' && (PHONE.matches || lean())) {
      var rec = PHONE.matches && fig.getAttribute('data-phone-recording');
      if (rec) return Handset(fig, screen, rec, api);
      fig.setAttribute('data-mode', 'poster');
      fig.setAttribute('data-state', 'poster');
      api.mode = 'poster';
      return api;
    }
    if (++liveCount > 1) warn('more than one live scene on this page; each one loads the whole app');
    fig.setAttribute('data-mode', 'live');
    fig.setAttribute('data-state', 'poster');
    api.mode = 'live';

    var lang = LANG, dir = lang === 'ar' ? -1 : 1;
    var camEl = null, frame = null, cursor = null, tapEl = null, hint = null;
    var talking = false, drawn = false, dead = false, freeOn = false, used = false;
    var rects = {}, seq = 0, waiting = {}, pinger = 0, born = 0;
    var Wd = 0, Ht = 0, base = 1, cam = WHOLE, from = WHOLE;
    var raf = 0, bi = -1, t0 = 0, once = {}, lastTime = -1;
    var lis = fig.querySelectorAll('[data-steps] > li');
    var beats = story ? story.beats : mode === 'steps' ? stepBeats(Array.prototype.slice.call(lis)) : [];
    var n = beats.length;
    // A step or Replay, chosen by the visitor: the clock takes the story on from there, also where
    // it never ran by itself (data-play="free" on a scene with a story), so it ends with the
    // hand-over again instead of stopping after one beat.
    function ask(k, how) {
      if (!drawn || dead || k >= n) return;
      cond.hold(false);
      cond.wake();
      cond.go(k, still() ? 'instant' : how);
    }
    var steps = Steps(fig.querySelector('[data-steps]'), function (k) { ask(k, 'click'); });
    var replay = action(fig, 'replay', WORDS.replay, function () { ask(0, 'replay'); });
    // Shown (to the keyboard; site.css keeps it out of sight until it has focus) only during the
    // visitor's turn: it puts the app in the tab order and moves into it.
    var useBtn = action(fig, 'use', WORDS.use, function () {
      if (!freeOn) return;
      open();
      used = true;
      cond.hold(true);
      if (hint) hint.hidden = true;
      try { frame.focus(); frame.contentWindow.focus(); } catch (e) { /* same origin; focus() is enough */ }
    });
    if (!useBtn.classList.contains('btn')) {
      useBtn.className = 'btn btn-secondary btn-sm show-use';
      useBtn.parentNode.insertBefore(useBtn, useBtn.parentNode.firstChild);
    }
    var tapped = fig.querySelector('[data-after-tap]');

    function state(s) { fig.setAttribute('data-state', s); api.state = s; }
    function tell(msg, force) {
      if (!frame || dead || (!talking && !force)) return;
      msg.type = 'klaro-showcase';
      try { frame.contentWindow.postMessage(msg, location.origin); } catch (e) { warn('postMessage', e && e.message); }
    }
    // `measure` has no request id, so each request names its targets "<id>:<name>", plus "<id>"
    // itself on <body>, which is always found. A reply is then matched to its request.
    function measure(targets, cb) {
      var id = 'm' + (++seq), q = {};
      q[id] = { selector: 'body' };
      for (var k in targets) if (targets.hasOwnProperty(k)) q[id + ':' + k] = targets[k];
      waiting[id] = cb;
      setTimeout(function () { if (waiting[id]) { delete waiting[id]; cb(null); } }, 2500);
      tell({ measure: q }, true);
    }
    function answer(all) {
      for (var id in all) {
        if (!all.hasOwnProperty(id) || id.indexOf(':') >= 0 || !waiting[id]) continue;
        var cb = waiting[id], out = {}, pre = id + ':';
        delete waiting[id];
        for (var k in all) if (all.hasOwnProperty(k) && k.indexOf(pre) === 0) out[k.slice(pre.length)] = all[k];
        cb(out);
      }
    }
    function remeasure() {
      if (!story) return;
      [0, 700, 1600].forEach(function (d) {
        setTimeout(function () {
          measure(story.targets, function (r) {
            if (!r) return;
            for (var k in r) if (r.hasOwnProperty(k)) rects[k] = r[k];
            // Handed over before the panes were measured: frame them now, unless the visitor is
            // already using the app.
            if (freeOn && !used && !fill) place(freeView());
            placeHint();
          });
        }, d);
      });
    }
    function point(name) {
      var p = story && story.points[name];
      if (!p) return { x: WHOLE.x, y: WHOLE.y };
      var r = rects[p.from];
      if (r && r.w > 0) return { x: r.x + p.at[0] * r.w, y: r.y + p.at[1] * r.h };
      return { x: dir < 0 ? AW - p.px[0] : p.px[0], y: p.px[1] };
    }

    // The camera: the app point at the centre of the screen, and a zoom, as one CSS transform.
    function fit() {
      Wd = screen.clientWidth;
      Ht = screen.clientHeight || Math.round(Wd * AH / AW);
      // The app covers the screen whatever its shape (a drawn screen on a plate is not exactly 16:10).
      base = coverBase(Wd, Ht, AW, AH);
      place(cam);
      placeHint();
    }
    function view(c) {
      var s = base * c.z;
      return {
        s: s,
        tx: Math.min(0, Math.max(Wd - AW * s, Wd / 2 - c.x * s)),
        ty: Math.min(0, Math.max(Ht - AH * s, Ht / 2 - c.y * s))
      };
    }
    function place(c) {
      cam = c;
      if (!camEl || fill) return;
      var v = view(c);
      camEl.style.transform = 'translate(' + v.tx.toFixed(2) + 'px,' + v.ty.toFixed(2) + 'px) scale(' + v.s.toFixed(5) + ')';
    }
    function at(el, x, y) {
      var v = view(cam);
      el.style.transform = 'translate(' + (v.tx + x * v.s).toFixed(1) + 'px,' + (v.ty + y * v.s).toFixed(1) + 'px)';
    }
    // The visitor's turn: the book and the lecture side by side, as large as they fit (the
    // questions pane is cut; the whole app is a tap on "Try it full screen" away). The app's own
    // header is off the top. Until the panes are measured, the whole app.
    function freeView() {
      var a = rects.page, v = rects.video;
      if (!story || !a || !v || !(a.w > 0) || !(v.w > 0)) return WHOLE;
      var left = Math.max(0, Math.min(a.x, v.x) - 28), right = Math.min(AW, Math.max(a.x + a.w, v.x + v.w) + 28);
      // Never past the app's own size on a big screen (a frame drawn at 1000 on a 1100px screen).
      var z = clamp(Math.min(AW / (right - left), 1 / base), 1, 1.7), half = AH / (2 * z);
      return { z: z, x: (left + right) / 2, y: clamp(Math.min(a.y, v.y) - 24 + half, half, AH - half) };
    }
    function placeHint() {
      if (!hint || hint.hidden) return;
      var p = point('hint');
      at(hint, p.x, p.y);
    }

    var S = {
      dir: dir,
      tell: function (m) { tell(m); },
      point: point,
      measure: remeasure,
      camTo: function (c, t) { place({ z: mix(from.z, c.z, t), x: mix(from.x, c.x, t), y: mix(from.y, c.y, t) }); },
      freeView: function () { return freeView(); },
      cursor: function (x, y, o) {
        if (!cursor) return;
        cursor.style.opacity = o > 0.001 ? o.toFixed(3) : '0';
        if (o > 0.001) at(cursor, x, y);
      },
      ripple: function (q) {
        if (!tapEl) return;
        tapEl.style.transform = 'scale(' + (0.3 + 2.2 * q).toFixed(3) + ')';
        tapEl.style.opacity = q > 0 && q < 1 ? (1 - q).toFixed(3) : '0';
      },
      time: function (t, force) {
        if (force || Math.abs(t - lastTime) > 0.04) { lastTime = t; if (!force) tell({ time: t }); }
      },
      once: function (key, fn) { if (!once[key]) { once[key] = 1; fn(); } },
      handOver: function () { handOver(); }
    };

    // Shows step i. Steps skipped on the way forward are applied at once, so the app is in the
    // same state whichever way the visitor got there.
    function run(i, prev, how) {
      cancelAnimationFrame(raf);
      raf = 0;
      if (dead || !drawn) return;
      if (freeOn) leaveFree();
      replay.hidden = true;
      state('story');
      for (var k = Math.max(prev + 1, 0); k < i; k++) {
        once = {};
        beats[k].enter(S);
        from = cam;
        beats[k].draw(S, 1);
      }
      var b = i < 0 ? INTRO : beats[i];
      once = {};
      b.enter(S);
      from = cam;
      steps.set(i, 0);
      if (how === 'instant' || still()) { b.draw(S, 1); steps.set(i, 1); finish(i); return; }
      bi = i;
      t0 = now();
      raf = requestAnimationFrame(loop);
    }
    function loop(t) {
      raf = 0;
      if (dead) return;
      var b = bi < 0 ? INTRO : beats[bi];
      var q = clamp((t - t0) / b.ms, 0, 1);
      guard(b.draw, 'story')(S, q);
      if (bi >= 0) steps.set(bi, q);
      if (q < 1) raf = requestAnimationFrame(loop);
      else finish(bi);
    }
    function finish(i) {
      if (i < 0) return;
      if (beats[i].end) beats[i].end(S);
      else if (i === n - 1) { state('done'); replay.hidden = false; }
    }

    // The visitor's turn: only the study view, and only once the app has drawn (free.ts).
    function handOver() {
      var free = !!freeKind;
      S.cursor(0, 0, 0);
      S.ripple(0);
      place(fill ? cam : free ? freeView() : WHOLE);
      tell({ scrub: false, free: free });
      if (free) {
        freeOn = true;
        // A pointer can use the app now; the keyboard and screen readers skip it (its ~50 stops)
        // until the visitor taps in it or presses "Use the sample app with the keyboard".
        camEl.removeAttribute('inert');
        camEl.setAttribute('aria-hidden', 'true');
        camEl.style.pointerEvents = '';
        frame.setAttribute('tabindex', '-1');
        useBtn.hidden = false;
        state('free');
        if (hint && story && story.points.hint && !fill) { hint.hidden = false; placeHint(); }
      } else {
        state('done');
      }
      // Replay plays the story again; with reduced motion there is no story to replay.
      replay.hidden = still() || !n;
    }
    function leaveFree() {
      freeOn = false;
      used = false;
      tell({ free: false });
      camEl.setAttribute('inert', '');
      camEl.removeAttribute('aria-hidden');
      camEl.style.pointerEvents = 'none';
      frame.setAttribute('tabindex', '-1');
      useBtn.hidden = true;
      if (hint) hint.hidden = true;
    }
    // The visitor chose the app (a tap in it, or the keyboard button): it joins the tab order and
    // the accessibility tree.
    function open() {
      camEl.removeAttribute('aria-hidden');
      frame.removeAttribute('tabindex');
      useBtn.hidden = true;
    }
    // The visitor used the app: scroll and the clock leave it alone until Replay.
    function touched() {
      if (!freeOn) return;
      used = true;
      open();
      cond.hold(true);
      if (hint) hint.hidden = true;
    }

    function fail(why) {
      if (dead) return;
      dead = true;
      clearInterval(pinger);
      cancelAnimationFrame(raf);
      cond.stop();
      warn('the ' + scene + ' scene stays a picture', why);
      if (camEl && camEl.parentNode) camEl.parentNode.removeChild(camEl);
      if (cursor && cursor.parentNode) cursor.parentNode.removeChild(cursor);
      if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
      replay.hidden = true;
      state('failed');
    }

    // `ready` (or any answer) means the app listens; it is not yet drawn (showcase.md §5.4, item 2).
    // So: ask for a target the scene shows once it has drawn, and fade in only then.
    function connected() {
      if (talking || dead) return;
      talking = true;
      clearInterval(pinger);
      state('loading');
      var start = now(), target = (story && story.shown) || { selector: 'main h1' };
      (function poll() {
        if (dead || drawn) return;
        measure({ a: target, b: { selector: 'main h1' } }, function (r) {
          if (dead || drawn) return;
          if (D.hidden) start = now();
          if (r && r.a) { setTimeout(shown, 200); return; }
          var waited = now() - start;
          if (waited > 8000 && r && r.b) { warn('the ' + scene + ' scene drew without its story target'); shown(); return; }
          if (waited > 20000) { fail('nothing drawn after 20 s'); return; }
          setTimeout(poll, waited > 3000 ? 400 : 200);
        });
      })();
    }
    function shown() {
      if (drawn || dead) return;
      drawn = true;
      camEl.style.opacity = '1';
      state('live');
      remeasure();
      if (mode === 'free' || still()) {
        // Reduced motion: no story; the study view is the visitor's at once, other scenes go to
        // their last step.
        if (story && n) { cond.jump(n - 1); steps.set(n - 1, 1); }
        if (mode === 'steps' && n) cond.go(n - 1, 'instant');
        else handOver();
      } else {
        cond.start();
      }
    }
    function hear(d) {
      if (d.type === 'klaro-showcase-ready') connected();
      else if (d.type === 'klaro-showcase-rects') { connected(); answer(d.rects || {}); }
      else if (d.type === 'klaro-showcase-tap') {
        touched();
        if (tapped) tapped.hidden = false;
      } else if (d.type === 'klaro-showcase-shown') shown();          // a later app build (§9)
      else if (d.type === 'klaro-showcase-error') fail(d.message || 'the app said it failed');
    }

    function create() {
      if (frame || dead) return;
      boxIn(screen);
      camEl = make('div', 'show-cam', fill
        ? 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;pointer-events:none;transition:opacity .4s'
        : 'position:absolute;top:0;left:0;width:' + AW + 'px;height:' + AH + 'px;transform-origin:0 0;opacity:0;pointer-events:none;transition:opacity .4s');
      if (still()) camEl.style.transition = 'none';
      camEl.setAttribute('inert', '');
      frame = make('iframe', 'show-frame', fill
        ? 'display:block;width:100%;height:100%;border:0'
        : 'display:block;width:' + AW + 'px;height:' + AH + 'px;border:0');
      frame.title = fig.getAttribute('data-title') || WORDS.frame;
      frame.setAttribute('tabindex', '-1');
      // Always the page's language: a frame without one opens in the last language used on the
      // site, which i18next keeps in localStorage (showcase.md §5.4, item 4).
      var startFree = freeKind === 1 && (mode === 'free' || still());
      frame.src = ROOT + FRAME + '?scene=' + encodeURIComponent(scene) + '&lang=' + lang + (startFree ? '&free=1' : '');
      frame.addEventListener('load', function () {
        if (!talking) measure({}, noop);
        try {
          frame.contentWindow.addEventListener('pointerdown', touched, true);
          frame.contentWindow.addEventListener('keydown', touched, true);
        } catch (e) { /* the frame is always same-origin; if not, the tap message still works */ }
      });
      camEl.appendChild(frame);
      if (!fill) {
        cursor = make('div', 'show-cursor', 'position:absolute;top:0;left:0;z-index:2;pointer-events:none;opacity:0;will-change:transform,opacity');
        cursor.setAttribute('aria-hidden', 'true');
        cursor.innerHTML =
          '<svg class="show-tap" width="36" height="36" viewBox="0 0 36 36" style="position:absolute;left:-18px;top:-18px;opacity:0;overflow:visible">' +
          '<circle cx="18" cy="18" r="18" fill="rgba(146,84,224,.35)"/></svg>' +
          '<svg width="26" height="26" viewBox="0 0 24 24" style="position:relative;display:block;margin:-2px 0 0 -4px">' +
          '<path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#171717" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
        tapEl = cursor.firstChild;
        hint = make('div', 'show-hint', 'position:absolute;top:0;left:0;z-index:3;pointer-events:none');
        hint.setAttribute('aria-hidden', 'true');
        hint.hidden = true;
        hint.appendChild(make('span', 'show-hint-ring'));
      }
      screen.appendChild(camEl);
      if (cursor) { screen.appendChild(cursor); screen.appendChild(hint); }
      frames.push({ source: function () { return frame && frame.contentWindow; }, hear: hear });
      fit();
      if (W.ResizeObserver) new ResizeObserver(guard(fit, 'resize')).observe(screen);
      else W.addEventListener('resize', guard(fit, 'resize'));
      state('loading');
      // Ask until the app answers: a `ready` sent before this page listened is not lost. The app
      // answers `measure` as soon as its listener is up; a later build also answers `hello`.
      born = now();
      measure({}, noop);
      pinger = setInterval(function () {
        if (talking || dead) { clearInterval(pinger); return; }
        if (D.hidden) born = now();
        else if (now() - born > 15000) { fail('the frame never answered'); return; }
        tell({ hello: true }, true);
        measure({}, noop);
      }, 300);
    }

    var cond = Conductor(fig, n, run, function (i) { return beats[i] ? beats[i].ms : 3000; }, function () { return true; });
    // Never before the page has loaded, and only once the scene is on screen or about to be (a
    // quarter of a screen away): the app is ~2.6 MB, and a frame further down waits for the scroll.
    afterLoad(function () { near(fig, '25% 0px', create); });
    api.go = function (i) { ask(i, 'click'); };
    api.replay = function () { replay.click(); };
    api.step = function () { return cond.cur(); };
    api.measure = measure;
    api.rects = rects;
    return api;
  }

  /*
    Phones: the same story as a recording of the app's phone layout, stepped by scroll like the
    live one (redesign.md §7.8). Nothing is fetched until the visitor scrolls or taps, so the first
    screen costs only the poster.
  */
  function Handset(fig, screen, name, api) {
    fig.setAttribute('data-mode', 'phone');
    fig.setAttribute('data-state', 'poster');
    api.mode = 'phone';
    boxIn(screen);
    var video = make('video', 'show-video', 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover');
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.playsInline = true;
    video.preload = 'none';
    // The screen's own <img> (a <picture> with a phone source) shows through until the video has
    // a frame, so phones fetch one poster, not two. data-phone-poster sets one on the video instead.
    if (fig.getAttribute('data-phone-poster')) video.poster = fig.getAttribute('data-phone-poster');
    var img = screen.querySelector('img');
    if (img && img.alt) video.setAttribute('aria-label', img.alt);
    screen.appendChild(video);

    var engaged = false, loaded = false, seg = -1, times = [], cams = [];
    var steps = Steps(fig.querySelector('[data-steps]'), function (k) { load(); cond.hold(false); cond.go(k, 'click'); });
    var n = steps.items.length;
    steps.items.forEach(function (li) { times.push(parseFloat(li.getAttribute('data-t'))); });
    var replay = action(fig, 'replay', WORDS.replay, function () { load(); cond.hold(false); cond.go(0, 'replay'); });
    function ends(i) { return isFinite(times[i + 1]) ? times[i + 1] : 0; }
    var player = Player(video, function (t) {
      if (seg < 0) return;
      var a = times[seg] || 0, b = ends(seg) || video.duration || a + 4;
      steps.set(seg, lin(t, a, b));
    }, function () {
      if (seg < 0) return;
      steps.set(seg, 1);
      if (seg === n - 1) { fig.setAttribute('data-state', 'done'); replay.hidden = false; }
    });
    video.addEventListener('error', function () { warn('the ' + name + ' recording stays a picture'); fig.setAttribute('data-state', 'failed'); cond.stop(); });

    function load() {
      if (loaded) return;
      loaded = true;
      video.preload = 'auto';
      video.src = ROOT + 'media/' + name + '.mp4';
      if (times.some(function (t) { return !isFinite(t); })) cuesFrom(name, times, cams, noop);
    }
    function play(i, prev, how) {
      seg = i;
      replay.hidden = true;
      if (i < 0) { player.pause(); player.seek(0); steps.set(-1); return; }
      load();
      fig.setAttribute('data-state', 'story');
      steps.set(i, 0);
      player.play(times[i] || 0, ends(i));
    }
    var cond = Conductor(fig, n, play, function (i) {
      var a = times[i] || 0, b = ends(i);
      return b > a ? (b - a) * 1000 : 4000;
    }, function () { return engaged && !lean(); });
    function engage() {
      if (engaged) return;
      engaged = true;
      ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(function (t) { W.removeEventListener(t, engage, true); });
      if (lean()) return;           // Save-Data: the poster stays until a step is chosen
      load();
      cond.start();
    }
    if (!still()) {
      ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(function (t) { W.addEventListener(t, engage, { capture: true, passive: true }); });
    }
    api.go = function (k) { load(); cond.hold(false); cond.go(k, 'click'); };
    api.step = function () { return cond.cur(); };
    api.video = video;
    return api;
  }

  // A recording: poster first, its source only when it is near, played on screen, paused off it.
  function Recording(fig) {
    var name = fig.getAttribute('data-recording');
    var screen = screenOf(fig);
    var video = fig.querySelector('video');
    if (!video) {
      video = make('video');
      video.preload = 'none';
      screen.appendChild(video);
    }
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.playsInline = true;
    if (video.getAttribute('preload') !== 'none') video.preload = 'none';
    var own = video.getAttribute('data-src'), src = own || ROOT + 'media/' + name + '.mp4', small = '';
    var api = { fig: fig, progress: 0, active: false, ended: false, listeners: [] };
    fig._showcase = api;
    fig.setAttribute('data-state', 'poster');

    var loaded = false, ratio = 0, wanted = false, times = [], cams = [];
    var trackFor = tracks(fig);
    var poster = screen.querySelector('img');
    var steps = Steps(fig.querySelector('[data-steps]'), function (k) { start(times[k] || 0); });
    var n = steps.items.length;
    steps.items.forEach(function (li) {
      times.push(parseFloat(li.getAttribute('data-t')));
      cams.push(readCam(li.getAttribute('data-cam')));
    });
    // The recording's own size, which the camera's points are in: the poster's width and height
    // (1440 × 900), else the video's, where a -sm file is two thirds of the full one.
    function size() {
      var w = poster && +poster.getAttribute('width'), h = poster && +poster.getAttribute('height');
      if (w && h) return [w, h];
      if (video.videoWidth) return small ? [video.videoWidth * 1.5, video.videoHeight * 1.5] : [video.videoWidth, video.videoHeight];
      return [APP_W, APP_H];
    }
    var playBtn = action(fig, 'play', WORDS.play, function () { start(api.ended ? 0 : null); });
    var replayBtn = action(fig, 'replay', WORDS.replay, function () { start(0); });
    function auto() { return !still() && !lean(); }
    function emit() { for (var i = 0; i < api.listeners.length; i++) guard(api.listeners[i], 'list')(api); }

    function load() {
      if (loaded) return;
      loaded = true;
      if (video.getAttribute('preload') === 'none') video.preload = 'metadata';
      // A narrow screen gets the phone-sized encode, media/<name>-sm.mp4 (a fraction of the bytes;
      // data-sm="none" opts out). If it is missing, the error below falls back to the full one.
      var sw = screen.clientWidth;
      small = !own && fig.getAttribute('data-sm') !== 'none' && sw > 0 && sw < NARROW ? ROOT + 'media/' + name + '-sm.mp4' : '';
      video.src = small || src;
      if (times.some(function (t) { return !isFinite(t); })) cuesFrom(name, times, cams, function () { onTime(video.currentTime || 0); });
    }
    function start(from) {
      load();
      api.ended = false;
      playBtn.hidden = true;
      replayBtn.hidden = true;
      fig.setAttribute('data-state', 'playing');
      player.play(from);
    }
    function cueAt(t) {
      var k = 0;
      for (var i = 0; i < n; i++) if (isFinite(times[i]) && t >= times[i] - 0.02) k = i;
      return k;
    }
    function onTime(t) {
      var d = video.duration || 0, k = n ? cueAt(t) : 0;
      if (n) {
        var a = times[k] || 0, b = isFinite(times[k + 1]) ? times[k + 1] : d || a + 1;
        steps.set(k, lin(t, a, b));
      }
      camera(k, t);
      api.progress = api.ended ? 1 : d ? clamp(t / d, 0, 1) : 0;
      emit();
    }
    // The camera (redesign.md §7.6, §7.9): data-camera on the figure, or the older per-cue cams.
    function aim(css, w, h, d) {
      lay(video, css, w, h, d && d[0], d && d[1]);
      lay(poster, css, w, h, d && d[0], d && d[1]);
    }
    function trackView(track, t, w, h, vw, vh) {
      var base = coverBase(w, h, vw, vh), i = 0;
      for (var k = 0; k < track.length; k++) if (t >= track[k].t - 0.02) i = k;
      function zoom(c) { return clamp(keyScale(c, w) / base, 1, CAM_MAX); }
      var c = track[i], p = track[i > 0 ? i - 1 : 0];
      var q = i > 0 ? smooth(t - c.t, 0, CAM_EASE) : 1;
      return camTransform(w, h, vw, vh, mix(zoom(p), zoom(c), q), mix(p.x, c.x, q), mix(p.y, c.y, q));
    }
    function camera(k, t) {
      var w = screen.clientWidth, h = screen.clientHeight, d = size(), track = trackFor(w);
      if (!w || !h) return;
      if (track.length) { aim(trackView(track, t, w, h, d[0], d[1]), w, h, d); return; }
      if (!cams[k] && !(k > 0 && cams[k - 1])) { aim(''); return; }
      var c = cams[k] || WHOLE, p = (k > 0 && cams[k - 1]) || WHOLE;
      var q = smooth(t - (times[k] || 0), 0, 0.9);
      aim(camTransform(w, h, d[0], d[1], mix(p.z, c.z, q), mix(p.x, c.x, q), mix(p.y, c.y, q)), w, h, d);
    }
    // Before it plays (and with reduced motion, until Play), the poster shows the first view.
    function rest() { if (!player.playing()) camera(cueAt(video.currentTime || 0), video.currentTime || 0); }
    function onEnd() {
      api.ended = true;
      api.progress = 1;
      steps.set(n - 1, 1);
      fig.setAttribute('data-state', 'done');
      replayBtn.hidden = false;
      emit();
    }
    var player = Player(video, onTime, onEnd, function () {
      if (!api.ended) fig.setAttribute('data-state', 'paused');
    });
    video.addEventListener('error', function () {
      if (small) {
        warn('no ' + name + '-sm.mp4; the full recording plays instead');
        small = '';
        video.src = src;
        video.load();
        if (api.active && auto()) start(null);
        return;
      }
      warn('the ' + name + ' recording stays a picture');
      fig.setAttribute('data-state', 'failed');
      playBtn.hidden = true;
      replayBtn.hidden = true;
    });
    function pause() {
      if (!player.playing()) return;
      player.pause();
      fig.setAttribute('data-state', 'paused');
    }
    function look() {
      api.active = ratio >= 0.6;
      if (ratio >= 0.6 && !D.hidden) {
        if (wanted) { wanted = false; start(api.ended ? 0 : null); }
        else if (auto() && !api.ended && !player.playing()) start(null);
      } else if (ratio < 0.25 || D.hidden) {
        pause();
      }
      emit();
    }
    if (n) steps.set(0, 0);
    video.addEventListener('loadedmetadata', function () { guard(rest, 'camera')(); });
    afterLoad(function () {
      guard(rest, 'camera')();
      if (W.ResizeObserver) new ResizeObserver(guard(rest, 'camera')).observe(screen);
      else W.addEventListener('resize', guard(rest, 'camera'));
      near(fig, '200px 0px', load);
      watch(screen, [0, 0.25, 0.6], function (e) { ratio = e.isIntersecting ? e.intersectionRatio : 0; look(); });
      if (!auto()) playBtn.hidden = false;
    });
    onShow.push(look);
    // From the sticky list: play it once it is on screen (from the start if it had finished).
    api.focusPlay = function () {
      if (ratio >= 0.6) start(api.ended ? 0 : null);
      else wanted = true;
    };
    api.go = function (k) { start(times[k] || 0); };
    api.video = video;
    return api;
  }

  // A still with a camera (<figure data-camera="0 .75 420 260">, no recording): the first view,
  // the same way a recording's poster gets it, so a crop of the app reads at its real size.
  function Still(fig) {
    var screen = screenOf(fig), img = screen.querySelector('img'), trackFor = tracks(fig);
    if (!img || !trackFor(0).length && !trackFor(1e4).length) return;
    fig._showcase = { fig: fig, still: true };
    function aim() {
      var w = screen.clientWidth, h = screen.clientHeight;
      var vw = +img.getAttribute('width') || img.naturalWidth || APP_W, vh = +img.getAttribute('height') || img.naturalHeight || APP_H;
      var track = trackFor(w);
      if (!w || !h) return;
      if (!track.length) { lay(img, ''); return; }
      var c = track[0], z = clamp(keyScale(c, w) / coverBase(w, h, vw, vh), 1, CAM_MAX);
      lay(img, camTransform(w, h, vw, vh, z, c.x, c.y), w, h, vw, vh);
    }
    aim();
    if (W.ResizeObserver) new ResizeObserver(guard(aim, 'still')).observe(screen);
    else W.addEventListener('resize', guard(aim, 'still'));
  }

  // The sticky list of recordings (redesign.md §7.8): which one is on, and how far it has played.
  function Nav(list) {
    var rows = [], current = null;
    each(list.querySelectorAll('a[href^="#"]'), function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      var t = id && D.getElementById(id);
      if (!t) return;
      var fig = t.matches('[data-recording], [data-showcase]') ? t : t.querySelector('[data-recording], [data-showcase]');
      var c = fig && fig._showcase;
      if (!c) return;
      rows.push({ a: a, li: a.closest('li') || a, c: c, fill: '' });
      if (c.listeners) c.listeners.push(update);
      a.addEventListener('click', guard(function (e) {
        e.preventDefault();
        fig.scrollIntoView({ block: 'center', behavior: still() ? 'auto' : 'smooth' });
        if (!fig.hasAttribute('tabindex')) fig.setAttribute('tabindex', '-1');
        try { fig.focus({ preventScroll: true }); } catch (x) { /* old browsers */ }
        if (c.focusPlay) c.focusPlay();
        if (W.history && history.replaceState) history.replaceState(null, '', '#' + id);
      }, 'nav'));
    });
    function update() {
      var on = null;
      rows.forEach(function (r) { if (!on && r.c.active) on = r; });
      if (on) current = on;
      rows.forEach(function (r) {
        var f = (r.c.progress || 0).toFixed(3);
        if (f !== r.fill) { r.fill = f; r.li.style.setProperty('--fill', f); }
        if (r === current) { r.a.setAttribute('aria-current', 'step'); r.li.setAttribute('data-current', ''); }
        else { r.a.removeAttribute('aria-current'); r.li.removeAttribute('data-current'); }
      });
    }
    update();
  }

  function mount(root) {
    root = root || D;
    each(root.querySelectorAll('[data-showcase]'), function (fig) { if (!fig._showcase) guard(Live, 'scene')(fig); });
    each(root.querySelectorAll('[data-recording]'), function (fig) { if (!fig._showcase) guard(Recording, 'recording')(fig); });
    each(root.querySelectorAll('[data-camera]:not([data-recording]):not([data-showcase])'), function (fig) { if (!fig._showcase) guard(Still, 'still')(fig); });
    each(root.querySelectorAll('[data-showcase-nav]'), function (list) {
      if (list._showcase) return;
      list._showcase = true;
      guard(Nav, 'list')(list);
    });
  }

  W.KlaroShowcase = { mount: mount, get: function (el) { return el && el._showcase; } };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { mount(); });
  else mount();
})();
