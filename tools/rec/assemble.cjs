// Turns a screencast capture (frames with timestamps) into a constant-rate frame sequence, then H.264.
// node assemble.cjs <capdir> <out.mp4> [fps=30] [crf=26] [width=780] [from=start] [to=end]
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const [dir, out, fpsA, crfA, widthA, fromK = 'start', toK = 'end'] = process.argv.slice(2);
const fps = +fpsA || 30, crf = +crfA || 26, width = +widthA || 780;
const frames = JSON.parse(fs.readFileSync(path.join(dir, 'frames.json'), 'utf8')).sort((a, b) => a.ts - b.ts);
const marks = JSON.parse(fs.readFileSync(path.join(dir, 'marks.json'), 'utf8'));
const t0 = marks[fromK], t1 = marks[toK];
const n = Math.round((t1 - t0) * fps);
const seq = path.join(dir, 'seq');
fs.rmSync(seq, { recursive: true, force: true });
fs.mkdirSync(seq);
let j = 0;
for (let i = 0; i < n; i++) {
  const t = t0 + i / fps;
  while (j + 1 < frames.length && frames[j + 1].ts <= t) j++;
  fs.symlinkSync(frames[j].file, path.join(seq, `s${String(i).padStart(5, '0')}.jpg`));
}
const cues = {};
for (const [k, v] of Object.entries(marks)) cues[k] = +(v - t0).toFixed(2);
console.log('frames in', frames.length, 'out', n, 'duration', (n / fps).toFixed(2), 'marks', JSON.stringify(cues));
const vf = [`scale=${width}:-2:flags=lanczos`, 'format=yuv420p'].join(',');
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(fps), '-i', path.join(seq, 's%05d.jpg'),
  '-vf', vf, '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'stillimage', '-crf', String(crf), '-profile:v', 'high', '-level', '4.1',
  '-g', String(fps), '-keyint_min', String(fps), '-sc_threshold', '0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out], { stdio: 'inherit' });
console.log('size', fs.statSync(out).size);
