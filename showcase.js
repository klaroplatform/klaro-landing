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
                    story (a drawn pointer taps the book, the lecture jumps, the question shows),
                    then the visitor's turn. "steps": each <li> is a step of the scene (<li
                    data-step="n"> picks one). The app is always whole in its screen: there is no
                    camera on a live scene (see "The camera" below). "free": the
                    visitor's turn at once; on a scene with a story, Replay (or a step) plays the
                    whole story on the clock and hands over again. The visitor's turn only
                    exists on study, student-study and student-practice; elsewhere the frame stays
                    read-only.
    data-story      A story by name (default: the scene's own). "none" means no story.
    data-fit        "fill": the frame fills the screen at its own size, in the app's own layout,
                    with no story (data-play defaults to "free"), so the app's text is at its real
                    size. On phones and with Save-Data it stays a poster like any scene, unless
                    data-phone="live" (/try/, where phones get the phone layout). The default
                    draws the app 1440 wide (data-app-width) and as tall as the screen's shape
                    asks, scaled to fit the screen, so it fills a drawn screen whole whatever its
                    shape: nothing cut, no band.
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
                    follows the screen's shape). A product page's frame uses 1000, so the app's
                    text is about 45% larger on the same screen than at 1440.
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
    data-camera="1" The camera (below): how far it walks in before the recording plays.
    data-camera-narrow
                    The same, for a screen narrower than 480px (phones, and the plates of the 768
                    layout). "0" keeps the whole scene there. Without it, data-camera.
    media/<name>-sm.mp4
                    The recording plays its -sm file (960 × 600, H.264, +faststart: about a sixth
                    of the bytes; data-sm="none" opts out) while it is drawn at no more than about
                    960 device pixels across (its screen, times the camera's zoom, times the
                    screen's pixel ratio), and the full one otherwise, or if the -sm is missing.
                    Give the poster a phone source too:
                    srcset="media/<name>-poster-sm.webp 960w, media/<name>-poster.jpg 1440w"
                    sizes="(max-width: 640px) 320px, 1440px".
    A recording is always whole in its screen: site.css contains it (object-fit: contain, at the
    top, centred across) on the app's own page colour, so a drawn screen that isn't 16:10 shows a
    strip of that colour under the app, never a cut. Nothing zooms inside a screen.
    The source is set only after the visitor's first scroll, tap or key, and once the video comes
    within 200px of the screen, so a page that opens on a recording shows its poster and fetches
    nothing more until then. It plays when 60% of it is on screen and pauses when it leaves. With
    reduced motion or Save-Data it waits for Play. The poster may be another moment of the
    recording (the quiz's poster is the finished homework): the video fades in over it once it
    has a frame.
    A live scene loads its app only after the page's load event, once it is within a quarter of a
    screen of view. During the visitor's turn the app takes a pointer at once, but the keyboard and
    screen readers skip it until the visitor taps in it or presses "Use the sample app with the
    keyboard" (a button that shows when it has focus), so a keyboard doesn't wade through its ~50
    stops to reach the page.

  ── The camera (the owner's call, 2026-10-09) ───────────────────────────────────────────────

    It never zooms inside a screen. It moves the whole picture, the scene plate with its drawn
    device and the app in it, inside the plate's own frame, like a camera walking up to the desk.
    The frame stays where it is and clips; the drawn screen (with a little of its bezel) always
    stays in view, so the app is never cut.

    data-camera="amount [fx fy]"
                    amount: 0 is the whole scene, 1 is the drawn screen plus a little bezel filling
                    the frame (about 2× on the laptop plates at 1440, about 1.5× on a phone, where
                    the plates are already cropped round the device); never more. fx fy (0–1,
                    default .5 .5): the point of the screen to lean towards, as far as the whole
                    screen allows.
    A walk is one scale about one fixed point of the frame, so the picture moves one way only, in a
    straight line, leaving and landing at rest (--ease-camera; --dur-camera in, --dur-camera-out
    back out, in site.css). It runs on the compositor, and nothing changes under it: it waits for
    the plate's picture, and a recording starts only once the camera has landed.
    A recording: the poster rests on the whole scene. When the recording is about to play, the
    camera walks in and the video starts once it is there; it holds while the recording plays (the
    recordings have their own zooms inside the app, so the camera stays still meanwhile), and a
    moment after the end it walks back out to the whole scene.
    A still (a figure with data-camera and an <img>, no recording): the camera walks in once, when
    the still is well on screen, and stays. The frame is the figure's .plate--device, or the
    .pr-shot-field of a device on a plain field; a frame where the screen already fills most of the
    picture (the push would be under 1.12×) doesn't move. With reduced motion the camera never
    moves. A live scene has no camera.

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
    .plate--device, .pr-shot-field
                      the camera's frame: its children get an inline transform while it is in.
    video[data-shown] a recording's video once it has a frame (site.css fades it in over the poster).
    [data-screen]     gets .show-cam > iframe.show-frame, .show-cursor (a drawn pointer and its tap)
                      and .show-hint > .show-hint-ring (the "your turn" ring: style it in site.css),
                      or video.show-video (the phone recording).
    [data-action="play"|"replay"]
                      The script toggles their hidden attribute, and creates them if they are
                      missing (inside [data-actions], or at the end of the figure).
    [data-after-tap]  Unhidden after the visitor's first tap in the app.

  With reduced motion there is no story, no clock, no autoplay and no camera. A live study scene is
  handed to the visitor at once, and recordings wait for Play. If JavaScript is off or the frame
  fails, the poster and the words stay.

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
  // A screen needs a positioned box that clips, in the app's shape. site.css should give it that;
  // this only fills in what is missing.
  function boxIn(screen) {
    var cs = W.getComputedStyle(screen);
    if (cs.position === 'static') screen.style.position = 'relative';
    if (cs.overflow === 'visible') screen.style.overflow = 'hidden';
    if (!screen.clientHeight) screen.style.aspectRatio = APP_W + ' / ' + APP_H;
  }
  // The motion tokens in site.css (:root), so the camera and the CSS keep one system: how long the
  // camera walks in (--dur-camera) and back out (--dur-camera-out), and its curve (--ease-camera,
  // which the hero's pointer glides on too), read once they are needed.
  var TOKENS = null;
  function tokens() {
    if (TOKENS) return TOKENS;
    var cs = null;
    try { cs = W.getComputedStyle(HTML); } catch (e) { /* no styles: the defaults below */ }
    function tok(name, dflt) { var v = cs && cs.getPropertyValue(name).trim(); return v || dflt; }
    function ms(name, dflt) {
      var d = tok(name, ''), v = /ms$/.test(d) ? parseFloat(d) : parseFloat(d) * 1000;
      return isFinite(v) && v > 0 ? v : dflt;
    }
    var travel = tok('--ease-camera', '');
    if (!/^cubic-bezier\(\s*[\d.]+\s*,\s*-?[\d.]+\s*,\s*[\d.]+\s*,\s*-?[\d.]+\s*\)$/.test(travel)) travel = 'cubic-bezier(.65, 0, .35, 1)';
    TOKENS = {
      camera: ms('--dur-camera', 2200),
      cameraOut: ms('--dur-camera-out', 1800),
      slow: ms('--dur-slow', 600),
      travelCss: travel,
      travel: bezier(travel),
      inout: bezier(tok('--ease-inout', 'cubic-bezier(.37, 0, .63, 1)'))
    };
    return TOKENS;
  }
  // A CSS cubic-bezier() as a function of time (0–1): x is solved by Newton's method, with
  // bisection when that doesn't settle.
  function bezier(css) {
    var m = /cubic-bezier\(([^)]*)\)/.exec(css || ''), p = m ? m[1].split(',').map(parseFloat) : [];
    if (p.length !== 4 || !p.every(isFinite)) p = [0.37, 0, 0.63, 1];
    function coef(a1, a2) { var c = 3 * a1, b = 3 * (a2 - a1) - c; return [1 - c - b, b, c]; }
    var X = coef(p[0], p[2]), Y = coef(p[1], p[3]);
    function at(k, t) { return ((k[0] * t + k[1]) * t + k[2]) * t; }
    function slope(t) { return (3 * X[0] * t + 2 * X[1]) * t + X[2]; }
    return function (x) {
      if (!(x > 0)) return 0;
      if (x >= 1) return 1;
      var t = x, i, d;
      for (i = 0; i < 6; i++) {
        d = slope(t);
        if (Math.abs(d) < 1e-6) break;
        t -= (at(X, t) - x) / d;
      }
      if (!(t >= 0 && t <= 1) || Math.abs(at(X, t) - x) > 1e-4) {
        var lo = 0, hi = 1;
        for (i = 0, t = x; i < 32; i++) { if (at(X, t) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      }
      return at(Y, t);
    };
  }

  // A screen narrower than this uses the figure's data-camera-narrow (when it has one) and the
  // recording's -sm file: phones, and the plates of the 768 layout.
  var NARROW = 480;
  // data-camera="amount [fx fy]" (the top of this file). 0, or nothing, is no camera.
  function readPush(text, fig) {
    var v = (text || '').trim().split(/[\s,]+/).map(parseFloat);
    if (!isFinite(v[0])) return null;
    if (v.length > 3 || /;/.test(text)) {
      warn('data-camera is "amount fx fy" now (the camera moves the whole plate)', fig && (fig.getAttribute('data-recording') || fig.id));
      return null;
    }
    var a = clamp(v[0], 0, 1);
    return a > 0 ? { a: a, fx: isFinite(v[1]) ? clamp(v[1], 0, 1) : 0.5, fy: isFinite(v[2]) ? clamp(v[2], 0, 1) : 0.5 } : null;
  }
  function pushOf(fig) {
    var wide = readPush(fig.getAttribute('data-camera'), fig), has = fig.hasAttribute('data-camera-narrow');
    var narrow = has ? readPush(fig.getAttribute('data-camera-narrow'), fig) : null;
    return function (sw) { return has && sw < NARROW ? narrow : wide; };
  }

  /*
    The camera (the top of this file): the whole picture moves inside its frame, never the app
    inside its screen. One transform, one timeline, one curve:
    - The frame's children (the plate's picture and the device, with the app in it) are all scaled
      about the same point P of the frame (each gets transform-origin P minus its own place in the
      frame), so they move as one picture: the frame's point q is drawn at P + z·(q − P).
    - P comes from the view at the end of the walk (the drawn screen and a little bezel in view, the
      picture filling the frame, leaning towards fx fy). It is set before the walk starts and never
      changes during it, and the walk back out scales about the same P. Only z moves, from rest to
      rest on --ease-camera, so every point of the picture travels in a straight line, one way,
      leaving and landing at zero speed. Each view on the way holds the next one, so the screen
      never leaves the frame and the picture never shows its edge.
    - It runs on the compositor (Web Animations), so a busy page (the live app, a video starting)
      can't make it stutter, and the browser draws the picture sharp at its largest size.
    - Nothing changes under it: a walk waits for the plate's picture (its arrival changes the
      screen's box, site.css .is-drawn), and the recording starts once the walk-in has landed.
    The frame keeps its own overflow and corners, and clips.
  */
  var BEZEL = 0.03, WORTH = 1.12, REST = { z: 1, x: 0, y: 0 };
  function Camera(fig, screen) {
    var stage = fig.querySelector('.plate--device') || fig.querySelector('.pr-shot-field');
    if (!stage || !screen || !stage.contains(screen)) return null;
    // pose: where the camera stands, or is walking to ({ z, x, y }: the zoom and its point P).
    // pivot: the P in use while it is in. aim: the push it is at or walking to. walk: the walk under
    // way. pend: a walk waiting for the plate's picture (only the first walk ever waits).
    var g = null, pose = REST, pivot = null, aim = null, walk = null, anims = [], pend = null, waited = false, stale = false;

    // The frame's size, the drawn screen's box in it and each child's place, in the frame's own px
    // with the camera at rest, measured through a scaled ancestor (a covered stack card).
    function measure() {
      var F = stage.getBoundingClientRect(), k = stage.offsetWidth ? F.width / stage.offsetWidth : 1;
      if (!F.width || !F.height || !k) return null;
      function box(el) {
        var r = el.getBoundingClientRect();
        return { x: (r.left - F.left) / k, y: (r.top - F.top) / k, w: r.width / k, h: r.height / k };
      }
      var w = F.width / k, h = F.height / k, s = box(screen), b = BEZEL * s.w;
      var x0 = Math.max(0, s.x - b), y0 = Math.max(0, s.y - b), x1 = Math.min(w, s.x + s.w + b), y1 = Math.min(h, s.y + s.h + b);
      var top = Math.min(w / (x1 - x0), h / (y1 - y0));
      var parts = [];
      each(stage.children, function (el) { var o = box(el); parts.push({ el: el, x: o.x, y: o.y }); });
      return { w: w, h: h, s: s, x0: x0, y0: y0, x1: x1, y1: y1, top: top >= WORTH ? top : 1, parts: parts };
    }
    // Takes the camera off the picture (its animations and inline styles), so it can be measured.
    function bare() {
      anims.forEach(function (a) { a.cancel(); });
      anims = [];
      if (g) g.parts.forEach(function (p) { p.el.style.transform = p.el.style.transformOrigin = ''; });
    }
    // Measures again, at rest, and stands where `push` puts the camera on the frame as it is now.
    function fresh(push) {
      bare();
      g = measure();
      stand(poseOf(push));
    }
    function geo() {
      if (!g && !walk) fresh(aim);
      return g;
    }
    // On one axis: the view's centre at zoom z leans towards `want` as far as the range that keeps
    // the screen (a0–a1) in view and the picture filling the frame (len) allows. The point that a
    // scale of z about it puts at that centre, (c·z − len/2) / (z − 1), is always inside the frame.
    function pivotOn(z, len, a0, a1, want) {
      var half = len / z / 2, lo = Math.max(a1 - half, half), hi = Math.min(a0 + half, len - half);
      var c = hi > lo ? clamp(want, lo, hi) : (lo + hi) / 2;
      return clamp((c * z - len / 2) / (z - 1), 0, len);
    }
    // A push (data-camera) as a pose on this frame now.
    function poseOf(push) {
      var G = g;
      if (!push || !G || G.top <= 1) return REST;
      var z = 1 + push.a * (G.top - 1);
      if (z <= 1.0005) return REST;
      return { z: z, x: pivotOn(z, G.w, G.x0, G.x1, G.s.x + push.fx * G.s.w), y: pivotOn(z, G.h, G.y0, G.y1, G.s.y + push.fy * G.s.h) };
    }
    function origin(p, P) { return (P.x - p.x).toFixed(2) + 'px ' + (P.y - p.y).toFixed(2) + 'px'; }
    function scale(z) { return 'scale(' + z.toFixed(5) + ')'; }
    // Stands at pose v at once.
    function stand(v) {
      pose = v;
      pivot = v.z > 1 ? v : null;
      if (!g) return;
      g.parts.forEach(function (p) {
        p.el.style.transformOrigin = pivot ? origin(p, pivot) : '';
        p.el.style.transform = pivot ? scale(v.z) : '';
      });
    }
    // The zoom as drawn now, in the middle of a walk too.
    function zNow() {
      if (!walk || !g || !g.parts.length) return pose.z;
      var m = /^matrix\(\s*([-\d.e]+)/.exec(W.getComputedStyle(g.parts[g.parts.length - 1].el).transform || '');
      var z = m ? parseFloat(m[1]) : NaN;
      return isFinite(z) && z > 0 ? z : pose.z;
    }
    function land() {
      var w = walk;
      walk = null;
      anims.forEach(function (a) { a.cancel(); });
      anims = [];
      stand(w.to);
      // The frame changed size during the walk: stand where it should be on the new one.
      if (stale) { stale = false; fresh(aim); }
      if (w.fn) w.fn();
    }
    // The plate's picture changes the screen's box when it arrives (site.css, .is-drawn) and fades
    // in over the CSS frame (--dur-slow), so a walk waits for both: drawn, missing, or never coming
    // (no --drawn: 1), or 3 s at most.
    function settled() {
      if (!stage.classList.contains('plate--device') || /\bis-(drawn|missing)\b/.test(stage.className)) return true;
      return W.getComputedStyle(stage).getPropertyValue('--drawn').trim() !== '1';
    }
    function whenSettled(fn) {
      var mo = W.MutationObserver ? new MutationObserver(check) : null, t = setTimeout(go, 3000), gone = false;
      if (mo) mo.observe(stage, { attributes: true, attributeFilter: ['class'] });
      function check() { if (settled()) go(); }
      function go() {
        if (gone) return;
        gone = true;
        clearTimeout(t);
        if (mo) mo.disconnect();
        // The picture's fade, and the new layout (and the refit it brings), before the walk measures.
        setTimeout(function () { requestAnimationFrame(function () { requestAnimationFrame(guard(fn, 'camera')); }); }, tokens().slow);
      }
    }
    function samePoint(a, b) { return Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5; }
    function samePush(a, b) { return a === b || !!(a && b && a.a === b.a && a.fx === b.fx && a.fy === b.fy); }
    // Walks to `push` (null: the whole scene) and calls fn when it is there; at once if it is.
    function go(push, fn) {
      if (still()) { walk = pend = aim = null; fresh(null); if (fn) fn(); return; }
      if (walk && samePush(walk.push, push)) { walk.fn = fn; return; }
      if (pend || (!waited && !settled())) {
        var first = !pend;
        pend = { push: push, fn: fn };
        if (first) whenSettled(function () { var p = pend; pend = null; waited = true; if (p) go(p.push, p.fn); });
        return;
      }
      aim = push;
      var z0 = zNow(), from = pivot;
      if (walk) { walk.fn = null; anims.forEach(function (a) { a.cancel(); }); anims = []; walk = null; }
      else { bare(); g = measure(); }
      if (!g) { if (fn) fn(); return; }
      var to = poseOf(push);
      // In, about the new point; out (or back), about the one in use.
      var P = to.z > 1 ? to : from;
      if (!P || (from && z0 > 1.0005 && to.z > 1 && !samePoint(from, to))) {
        // Nothing to walk, or another push while in (the frame crossed the narrow width): stand.
        stand(to);
        if (fn) fn();
        return;
      }
      if (Math.abs(to.z - z0) < 0.002) { stand(to); if (fn) fn(); return; }
      var T = tokens(), full = Math.abs((to.z > 1 ? to.z : from.z) - 1) || 1;
      var ms = (to.z > z0 ? T.camera : T.cameraOut) * clamp(Math.abs(to.z - z0) / full, 0.4, 1);
      // The end, inline, under the animation; the animation draws the way there.
      pose = to;
      pivot = P;
      g.parts.forEach(function (p) {
        p.el.style.transformOrigin = origin(p, P);
        p.el.style.transform = scale(to.z);
      });
      var mine = walk = { push: push, fn: fn, to: to };
      try {
        anims = g.parts.map(function (p) {
          return p.el.animate([{ transform: scale(z0) }, { transform: scale(to.z) }], { duration: ms, easing: T.travelCss, fill: 'both' });
        });
      } catch (e) { anims = []; }
      if (!anims.length || !anims[0]) { land(); return; }
      // One clock for every part: they start on the same frame.
      var t0 = D.timeline && D.timeline.currentTime;
      if (t0 != null) anims.forEach(function (a) { a.startTime = t0; });
      anims[0].onfinish = guard(function () { if (walk === mine) land(); }, 'camera');
    }
    // A new size (or a layout that settled): measure again and stand where the camera should be on
    // the new frame. In the middle of a walk, the walk lands first.
    function refit() {
      if (walk) { stale = true; return; }
      fresh(aim);
    }
    // The frame, and the screen in it: the screen grows when the drawn picture arrives and the CSS
    // frame's bar goes (site.css, .is-drawn), inside a frame that keeps its size.
    if (W.ResizeObserver) { var ro = new ResizeObserver(guard(refit, 'camera')); ro.observe(stage); ro.observe(screen); }
    else W.addEventListener('resize', guard(refit, 'camera'));
    return {
      go: go,
      // How far a push zooms on this frame now (1: it doesn't move).
      zoom: function (push) { if (still()) return 1; geo(); return poseOf(push).z || 1; }
    };
  }

  // Cue times from media/<name>.json, for the <li> that don't carry their own.
  function cuesFrom(name, times, done) {
    if (!W.fetch) return;
    fetch(ROOT + 'media/' + name + '.json').then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (meta) {
      var cues = (meta && meta.cues) || [];
      if (cues.length !== times.length) warn('the cues of ' + name + ' don’t match its list', cues.length + ' cues, ' + times.length + ' items');
      for (var k = 0; k < times.length; k++) {
        if (!isFinite(times[k]) && cues[k] && isFinite(+cues[k].t)) times[k] = +cues[k].t;
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
    Stories: Omar's hero.js, without its camera (the owner, 2026-10-09: nothing zooms inside a
    screen). The whole app stays in view; a drawn pointer taps the book, the lecture jumps and the
    question shows, each at its own calm pace. Every point is found in the app with `measure`
    (showcase.md §2.1), so it also works in Arabic, where the panes mirror. `px` are Omar's English
    pixels, used only when a target can't be measured (mirrored in Arabic). The book page is a PDF
    and never mirrors, so points inside it are fractions of the page.
  */
  var STORIES = {
    study: {
      shown: { selector: '[data-book-page="2"] .textLayer span' },
      targets: {
        page: { selector: '[data-book-page="2"]' }
      },
      points: {
        tap: { from: 'page', at: [0.545, 0.318], px: [205, 392] },     // "Parts every cell has"
        hint: { from: 'page', at: [0.53, 0.51], px: [200, 470] }       // "The cell membrane"
      },
      beats: [
        { // A passage of the book is tapped (the app points at it, as a click would): the pointer
          // glides in, rests, taps, and fades.
          ms: 3200,
          enter: function (S) { S.tell({ free: false, scrub: false, step: 0 }); S.measure(); },
          draw: function (S, q) {
            var t = S.point('tap'), g = S.glide(lin(q, 0.1, 0.6));
            S.cursor(mix(t.x + S.dir * 220, t.x, g), mix(t.y + 150, t.y, g), S.ease(lin(q, 0.04, 0.2)) * (1 - S.ease(lin(q, 0.86, 1))));
            S.ripple(lin(q, 0.66, 0.94));
            if (q >= 0.66) S.once('point', function () { S.tell({ step: 1 }); });
          }
        },
        { // The lecture jumps to that moment and plays the explanation (scrubbed, 113 s to 163 s).
          ms: 4200,
          enter: function (S) { S.cursor(0, 0, 0); S.tell({ step: 1 }); S.tell({ step: 2, scrub: true }); S.time(113, true); S.measure(); },
          draw: function (S, q) { S.time(113 + 50 * lin(q, 0.1, 1)); }
        },
        { // The past-paper question on that passage, beside it.
          ms: 3000,
          enter: function (S) { S.tell({ step: 2, scrub: true }); S.measure(); },
          draw: noop
        },
        { // The study view is the visitor's.
          ms: 800,
          enter: function (S) { S.tell({ step: 2 }); },
          draw: noop,
          end: function (S) { S.handOver(); }
        }
      ]
    }
  };
  // Before the first step: the app as it opened.
  var INTRO = {
    ms: 700,
    enter: function (S) { S.tell({ free: false, scrub: false, step: 0 }); S.cursor(0, 0, 0); },
    draw: noop
  };
  // "steps": each <li> is a step of the scene.
  function stepBeats(items) {
    return items.map(function (li, k) {
      var s = parseInt(li.getAttribute('data-step'), 10);
      if (!isFinite(s)) s = k;
      return {
        ms: 3000,
        enter: function (S) { S.tell({ step: s }); },
        draw: noop
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
    // A frame at its own size has no story.
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
    // The app's own size in the frame (data-app-width, 1440 by default; the height follows the
    // screen's shape, see fit()). Narrower draws the app larger on a small screen while it keeps
    // its three panes (they need about 1000px).
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
    var Wd = 0, Ht = 0, base = 1;
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
            placeHint();
          });
        }, d);
      });
    }
    function point(name) {
      var p = story && story.points[name];
      if (!p) return { x: AW / 2, y: AH / 2 };
      var r = rects[p.from];
      if (r && r.w > 0) return { x: r.x + p.at[0] * r.w, y: r.y + p.at[1] * r.h };
      return { x: dir < 0 ? AW - p.px[0] : p.px[0], y: p.px[1] };
    }

    // The app in its screen, whole: drawn AW wide and as tall as the screen's shape asks (a drawn
    // screen on a plate is not exactly 16:10), then scaled to fit, so nothing is cut and there is no
    // band. There is no camera inside the screen (the owner, 2026-10-09).
    function fit() {
      Wd = screen.clientWidth;
      Ht = screen.clientHeight || Math.round(Wd * AH / AW);
      if (!fill && Wd && Ht) {
        var ah = clamp(Math.round(AW * Ht / Wd), Math.round(AW * 0.5), Math.round(AW * 0.8));
        if (ah !== AH) {
          AH = ah;
          if (camEl) { camEl.style.height = AH + 'px'; frame.style.height = AH + 'px'; }
          if (talking) remeasure();
        }
      }
      base = Math.min(Wd / AW, Ht / AH) || 1;
      if (camEl && !fill) camEl.style.transform = 'translate(' + ((Wd - AW * base) / 2).toFixed(2) + 'px,0) scale(' + base.toFixed(5) + ')';
      placeHint();
    }
    // Puts an overlay (the pointer, the hint ring) on the app's point x, y.
    function at(el, x, y) {
      el.style.transform = 'translate(' + ((Wd - AW * base) / 2 + x * base).toFixed(1) + 'px,' + (y * base).toFixed(1) + 'px)';
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
      ease: function (q) { return tokens().inout(q); },
      // The pointer travels on the camera's curve (--ease-camera): it leaves and lands at rest.
      glide: function (q) { return tokens().travel(q); },
      cursor: function (x, y, o) {
        if (!cursor) return;
        cursor.style.opacity = o > 0.001 ? o.toFixed(3) : '0';
        if (o > 0.001) at(cursor, x, y);
      },
      // The tap: a soft ring that opens and fades (eased, no snap).
      ripple: function (q) {
        if (!tapEl) return;
        var e = tokens().inout(q);
        tapEl.style.transform = 'scale(' + (0.5 + 1.1 * e).toFixed(3) + ')';
        tapEl.style.opacity = q > 0 && q < 1 ? (0.9 * (1 - e)).toFixed(3) : '0';
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
        beats[k].draw(S, 1);
      }
      var b = i < 0 ? INTRO : beats[i];
      once = {};
      b.enter(S);
      steps.set(i, 0);
      if (how === 'instant' || still()) { b.draw(S, 1); steps.set(i, 1); finish(i); return; }
      bi = i;
      t0 = now();
      raf = requestAnimationFrame(loop);
    }
    function loop() {
      raf = 0;
      if (dead) return;
      var b = bi < 0 ? INTRO : beats[bi];
      var q = clamp((now() - t0) / b.ms, 0, 1);
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
      // The app fades in once it has drawn, on the site's slow UI curve (site.css motion tokens).
      var fade = ';opacity:0;pointer-events:none;transition:opacity var(--dur-slow, .6s) var(--ease-ui, ease-out)';
      camEl = make('div', 'show-cam', fill
        ? 'position:absolute;top:0;left:0;width:100%;height:100%' + fade
        : 'position:absolute;top:0;left:0;width:' + AW + 'px;height:' + AH + 'px;transform-origin:0 0' + fade);
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

    var engaged = false, loaded = false, seg = -1, times = [];
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
      if (times.some(function (t) { return !isFinite(t); })) cuesFrom(name, times, noop);
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

  // The visitor's first scroll, tap or key. A recording waits for it before it fetches or plays,
  // so a page that opens with one in view (a product page's hero) costs only its poster, and
  // shows it, until the visitor does something (qa.md S4).
  var touched = false, onTouch = [];
  var TOUCH = ['scroll', 'wheel', 'pointerdown', 'keydown', 'touchstart'];
  function firstTouch(fn) { if (touched) fn(); else onTouch.push(fn); }
  function touch() {
    if (touched) return;
    touched = true;
    TOUCH.forEach(function (t) { W.removeEventListener(t, touch, true); });
    onTouch.splice(0).forEach(function (fn) { guard(fn, 'touch')(); });
  }
  TOUCH.forEach(function (t) { W.addEventListener(t, touch, { capture: true, passive: true }); });

  // The phone-sized encode is 960 wide: a recording plays it only while it is drawn at no more
  // device pixels than that (its screen, contained, times the camera's zoom, times the screen's
  // pixel ratio), so a short laptop window or a 3× phone gets the full file (qa.md R1, S12).
  var SM_W = 960;

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

    var loaded = false, ratio = 0, wanted = false, times = [];
    // The camera (the top of this file): it walks up to the screen before the recording plays and
    // back out after it ends. `want` counts the starts, so a walk-in that finishes after the
    // visitor has scrolled away (or chosen another cue) doesn't start anything.
    var cam = Camera(fig, screen), pushFor = pushOf(fig), want = 0, out = 0;
    var poster = screen.querySelector('img');
    // The video fades in over the poster once it has a frame (site.css: video[data-shown]), so the
    // start is never a cut, even where the poster is another moment of the recording.
    ['playing', 'seeked'].forEach(function (type) {
      video.addEventListener(type, function () { if (video.readyState >= 2) video.setAttribute('data-shown', ''); });
    });
    var steps = Steps(fig.querySelector('[data-steps]'), function (k) { start(times[k] || 0); });
    var n = steps.items.length;
    steps.items.forEach(function (li) { times.push(parseFloat(li.getAttribute('data-t'))); });
    var playBtn = action(fig, 'play', WORDS.play, function () { start(api.ended ? 0 : null); });
    var replayBtn = action(fig, 'replay', WORDS.replay, function () { start(0); });
    function auto() { return !still() && !lean(); }
    function emit() { for (var i = 0; i < api.listeners.length; i++) guard(api.listeners[i], 'list')(api); }

    function load() {
      if (loaded) return;
      loaded = true;
      if (video.getAttribute('preload') === 'none') video.preload = 'metadata';
      // The phone-sized encode, media/<name>-sm.mp4 (a fraction of the bytes; data-sm="none" opts
      // out), when it is sharp enough where it is drawn (SM_W). If it is missing, the error below
      // falls back to the full one.
      var sw = screen.clientWidth, sh = screen.clientHeight, pw = poster && +poster.getAttribute('width'), ph = poster && +poster.getAttribute('height');
      var drawn = Math.min(sw, sh * (pw && ph ? pw / ph : APP_W / APP_H)) * (cam ? cam.zoom(pushFor(sw)) : 1) * (W.devicePixelRatio || 1);
      small = !own && fig.getAttribute('data-sm') !== 'none' && drawn > 0 && drawn <= SM_W * 1.1 ? ROOT + 'media/' + name + '-sm.mp4' : '';
      video.src = small || src;
      if (times.some(function (t) { return !isFinite(t); })) cuesFrom(name, times, function () { onTime(video.currentTime || 0); });
    }
    function start(from) {
      load();
      api.ended = false;
      playBtn.hidden = true;
      replayBtn.hidden = true;
      clearTimeout(out);
      fig.setAttribute('data-state', 'playing');
      var my = ++want, push = cam && pushFor(screen.clientWidth);
      if (!push) { player.play(from); return; }
      // The poster (or the frame at the chosen cue) waits while the camera walks in, and the video
      // starts once it has landed. A cue's frame is found (and faded in) before the camera moves,
      // so nothing changes under the walk.
      var walk = function () { if (my === want) cam.go(push, function () { if (my === want) player.play(from); }); };
      if (from != null && isFinite(from)) { player.seek(from); landed(from, walk); } else walk();
    }
    function landed(from, fn) {
      var shown = video.hasAttribute('data-shown'), t = 0, ok = false;
      function done() {
        if (ok) return;
        ok = true;
        clearTimeout(t);
        video.removeEventListener('seeked', done);
        setTimeout(fn, !shown && video.hasAttribute('data-shown') ? tokens().slow : 0);
      }
      // No seek under way, or none coming (no data yet and the start is 0): go now.
      if (!video.seeking && (video.readyState >= 1 || !(from > 0))) { fn(); return; }
      video.addEventListener('seeked', done);
      t = setTimeout(done, 1500);
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
      api.progress = api.ended ? 1 : d ? clamp(t / d, 0, 1) : 0;
      emit();
    }
    function onEnd() {
      api.ended = true;
      api.progress = 1;
      steps.set(n - 1, 1);
      fig.setAttribute('data-state', 'done');
      replayBtn.hidden = false;
      emit();
      // A moment on the last frame, then back out to the whole scene.
      if (cam) out = setTimeout(function () { if (api.ended) cam.go(null); }, 1200);
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
      want++;
      if (!player.playing()) {
        // Still walking in: it won't start the recording now.
        if (fig.getAttribute('data-state') === 'playing') fig.setAttribute('data-state', 'paused');
        return;
      }
      player.pause();
      fig.setAttribute('data-state', 'paused');
    }
    function look() {
      api.active = ratio >= 0.6;
      if (ratio >= 0.6 && !D.hidden) {
        if (wanted) { wanted = false; start(api.ended ? 0 : null); }
        else if (auto() && touched && !api.ended && !player.playing()) start(null);
      } else if (ratio < 0.25 || D.hidden) {
        pause();
      }
      emit();
    }
    if (n) steps.set(0, 0);
    afterLoad(function () {
      near(fig, '200px 0px', function () { firstTouch(load); });
      firstTouch(look);
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

  // A still with a camera (data-camera on a figure with an <img> on a plate, no recording): the
  // camera walks in once, when the still is well on screen, and stays. With reduced motion, never.
  function Still(fig) {
    var screen = screenOf(fig), cam = Camera(fig, screen), pushFor = pushOf(fig);
    if (!cam) return;
    fig._showcase = { fig: fig, still: true };
    var gone = false;
    afterLoad(function () {
      var io = watch(screen, [0.6], function (e) {
        if (gone || still() || !e.isIntersecting || e.intersectionRatio < 0.6) return;
        gone = true;
        io.disconnect();
        setTimeout(function () { cam.go(pushFor(screen.clientWidth)); }, 500);
      });
    });
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
