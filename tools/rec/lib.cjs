// Shared helpers: a phone-sized page on the showcase, CDP screencast capture, touch gestures.
const fs = require('fs');
const path = require('path');
// Playwright comes from the app repo's install; set KLARO_PLAYWRIGHT to point elsewhere.
const pw = require(process.env.KLARO_PLAYWRIGHT || '/Users/mohammed/Code/klaro-beta-v2/node_modules/.pnpm/playwright@1.63.0/node_modules/playwright');

const W = 390, H = 844, DPR = 2;
const TOUCH = 1; // CDP input is in CSS pixels of the viewport, whatever the page scale
const BASE = 'http://localhost:8091';

async function phonePage({ scene, lang = 'en', free = false, browserName = 'chromium' }) {
  const browser = await pw[browserName].launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] });
  // The window is the phone's device pixels (780 x 1688) and the page lays out 390 wide at a page
  // scale of 2, so the screencast (which captures window pixels) is as sharp as a 2x screenshot.
  const ctx = await browser.newContext({
    viewport: { width: W * DPR, height: H * DPR }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
    reducedMotion: 'no-preference',
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console.error]', m.text().slice(0, 300)); });
  // The showcase's own viewport meta draws it 1440 wide; a phone-wide iframe ignores it and the app
  // uses its phone layout (showcase.md §1.1). At the top level we get the same by a device-width meta.
  await page.route('**/showcase/showcase.html*', async (route) => {
    const res = await route.fetch();
    const body = (await res.text()).replace('content="width=1440"', `content="width=${W}, initial-scale=${DPR}, minimum-scale=${DPR}, maximum-scale=${DPR}, viewport-fit=cover"`);
    await route.fulfill({ response: res, body });
  });
  const url = `${BASE}/showcase/showcase.html?scene=${scene}&lang=${lang}${free ? '&free=1' : ''}`;
  await page.goto(url);
  return { browser, ctx, page };
}

// Screencast: frames as JPEG with compositor timestamps.
async function startCapture(page, dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  let n = 0;
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const file = path.join(dir, `f${String(++n).padStart(5, '0')}.jpg`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    frames.push({ file, ts: metadata.timestamp });
    try { await cdp.send('Page.screencastFrameAck', { sessionId }); } catch (e) { /* closed */ }
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W * DPR, maxHeight: H * DPR, everyNthFrame: 1 });
  const t0 = Date.now() / 1000;
  return {
    cdp,
    frames,
    t0,
    now: () => Date.now() / 1000 - t0,
    async stop() {
      await cdp.send('Page.stopScreencast');
      fs.writeFileSync(path.join(dir, 'frames.json'), JSON.stringify(frames));
      return frames;
    },
  };
}

// A finger swipe: touchStart, moves along an eased path, touchEnd.
async function swipe(cdp, { x, y0, y1, ms = 320, steps = 16 }) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
  for (let i = 1; i <= steps; i++) {
    const p = i / steps, e = 1 - Math.pow(1 - p, 2);
    await new Promise((r) => setTimeout(r, ms / steps));
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 + (y1 - y0) * e }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Touch input is in window pixels; the page is at a scale of DPR, so CSS points are doubled.
async function tap(page, x, y) { await page.touchscreen.tap(x * TOUCH, y * TOUCH); }
async function tapEl(page, locator, fx = 0.5, fy = 0.5) {
  const b = await locator.boundingBox();
  if (!b) throw new Error('no box for ' + locator);
  await tap(page, b.x + b.width * fx, b.y + b.height * fy);
}
async function swipeCss(cdp, { x, y0, y1, ms, steps }) { await swipe(cdp, { x: x * TOUCH, y0: y0 * TOUCH, y1: y1 * TOUCH, ms, steps }); }

module.exports = { pw, phonePage, startCapture, swipe, swipeCss, tap, tapEl, sleep, W, H, DPR, BASE };
