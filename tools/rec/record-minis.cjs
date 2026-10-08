// student-minis-phone: the minis feed in the phone layout, driven with real taps and swipes.
const fs = require('fs');
const { phonePage, startCapture, swipeCss, tap, tapEl, sleep } = require('./lib.cjs');
const DIR = (process.env.REC_OUT || require('os').tmpdir() + '/klaro-rec') + '/student-minis-phone';

(async () => {
  const { browser, page } = await phonePage({ scene: 'student-minis' });
  await page.getByText('2 minis, 2 lecture moments').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await sleep(1000);
  // Off camera: the intro card's "Start with …" button, so the recording opens on the reel playing.
  await tapEl(page, page.getByRole('button', { name: /Start with/ }));
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v && !v.paused && v.currentTime > 141.5; });
  await sleep(600);
  const cap = await startCapture(page, DIR);
  const cdp = cap.cdp;
  const marks = {};
  const mark = (k, dt = 0) => { marks[k] = Date.now() / 1000 + dt; console.log(k, (marks[k] - cap.t0).toFixed(2)); };
  const feed = await page.evaluate(() => { const r = document.querySelector('.minis-feed').getBoundingClientRect(); return { top: r.top, h: r.height }; });
  const up = () => swipeCss(cdp, { x: 205, y0: feed.top + feed.h * 0.78, y1: feed.top + feed.h * 0.22, ms: 280, steps: 14 });
  const check = (k) => page.locator(`section[aria-label="Check ${k} of 3 on Parts only plant cells have"]`);
  async function answer(k, letter) {
    const opt = check(k).locator('button').filter({ hasText: new RegExp('^' + letter + '[A-Z]') });
    await tapEl(page, opt, 0.4, 0.5);
  }

  await sleep(200);
  mark('start');                     // the reel plays the lecture moment
  await sleep(3400);
  mark('pause');                     // tap pauses: the pill and the book button stay
  await tap(page, 195, feed.top + feed.h * 0.45);
  await sleep(2000);
  mark('check1');                    // swipe up: check 1 of 3
  await up();
  await sleep(1300);
  await answer(1, 'C');
  mark('answer1');
  await sleep(2400);
  mark('check2');
  await up();
  await sleep(1100);
  await answer(2, 'A');
  mark('answer2');
  await sleep(1600);
  mark('check3');
  await up();
  await sleep(1100);
  mark('cleared', -0.2);
  await answer(3, 'A');
  mark('answer3');
  await sleep(3300);
  mark('end');
  await cap.stop();
  fs.writeFileSync(DIR + '/marks.json', JSON.stringify(marks));
  console.log('frames', cap.frames.length);
  await browser.close();
})();
