"""Animated Fix & Hold reel (1080x1920, 30 fps, ~52 s) rendered with Pillow + ffmpeg.
Usage: python3 make_reel.py <out.mp4>
Brand assets (fonts, agent cutout, phone icon) come from ../assets.
"""
import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
W, H, FPS = 1080, 1920, 30
BG = (11, 11, 13)
WINE = (139, 21, 32)
GOLD = (214, 178, 106)
WHITE = (255, 255, 255)
GRAY = (200, 200, 205)
DIM = (120, 120, 128)


def font(name, size, wght):
    f = ImageFont.truetype(os.path.join(ASSETS, 'fonts', name), size)
    f.set_variation_by_axes([wght])
    return f


def serif(s, w=900): return font('PlayfairDisplay%5Bwght%5D.ttf', s, w)
def serif_i(s, w=700): return font('PlayfairDisplay-Italic%5Bwght%5D.ttf', s, w)
def sans(s, w=800): return font('Montserrat%5Bwght%5D.ttf', s, w)


def ease(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


# ---------------- background ----------------
ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)


def background(t):
    cy = 1500 + 120 * math.sin(t * 0.6)
    d = np.sqrt((xs - 540) ** 2 + (ys - cy) ** 2) / 900
    g = np.clip(1 - d, 0, 1) ** 2 * 0.55
    arr = np.empty((H, W, 3), np.float32)
    for i, (b, w) in enumerate(zip(BG, WINE)):
        arr[..., i] = b + (w - b) * g
    return Image.fromarray(arr.astype(np.uint8)).convert('RGBA')


BG_FRAMES = [background(i / 4) for i in range(40)]

# ---------------- drawing helpers ----------------
_m = ImageDraw.Draw(Image.new('L', (1, 1)))


def width(text, f, sp=0):
    return _m.textlength(text, font=f) + sp * (len(text) - 1)


def spaced(d, x, y, text, f, fill, sp=0):
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + sp


def centered(d, y, text, f, fill, sp=0):
    spaced(d, (W - width(text, f, sp)) / 2, y, text, f, fill, sp)


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


def para(d, y, text, f, fill, maxw=880, lh=None):
    lh = lh or int(f.size * 1.38)
    for i, ln in enumerate(wrap(text, f, maxw)):
        centered(d, y + i * lh, ln, f, fill)


def tag(d, y, text, f, sp=8, padx=28, h=62, x=None, fill=WINE):
    w = width(text, f, sp)
    x = (W - w - 2 * padx) / 2 if x is None else x
    d.rectangle((x, y, x + w + 2 * padx, y + h), fill=fill)
    b = d.textbbox((0, 0), text, font=f)
    spaced(d, x + padx, y + (h - (b[3] - b[1])) / 2 - b[1], text, f, WHITE, sp)


def layer(fn):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    fn(ImageDraw.Draw(im))
    return im


def check(d, cx, cy, r=34):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=GOLD)
    d.line([(cx - 15, cy + 1), (cx - 4, cy + 13), (cx + 17, cy - 12)], fill=BG, width=8, joint='curve')


# ---------------- scenes ----------------
scenes = []   # (start, end, [(layer, delay, slide_px)])


def add(start, dur, items):
    scenes.append((start, start + dur, items))
    return start + dur


t = 0.0

# 1. Hook
t = add(t, 4.5, [
    (layer(lambda d: tag(d, 520, 'REAL ESTATE', sans(32, 800))), 0.1, 40),
    (layer(lambda d: (centered(d, 640, '¿Conoces el', serif(120), WHITE),
                      centered(d, 790, 'FIX & HOLD?', sans(140, 900), GOLD, 4))), 0.35, 60),
    (layer(lambda d: para(d, 1010, 'Arreglar una casa y quedarte con ella', sans(52, 600), GRAY)), 1.0, 40),
])


# 2. Flip vs Hold comparison
def col(d, x, title, items, last, last_color):
    f = sans(56, 900)
    spaced(d, x + (440 - width(title, f, 3)) / 2, 0, title, f, WHITE, 3)
    for i, it in enumerate(items + [last]):
        ff = sans(44, 700 if it != last else 900)
        col_ = GRAY if it != last else last_color
        spaced(d, x + (440 - width(it, ff)) / 2, 110 + i * 90, it, ff, col_)


