"""Animated fix-and-flip reel (1080x1920, 30 fps) rendered with Pillow + ffmpeg.
Usage: python3 make_reel.py <fonts_dir> <out.mp4>
"""
import math
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

FONTS, OUT = sys.argv[1], sys.argv[2]
HERE = sys.path[0]
W, H, FPS = 1080, 1920, 30
BG = (11, 11, 13)
WINE = (139, 21, 32)
GOLD = (214, 178, 106)
WHITE = (255, 255, 255)
GRAY = (200, 200, 205)


def font(name, size, wght):
    f = ImageFont.truetype(f'{FONTS}/{name}', size)
    f.set_variation_by_axes([wght])
    return f


def serif(s, w=900): return font('PlayfairDisplay%5Bwght%5D.ttf', s, w)
def sans(s, w=800): return font('Montserrat%5Bwght%5D.ttf', s, w)


def ease(t):  # easeOutCubic, clamped
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


# ---------- background: dark with a slow wine glow ----------
ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)


def background(t):
    cy = 1500 + 120 * math.sin(t * 0.6)
    d = np.sqrt((xs - 540) ** 2 + (ys - cy) ** 2) / 900
    g = np.clip(1 - d, 0, 1) ** 2 * 0.55
    arr = np.empty((H, W, 3), np.float32)
    for i, (b, w) in enumerate(zip(BG, WINE)):
        arr[..., i] = b + (w - b) * g
    return Image.fromarray(arr.astype(np.uint8)).convert('RGBA')


BG_FRAMES = [background(i / 4) for i in range(0, 40)]  # cached, cycled


# ---------- text layers ----------
def layer(draw_fn):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(im))
    return im


def spaced(d, x, y, text, f, fill, sp):
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + sp


def width(text, f, sp=0):
    d = ImageDraw.Draw(Image.new('L', (1, 1)))
    return d.textlength(text, font=f) + sp * (len(text) - 1)


def centered(d, y, text, f, fill, sp=0):
    spaced(d, (W - width(text, f, sp)) / 2, y, text, f, fill, sp)


def tag(d, y, text, f, sp=8, padx=28, h=62):
    w = width(text, f, sp)
    x = (W - w - 2 * padx) / 2
    d.rectangle((x, y, x + w + 2 * padx, y + h), fill=WINE)
    b = d.textbbox((0, 0), text, font=f)
    spaced(d, x + padx, y + (h - (b[3] - b[1])) / 2 - b[1], text, f, WHITE, sp)


def wrap(text, f, maxw):
    lines, cur = [], ''
    for w_ in text.split():
        t = (cur + ' ' + w_).strip()
        if width(t, f) <= maxw:
            cur = t
        else:
            lines.append(cur)
            cur = w_
    return lines + [cur]


def step_layers(num, title, body):
    """Returns (badge layer, title layer, body layer)."""
    def badge(d):
        cx, cy, r = W / 2, 560, 120
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=GOLD, width=8)
        f = serif(150)
        b = d.textbbox((0, 0), num, font=f)
        d.text((cx - (b[2] - b[0]) / 2 - b[0], cy - (b[3] - b[1]) / 2 - b[1]), num, font=f, fill=GOLD)

    def ttl(d):
        centered(d, 740, title, sans(110, 900), WHITE, 6)
        d.rectangle((W / 2 - 70, 890, W / 2 + 70, 897), fill=WINE)

    def bod(d):
        f = sans(54, 600)
        for i, ln in enumerate(wrap(body, f, 880)):
            centered(d, 950 + i * 74, ln, f, GRAY)
    return layer(badge), layer(ttl), layer(bod)


def hook_layers():
    def a(d):
        tag(d, 560, 'REAL ESTATE', sans(32, 800))
    def b(d):
        centered(d, 680, '¿Qué es un', serif(120), WHITE)
        centered(d, 820, 'FIX & FLIP?', sans(140, 900), GOLD, 4)
    def c(d):
        f = sans(48, 600)
        centered(d, 1040, 'Te lo explico en 3 pasos', f, GRAY)
    return layer(a), layer(b), layer(c)


def profit_layers():
    def a(d):
        centered(d, 640, 'La ganancia está en', serif(84, 700), WHITE)
    def b(d):
        centered(d, 780, 'COMPRAR BIEN', sans(104, 900), GOLD, 4)
        centered(d, 910, 'y', serif(70, 700), WHITE)
        centered(d, 1000, 'RENOVAR CON', sans(104, 900), GOLD, 4)
        centered(d, 1120, 'INTELIGENCIA', sans(104, 900), GOLD, 4)
    return layer(a), layer(b)


END = Image.open(f'{HERE}/end_card_overlay.png').convert('RGBA')

# scenes: (start, end, layers with (layer, delay, slide_px))
scenes = []
h1, h2, h3 = hook_layers()
scenes.append((0.0, 3.6, [(h1, 0.1, 40), (h2, 0.35, 60), (h3, 0.9, 40)]))
for i, (n, t, b) in enumerate([
        ('1', 'COMPRA', 'Una casa que necesita trabajo, por debajo del precio del mercado.'),
        ('2', 'RENUEVA', 'Cocina, baños, pintura y pisos: lo que más valor le suma.'),
        ('3', 'VENDE', 'La pones en el mercado a su nuevo valor.')]):
    s = 3.6 + i * 3.6
    a, ti, bo = step_layers(n, t, b)
    scenes.append((s, s + 3.6, [(a, 0.05, 50), (ti, 0.3, 60), (bo, 0.65, 40)]))
p1, p2 = profit_layers()
scenes.append((14.4, 18.0, [(p1, 0.1, 40), (p2, 0.45, 60)]))
END_START, TOTAL = 18.0, 24.0

ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                       '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium',
                       '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT],
                      stdin=subprocess.PIPE)

for fi in range(int(TOTAL * FPS)):
    t = fi / FPS
    frame = BG_FRAMES[(fi // 3) % len(BG_FRAMES)].copy()
    for (s, e, layers) in scenes:
        if not (s <= t < e):
            continue
        out_a = 1 - ease((t - (e - 0.35)) / 0.35) if t > e - 0.35 else 1.0
        for lay, delay, slide in layers:
            p = ease((t - s - delay) / 0.5)
            if p <= 0:
                continue
            alpha = p * out_a
            l2 = lay if alpha >= 0.999 else Image.fromarray(
                (np.asarray(lay) * np.array([1, 1, 1, alpha])).astype(np.uint8), 'RGBA')
            frame.alpha_composite(l2, (0, int(slide * (1 - p))))
    if t >= END_START:
        p = ease((t - END_START) / 0.8)
        zoom = 1.0 + 0.03 * (t - END_START) / (TOTAL - END_START)
        e = END if p >= 0.999 else Image.fromarray(
            (np.asarray(END) * np.array([1, 1, 1, p])).astype(np.uint8), 'RGBA')
        if zoom > 1.0:
            ew, eh = int(W * zoom), int(H * zoom)
            e = e.resize((ew, eh), Image.BILINEAR).crop(((ew - W) // 2, (eh - H) // 2, (ew - W) // 2 + W, (eh - H) // 2 + H))
        frame.alpha_composite(e)
    ff.stdin.write(frame.convert('RGB').tobytes())

ff.stdin.close()
ff.wait()
print('saved', OUT)
