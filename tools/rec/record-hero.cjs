// study-hero / student-study-hero: the hero story (tap a passage, the lecture at that moment, the
// question on it, back to the book) in the app's phone layout, with real taps.
const fs = require('fs');
const { phonePage, startCapture, tap, tapEl, sleep } = require('./lib.cjs');
const scene = process.argv[2] || 'study';
const name = scene === 'study' ? 'study-hero' : 'student-study-hero';
const DIR = (process.env.REC_OUT || require('os').tmpdir() + '/klaro-rec') + '/' + name;

(async () => {
  const { browser, page } = await phonePage({ scene });
  await page.locator('[data-book-page="2"] .textLayer span').first().waitFor({ timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(2000);
  const cap = await startCapture(page, DIR);
  const marks = {};
  const mark = (k, dt = 0) => { marks[k] = Date.now() / 1000 + dt; console.log(k, (marks[k] - cap.t0).toFixed(2)); };
  const passage = page.locator('[data-book-page="2"] .textLayer span', { hasText: 'Parts every cell has' }).first();
  // A button in the app's "Opened in Lecture · Questions" note, by its words ('' = the close button).
  async function inNote(label) {
    const r = await page.evaluate((label) => {
      const leaf = [...document.querySelectorAll('body *')].find((e) => e.children.length === 0 && /^Opened in/.test(e.textContent.trim()));
      let box = leaf;
      while (box && box.querySelectorAll('button').length < 2) box = box.parentElement;
      if (!box) return null;
      const btn = [...box.querySelectorAll('button')].find((b) => (label ? b.innerText.trim() === label : !b.innerText.trim()));
      if (!btn) return { buttons: [...box.querySelectorAll('button')].map((b) => [b.innerText.trim(), b.getAttribute('aria-label')]) };
      const q = btn.getBoundingClientRect();
      return { x: q.x + q.width / 2, y: q.y + q.height / 2, aria: btn.getAttribute('aria-label') };
    }, label);
    if (!r || r.x == null) throw new Error('note button ' + label + ' ' + JSON.stringify(r));
    await tap(page, r.x, r.y);
    return r;
  }

  await sleep(200);
  mark('start');                                   // 1. the book; a passage is tapped
  await sleep(1300);
  await tapEl(page, passage);
  mark('tap1');
  await sleep(2300);
  mark('step2', -0.15);                            // 2. the second tap opens it: the lecture at 1:53
  await tapEl(page, passage);
  mark('tap2');
  await sleep(5300);
  // 3. the question on that passage: "Questions" in the app's own "Opened in" note
  mark('step3', -0.15);
  await inNote('Questions');
  mark('tapQ');
  await sleep(3300);
  // 4. back to the book: the passage stays marked (the note goes on its own); the visitor's turn
  mark('step4', -0.15);
  await inNote('Book');
  mark('tapB');
  await sleep(3900);
  mark('end');
  await cap.stop();
  fs.writeFileSync(DIR + '/marks.json', JSON.stringify(marks));
  console.log('frames', cap.frames.length);
  await browser.close();
})();