def comparison_layers():
    left = layer(lambda d: d.rectangle((60, 500, 520, 1020), outline=DIM, width=3))
    lt = Image.new('RGBA', (W, 500), (0, 0, 0, 0))
    col(ImageDraw.Draw(lt), 70, 'FIX & FLIP', ['Compras', 'Arreglas'], 'Vendes', DIM)
    left.alpha_composite(lt, (0, 560))
    right = layer(lambda d: d.rectangle((560, 500, 1020, 1020), outline=GOLD, width=5))
    rt = Image.new('RGBA', (W, 500), (0, 0, 0, 0))
    col(ImageDraw.Draw(rt), 570, 'FIX & HOLD', ['Compras', 'Arreglas'], 'TE LA QUEDAS', GOLD)
    right.alpha_composite(rt, (0, 560))
    head = layer(lambda d: centered(d, 350, 'La diferencia', serif(96), WHITE))
    foot = layer(lambda d: para(d, 1080, 'En vez de venderla, la casa se vuelve tuya.', sans(48, 600), GRAY))
    return [(head, 0.1, 40), (left, 0.4, 60), (right, 1.0, 60), (foot, 1.8, 40)]


t = add(t, 6.0, comparison_layers())


# 3-6. Steps
def dots(d, active, n=4):
    for i in range(n):
        x = W / 2 + (i - (n - 1) / 2) * 56
        r = 11 if i == active else 8
        d.ellipse((x - r, 330 - r, x + r, 330 + r), fill=GOLD if i == active else DIM)


def step(num, title, body, active):
    def badge(d):
        dots(d, active)
        cx, cy, r = W / 2, 560, 120
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=GOLD, width=8)
        f = serif(150)
        b = d.textbbox((0, 0), num, font=f)
        d.text((cx - (b[2] - b[0]) / 2 - b[0], cy - (b[3] - b[1]) / 2 - b[1]), num, font=f, fill=GOLD)

    def ttl(d):
        f = sans(104 if len(title) < 11 else 88, 900)
        centered(d, 740, title, f, WHITE, 5)
        d.rectangle((W / 2 - 70, 885, W / 2 + 70, 892), fill=WINE)
    return [(layer(badge), 0.05, 50), (layer(ttl), 0.3, 60),
            (layer(lambda d: para(d, 950, body, sans(54, 600), GRAY)), 0.65, 40)]


for i, (n, ti, bo) in enumerate([
        ('1', 'COMPRA', 'Una casa que necesita trabajo, por debajo del precio del mercado.'),
        ('2', 'RENUEVA', 'Le sumas valor: cocina, baños, pintura y pisos.'),
        ('3', 'REFINANCIA', 'Con el nuevo valor de la casa, pasas a una hipoteca a largo plazo.'),
        ('4', 'TE LA QUEDAS', 'Vives en ella o la rentas, y la vas pagando poco a poco.')]):
    t = add(t, 5.5, step(n, ti, bo, i))


# 7. Benefits checklist
def benefits():
    items = ['Construyes patrimonio', 'Tu casa puede ganar valor con los años',
             'Si la rentas, te genera un ingreso cada mes']
    out = [(layer(lambda d: centered(d, 420, '¿Por qué hacerlo?', serif(100), WHITE)), 0.1, 40)]
    for i, it in enumerate(items):
        def fn(d, i=i, it=it):
            y = 640 + i * 230
            check(d, 130, y + 40)
            f = sans(50, 700)
            for j, ln in enumerate(wrap(it, f, 780)):
                d.text((200, y + j * 66), ln, font=f, fill=WHITE)
        out.append((layer(fn), 0.7 + i * 0.8, 50))
    return out


t = add(t, 7.0, benefits())


