// The hero: the real app (showcase) plays the opening story by itself, then hands the study view
// to the visitor with one hint. Phones get a full-screen "Try it" in the app's own phone layout.
(() => {
  const APP_W = 1440, APP_H = 900;
  const LENGTH = 16000;                     // the opening story, in ms
  const CLIP_START = 113, CLIP_SPAN = 50;   // the lecture's explanation of "Parts every cell has"
  const HINT_AT = { x: 200, y: 470 };       // the passage "The cell membrane", in app pixels

  const screen = document.getElementById('screen');
  const cam = document.getElementById('cam');
  const frame = document.getElementById('app');
  const cursor = document.getElementById('cursor');
  const tap = document.getElementById('tap');
  const hint = document.getElementById('hint');
  const caption = document.getElementById('caption');
  const replay = document.getElementById('replay');
  const tryit = document.getElementById('tryit');
  const sheet = document.getElementById('sheet');
  const phone = matchMedia('(max-width: 900px)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lin = (p, a, b) => clamp((p - a) / (b - a));
  const sm = (p, a, b) => { const x = lin(p, a, b); return x * x * (3 - 2 * x); };
  const mix = (a, b, t) => a + (b - a) * t;

  // The camera over the app: zoom and the app point at the centre, between keyframes.
  const KEYS = [
    { p: 0.00, z: 1, x: 720, y: 450 },
    { p: 0.08, z: 1, x: 720, y: 450 },
    { p: 0.20, z: 2.1, x: 215, y: 395 },   // the passage "Parts every cell has"
    { p: 0.25, z: 2.1, x: 215, y: 395 },
    { p: 0.31, z: 1.9, x: 700, y: 470 },   // the lecture
    { p: 0.58, z: 2.0, x: 700, y: 470 },
    { p: 0.66, z: 2.3, x: 1228, y: 420 },  // the question linked to that passage
    { p: 0.81, z: 2.3, x: 1228, y: 420 },
    { p: 0.92, z: 1, x: 720, y: 450 },     // book, lecture and questions together
    { p: 1.00, z: 1, x: 720, y: 450 },
  ];
  const LINES = [
    [0.10, 'Tap any passage in your book.'],
    [0.27, 'Your tutor’s lecture jumps to that moment…'],
    [0.33, '…and explains exactly that passage.'],
    [0.60, 'The past-paper question on it is right there.'],
  ];

  function camera(p) {
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const a = KEYS[i], b = KEYS[i + 1], t = sm(p, a.p, b.p);
    return { z: mix(a.z, b.z, t), x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) };
  }

  let base = 1, W = 0, H = 0, cur = { z: 1, x: 720, y: 450 };
  function view(c) {
    const s = base * c.z;
    return { s, tx: clamp(W / 2 - c.x * s, W - APP_W * s, 0), ty: clamp(H / 2 - c.y * s, H - APP_H * s, 0) };
  }
  function place(c) {
    cur = c;
    const v = view(c);
    cam.style.transform = 'translate(' + v.tx + 'px,' + v.ty + 'px) scale(' + v.s + ')';
    return v;
  }
  function fit() {
    W = screen.clientWidth; base = W / APP_W; H = Math.round(APP_H * base);
    screen.style.height = H + 'px';
    const v = place(cur);
    hint.style.transform = 'translate(' + (v.tx + HINT_AT.x * v.s) + 'px,' + (v.ty + HINT_AT.y * v.s) + 'px)';
  }

  // Talking to the app in the frame (apps/web/src/showcase).
  let ready = false;
  const tell = (msg) => ready && frame.contentWindow.postMessage(Object.assign({ type: 'klaro-showcase' }, msg), location.origin);

  let line = '';
  function say(text) {
    if (text === line) return;
    line = text;
    caption.style.opacity = 0;
    setTimeout(() => { caption.textContent = text; caption.style.opacity = 1; }, 180);
  }

  // The opening story, frame by frame on the clock.
  let start = 0, raf = 0, step = -1, lastTime = -1;
  function frameAt(now) {
    const p = clamp((now - start) / LENGTH);
    const v = place(camera(p));
    const glide = sm(p, 0.11, 0.20);
    const ax = mix(1150, 205, glide), ay = mix(760, 392, glide);
    cursor.style.transform = 'translate(' + (v.tx + ax * v.s) + 'px,' + (v.ty + ay * v.s) + 'px)';
    cursor.style.opacity = sm(p, 0.10, 0.125) * (1 - sm(p, 0.255, 0.285));
    const q = lin(p, 0.205, 0.25);
    tap.style.transform = 'scale(' + (0.3 + 2.2 * q) + ')';
    tap.style.opacity = q > 0 && q < 1 ? 1 - q : 0;

    const s = p >= 0.27 ? 2 : p >= 0.205 ? 1 : 0;
    if (s !== step) { step = s; tell({ step: s, scrub: s === 2 }); }
    if (s === 2) {
      const t = CLIP_START + CLIP_SPAN * lin(p, 0.31, 0.58);
      if (Math.abs(t - lastTime) > 0.04) { lastTime = t; tell({ time: t }); }
    }
    let text = '';
    for (const [at, words] of LINES) if (p >= at) text = words;
    say(text);

    if (p < 1) raf = requestAnimationFrame(frameAt);
    else handOver();
  }

  function play() {
    cancelAnimationFrame(raf);
    screen.classList.remove('free');
    hint.classList.remove('on');
    replay.hidden = true; tryit.hidden = true;
    tell({ free: false });
    step = -1; lastTime = -1;
    start = performance.now();
    raf = requestAnimationFrame(frameAt);
  }

  // The visitor's turn: one hint, then the study view is theirs.
  function handOver() {
    place({ z: 1, x: 720, y: 450 });
    cursor.style.opacity = 0;
    tell({ scrub: false, free: !phone.matches });
    replay.hidden = false;
    if (phone.matches) {
      tryit.hidden = false;
      say('Your turn: try it yourself.');
      return;
    }
    screen.classList.add('free');
    fit();
    hint.classList.add('on');
    say('Your turn. Tap any part of the book.');
  }

  window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
    const type = event.data && event.data.type;
    if (type === 'klaro-showcase-ready') {
      // Let the app draw its first state, then show it over the picture and start the story.
      setTimeout(() => {
        ready = true;
        frame.classList.add('ready');
        if (reduce) { step = 2; handOver(); } else play();
      }, 900);
    }
    if (type === 'klaro-showcase-tap') {
      hint.classList.remove('on');
      say('Every page links to the moment it was explained and the questions on it.');
    }
  });

  replay.addEventListener('click', play);
  tryit.addEventListener('click', () => {
    const full = document.createElement('iframe');
    full.title = 'Klaro sample workspace';
    full.src = '../showcase/showcase.html?scene=student-study&lang=en&free=1';
    sheet.appendChild(full);
    sheet.hidden = false;
    document.body.style.overflow = 'hidden';
  });
  document.getElementById('close').addEventListener('click', () => {
    sheet.querySelector('iframe')?.remove();
    sheet.hidden = true;
    document.body.style.overflow = '';
  });
  window.addEventListener('resize', fit);
  fit();
})();
