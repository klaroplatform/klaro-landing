// The three tutor examples under the hero: recordings of the real app (recorder/scenes.cjs).
// Like the hero, each plays by itself once it is on screen; its captions (media/<scene>.json)
// show under it and light the step on the left. Replay at the end.
(() => {
  const EXAMPLES = [
    { scene: 'lives', eyebrow: 'Lives',
      title: 'Teach on Zoom. The recording lands in your course, already connected to your material.',
      list: ['Teach on Zoom', 'The recording lands in your course', 'Linked to your book'], step: [0, 1, 1, 2] },
    { scene: 'quiz', eyebrow: 'Quizzes and homework',
      title: 'Ask for homework in plain words. It’s written and sent.',
      list: ['Ask in plain words', 'Klaro plans it', 'Built from past papers, ready to send'], step: [0, 1, 2, 2] },
    { scene: 'marking', eyebrow: 'Marking',
      title: 'Answers come back marked, with feedback for each student.',
      list: ['Papers come in', 'Answers marked', 'Feedback for each student'], step: [0, 1, 1, 2] },
  ];
  const REPLAY = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>';
  const host = document.getElementById('examples');

  function build(ex) {
    const el = document.createElement('section');
    el.className = 'ex';
    el.setAttribute('aria-label', ex.eyebrow);
    el.innerHTML =
      '<div class="stage"><div class="row">' +
      '<div class="copy"><span class="eyebrow"></span><h2></h2><ol class="steps"></ol></div>' +
      '<div class="frame"><div class="screen"><video muted playsinline preload="metadata"></video></div>' +
      '<div class="under"><p class="caption" aria-live="polite"></p><div class="actions">' +
      '<button class="btn btn-ghost btn-sm replay" type="button" hidden>' + REPLAY + 'Replay</button>' +
      '</div></div></div></div></div>';
    el.querySelector('.eyebrow').textContent = ex.eyebrow;
    el.querySelector('h2').textContent = ex.title;
    const ol = el.querySelector('.steps');
    for (const words of ex.list) {
      const li = document.createElement('li');
      li.textContent = words;
      li.appendChild(document.createElement('i'));
      ol.appendChild(li);
    }
    host.appendChild(el);
    return el;
  }

  for (const ex of EXAMPLES) {
    const el = build(ex);
    const video = el.querySelector('video');
    const caption = el.querySelector('.caption');
    const replay = el.querySelector('.replay');
    const items = [...el.querySelectorAll('.steps li')];
    video.poster = 'media/' + ex.scene + '-poster.jpg';
    video.setAttribute('aria-label', 'A recording of Klaro: ' + ex.eyebrow);
    let cues = null, shown = -1, seen = false, manual = false;

    function say(i) {
      if (i === shown) return;
      shown = i;
      caption.style.opacity = 0;
      setTimeout(() => { caption.textContent = cues[i].text; caption.style.opacity = 1; }, 150);
      const step = ex.step[i] ?? 0;
      items.forEach((li, n) => li.classList.toggle('on', n <= step));
    }

    // The bar under each step fills with the playback, step by step.
    function tick() {
      if (!cues) return;
      const t = video.currentTime;
      let i = 0;
      while (i < cues.length - 1 && t >= cues[i + 1].t) i++;
      say(i);
      const step = ex.step[i] ?? 0;
      const firstCue = ex.step.indexOf(step), lastCue = ex.step.lastIndexOf(step);
      const from = cues[firstCue].t, to = cues[lastCue + 1] ? cues[lastCue + 1].t : video.duration || from + 1;
      items.forEach((li, n) => {
        const fill = n < step ? 1 : n > step ? 0 : Math.min(1, Math.max(0, (t - from) / (to - from)));
        li.querySelector('i').style.transform = 'scaleX(' + fill + ')';
      });
      if (!manual && !video.paused && !video.ended) requestAnimationFrame(tick);
    }

    fetch('media/' + ex.scene + '.json').then((r) => r.json()).then((meta) => {
      cues = meta.cues;
      say(0);
      tick();
    });
    video.src = 'media/' + ex.scene + '.mp4';
    video.load();

    // Playing. Safari in Low Power Mode (and an iPhone in it) refuses to start any video by itself;
    // then the page plays it by stepping through it, a seek per frame, which is always allowed.
    let running = false, last = 0;
    const done = () => video.duration && video.currentTime >= video.duration - 0.05;
    // The clock runs at real speed; a frame still loading is skipped, never waited for.
    let clock = 0;
    function step(now) {
      if (!running) return;
      clock += Math.min(0.1, (now - last) / 1000);
      last = now;
      if (video.readyState >= 1) {
        clock = Math.min(clock, video.duration);
        if (!video.seeking) video.currentTime = clock;
        tick();
        if (clock >= video.duration - 0.05) { running = false; finished(); return; }
      }
      requestAnimationFrame(step);
    }
    function play() {
      if (manual) {
        if (running) return;
        running = true; last = performance.now(); clock = video.currentTime;
        requestAnimationFrame(step);
        return;
      }
      video.play().catch(() => { manual = true; play(); });
    }
    function pause() {
      running = false;
      if (!video.paused) video.pause();
    }
    const playing = () => (manual ? running : !video.paused && !video.ended);
    function finished() { tick(); replay.hidden = false; }

    video.addEventListener('play', () => requestAnimationFrame(tick));
    video.addEventListener('seeked', () => { if (!running) tick(); });
    video.addEventListener('ended', finished);
    replay.addEventListener('click', () => {
      replay.hidden = true;
      video.currentTime = 0;
      play();
    });

    // Plays when most of it is on screen; pauses when it leaves, and carries on when it comes back.
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!seen || (!done() && !playing() && video.currentTime > 0)) play();
        seen = true;
      } else if (playing()) {
        pause();
      }
    }, { threshold: 0.6 }).observe(el.querySelector('.screen'));
  }
})();