# 8. Tip: live in it with a renovation loan
def tip():
    return [
        (layer(lambda d: tag(d, 440, 'TIP', sans(34, 900), 10, fill=WINE)), 0.1, 40),
        (layer(lambda d: centered(d, 560, '¿Quieres vivir en ella?', serif(92), WHITE)), 0.35, 50),
        (layer(lambda d: para(d, 740, 'Hay préstamos como el FHA 203(k) que juntan la compra y la renovación en una sola hipoteca.',
                              sans(52, 600), GRAY)), 0.9, 40),
        (layer(lambda d: para(d, 1130, 'Requiere vivir en la casa. Cada caso es distinto: consulta con un prestamista.',
                              sans(36, 500), DIM, maxw=820)), 1.6, 30),
    ]


t = add(t, 6.5, tip())


# 9. End card
def end_card():
    ys_ = np.arange(H)[:, None]
    a = np.clip((ys_ - 700) / 400, 0, 1) * 0.97 + 0 * np.arange(W)[None, :]
    arr = np.zeros((H, W, 4), np.uint8)
    arr[..., :3] = BG
    arr[..., 3] = (a * 255).astype(np.uint8)
    im = Image.fromarray(arr, 'RGBA')
    im.alpha_composite(Image.open(os.path.join(ASSETS, 'agent_cutout.png')), (480, 815))
    d = ImageDraw.Draw(im)
    L = 64
    tag(d, 300, 'FIX & HOLD', sans(30, 800), 8, padx=26, h=58, x=L)
    d.text((L - 4, 372), '¿Listo para', font=serif(104), fill=WHITE)
    d.text((L - 4, 490), 'tu casa?', font=serif(104), fill=WHITE)
    spaced(d, L, 640, 'TE AYUDO A ENCONTRAR LA PROPIEDAD', sans(24, 700), GOLD, 3.2)
    d.rectangle((L, 690, L + 120, 696), fill=WINE)
    nf = sans(56, 800)
    d.text((L, 1188), 'ANGEL', font=nf, fill=WHITE)
    d.text((L, 1244), 'CORREDERA', font=nf, fill=WHITE)
    d.text((L, 1314), 'Agente de Bienes Raíces', font=serif_i(40, 700), fill=GOLD)
    d.rectangle((L, 1380, L + 456, 1382), fill=WINE)
    spaced(d, L, 1402, 'ANGEL CORREDERA REAL ESTATE', sans(20, 600), GRAY, 3.4)
    im.alpha_composite(Image.open(os.path.join(ASSETS, 'phone_icon.png')).convert('RGBA'), (60, 1448))
    d.text((L + 60, 1440), '786-309-0210', font=sans(52, 800), fill=WHITE)
    tag(d, 1522, 'EL REALTOR DE TU FAMILIA', sans(26, 800), 3.2, padx=22, h=58, x=L)
    return im


END = end_card()
END_START, TOTAL = t, t + 7.0

# ---------------- render ----------------
ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                       '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium',
                       '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT],
                      stdin=subprocess.PIPE)


def faded(im, a):
    if a >= 0.999:
        return im
    return Image.fromarray((np.asarray(im) * np.array([1, 1, 1, a])).astype(np.uint8), 'RGBA')


for fi in range(int(TOTAL * FPS)):
    tt = fi / FPS
    frame = BG_FRAMES[(fi // 3) % len(BG_FRAMES)].copy()
    for (s, e, items) in scenes:
        if not (s <= tt < e):
            continue
        out_a = 1 - ease((tt - (e - 0.35)) / 0.35) if tt > e - 0.35 else 1.0
        for lay, delay, slide in items:
            p = ease((tt - s - delay) / 0.5)
            if p > 0:
                frame.alpha_composite(faded(lay, p * out_a), (0, int(slide * (1 - p))))
    if tt >= END_START:
        p = ease((tt - END_START) / 0.8)
        zoom = 1.0 + 0.03 * (tt - END_START) / (TOTAL - END_START)
        e = faded(END, p)
        ew, eh = int(W * zoom), int(H * zoom)
        if ew > W:
            e = e.resize((ew, eh), Image.BILINEAR).crop(((ew - W) // 2, (eh - H) // 2,
                                                         (ew - W) // 2 + W, (eh - H) // 2 + H))
        frame.alpha_composite(e)
    ff.stdin.write(frame.convert('RGB').tobytes())

ff.stdin.close()
ff.wait()
print('saved', OUT, f'{TOTAL:.1f}s')
