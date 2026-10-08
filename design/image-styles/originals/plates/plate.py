"""Measure the #00FF00 screen in a generated plate, paint it #1b1722, crop and save WebP.

usage: python3 -I plate.py <green.png> <out.webp> <crop_y_frac|auto> [phone_out.webp]
Prints the screen box in the final image (px and %), plus a corner-radius estimate.
"""
import json, subprocess, sys

FF = '/Users/mohammed/.local/bin/ffmpeg'

def decode(path):
    probe = subprocess.run([FF, '-hide_banner', '-i', path], capture_output=True, text=True).stderr
    import re
    w, h = map(int, re.search(r', (\d{2,5})x(\d{2,5})', probe).groups())
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True, check=True).stdout
    return w, h, bytearray(raw)

def is_green(r, g, b, strict=True):
    return (g > 200 and r < 90 and b < 90) if strict else (g > r + 50 and g > b + 50)

def measure(w, h, px):
    rows = [0] * h; cols = [0] * w
    for y in range(h):
        o = y * w * 3
        for x in range(w):
            i = o + x * 3
            if is_green(px[i], px[i + 1], px[i + 2]):
                rows[y] += 1; cols[x] += 1
    if not any(rows):
        raise SystemExit('no green found')
    # rows/cols that are mostly green: ignores anti-aliased edges and stray specks
    rmax, cmax = max(rows), max(cols)
    ys = [y for y in range(h) if rows[y] > 0.5 * rmax]
    xs = [x for x in range(w) if cols[x] > 0.5 * cmax]
    x0, x1, y0, y1 = xs[0], xs[-1], ys[0], ys[-1]
    # corner radius: how far in from the left the green starts on the top row of the box
    o = y0 * w * 3
    r = 0
    while r < (x1 - x0) // 2 and not is_green(*px[o + (x0 + r) * 3: o + (x0 + r) * 3 + 3]):
        r += 1
    return x0, y0, x1 - x0 + 1, y1 - y0 + 1, r

def paint(w, h, px, box, pad=4, colour=(0x1b, 0x17, 0x22)):
    x, y, bw, bh, _ = box
    for yy in range(max(0, y - pad), min(h, y + bh + pad)):
        o = yy * w * 3
        for xx in range(max(0, x - pad), min(w, x + bw + pad)):
            i = o + xx * 3
            if is_green(px[i], px[i + 1], px[i + 2], strict=False):
                px[i:i + 3] = bytes(colour)

def encode(w, h, px, vf, out, quality=82):
    p = subprocess.run([FF, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-i', '-',
                        '-vf', vf, '-c:v', 'libwebp', '-quality', str(quality), '-compression_level', '6', out],
                       input=bytes(px), check=True)

def main():
    src, out, crop = sys.argv[1], sys.argv[2], sys.argv[3]
    phone = sys.argv[4] if len(sys.argv) > 4 else None
    w, h, px = decode(src)
    box = measure(w, h, px)
    x, y, bw, bh, r = box
    paint(w, h, px, box)
    report = {'source': [w, h], 'screen_in_source': [x, y, bw, bh], 'radius_src': r}
    # desktop plate: full width, 12:5 crop, scaled to 2000 wide (never wider)
    ch = round(w * 5 / 12)
    if crop == 'auto':  # centre the crop on the screen, clamp inside the image
        cy = min(max(0, y + bh // 2 - ch // 2), h - ch)
    else:
        cy = round(float(crop) * h)
    ow = 2000; s = ow / w; oh = round(ch * s)
    encode(w, h, px, f'crop={w}:{ch}:0:{cy},scale={ow}:{oh}:flags=lanczos', out)
    fx, fy, fw, fh = round(x * s), round((y - cy) * s), round(bw * s), round(bh * s)
    report['plate'] = {'file': out, 'size': [ow, oh], 'box_px': [fx, fy, fw, fh],
                       'box_pct': [round(100 * fx / ow, 2), round(100 * fy / oh, 2), round(100 * fw / ow, 2), round(100 * fh / oh, 2)],
                       'radius_px': round(r * s), 'screen_inside_crop': fy >= 0 and fy + fh <= oh}
    if phone:  # 4:3 crop at full height, centred on the screen, scaled to 1200x900
        pw = round(h * 4 / 3); px0 = min(max(0, x + bw // 2 - pw // 2), w - pw); ps = 1200 / pw
        encode(w, h, px, f'crop={pw}:{h}:{px0}:0,scale=1200:900:flags=lanczos', phone)
        bx, by, bw2, bh2 = round((x - px0) * ps), round(y * ps), round(bw * ps), round(bh * ps)
        report['phone'] = {'file': phone, 'size': [1200, 900], 'box_px': [bx, by, bw2, bh2],
                           'box_pct': [round(100 * bx / 1200, 2), round(100 * by / 900, 2), round(100 * bw2 / 1200, 2), round(100 * bh2 / 900, 2)],
                           'radius_px': round(r * ps), 'screen_inside_crop': bx >= 0 and bx + bw2 <= 1200}
    print(json.dumps(report, indent=1))

main()
