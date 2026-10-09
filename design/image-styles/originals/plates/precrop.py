"""Crop a green-screen plate to a 16:9 window so the green screen is <pct>% of the window width.

usage: python3 -I precrop.py <in.png> <out.png> <pct>
Lossless (PNG out). Prints the window used.
"""
import re, subprocess, sys

FF = '/Users/mohammed/.local/bin/ffmpeg'

def decode(path):
    probe = subprocess.run([FF, '-hide_banner', '-i', path], capture_output=True, text=True).stderr
    w, h = map(int, re.search(r', (\d{2,5})x(\d{2,5})', probe).groups())
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True, check=True).stdout
    return w, h, raw

def main():
    src, out, pct = sys.argv[1], sys.argv[2], float(sys.argv[3])
    w, h, px = decode(src)
    rows = [0] * h; cols = [0] * w
    for y in range(h):
        o = y * w * 3
        for x in range(w):
            i = o + x * 3
            if px[i + 1] > 150 and px[i] < 90 and px[i + 2] < 90:
                rows[y] += 1; cols[x] += 1
    rm, cm = max(rows), max(cols)
    ys = [y for y in range(h) if rows[y] > 0.5 * rm]
    xs = [x for x in range(w) if cols[x] > 0.5 * cm]
    x0, x1, y0, y1 = xs[0], xs[-1], ys[0], ys[-1]
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    ww = min(w, round(bw / (pct / 100)))
    ww -= ww % 2
    wh = round(ww * 9 / 16)
    wh -= wh % 2
    if wh > h:
        wh = h - h % 2; ww = round(wh * 16 / 9); ww -= ww % 2
    cx, cy = x0 + bw // 2, y0 + bh // 2
    wx = min(max(0, cx - ww // 2), w - ww)
    wy = min(max(0, cy - wh // 2), h - wh)
    subprocess.run([FF, '-v', 'error', '-y', '-i', src, '-vf', f'crop={ww}:{wh}:{wx}:{wy}', out], check=True)
    print({'source': [w, h], 'screen': [x0, y0, bw, bh], 'screen_pct_src': round(100 * bw / w, 1),
           'window': [wx, wy, ww, wh], 'screen_pct_out': round(100 * bw / ww, 1),
           'screen_aspect': round(bw / bh, 3), 'fits_12x5': bh <= ww * 5 / 12})

main()
