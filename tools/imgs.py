# -*- coding: utf-8 -*-
"""Grade + encode the photography so it reads as one system, then emit
both real files (for the source site) and data: URIs (for the single-file demo)."""
import os, io, base64, json
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RAW = os.path.join(ROOT, 'raw')
OUT = os.path.join(ROOT, 'dist', 'assets', 'img')
os.makedirs(OUT, exist_ok=True)

NAVY = np.array([0x0B, 0x15, 0x33], dtype=np.float32)   # shadow tint
WARM = np.array([255, 226, 196], dtype=np.float32)      # highlight tint


def grade(im, shadow=0.30, highlight=0.10, sat=0.86, contrast=1.10, gamma=1.0):
    """Split-tone toward navy shadows / warm highlights, desaturate slightly."""
    im = im.convert('RGB')
    if contrast != 1.0:
        im = ImageEnhance.Contrast(im).enhance(contrast)
    if sat != 1.0:
        im = ImageEnhance.Color(im).enhance(sat)
    a = np.asarray(im, dtype=np.float32) / 255.0
    if gamma != 1.0:
        a = np.power(a, gamma)
    lum = (a[..., 0] * .2126 + a[..., 1] * .7152 + a[..., 2] * .0722)[..., None]
    sw = np.clip(1.0 - lum * 1.7, 0, 1) * shadow          # strength in shadows
    hw = np.clip((lum - .55) * 2.2, 0, 1) * highlight     # strength in highlights
    a = a * (1 - sw) + (NAVY / 255.0) * sw
    a = a * (1 - hw) + (WARM / 255.0) * hw
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))


def crop_to(im, ratio):
    w, h = im.size
    tw, th = ratio
    target = tw / th
    cur = w / h
    if cur > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        top = int((h - nh) * 0.38)          # bias upward — keeps horizons high
        im = im.crop((0, top, w, top + nh))
    return im


def lqip(im, w=20):
    t = im.copy()
    t.thumbnail((w, w * 4))
    t = t.filter(ImageFilter.GaussianBlur(0.6))
    b = io.BytesIO(); t.save(b, 'JPEG', quality=42)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()


def encode(im, width, q, fmt='WEBP'):
    t = im.copy()
    if t.width > width:
        t = t.resize((width, round(t.height * width / t.width)), Image.LANCZOS)
    b = io.BytesIO()
    if fmt == 'WEBP':
        t.save(b, 'WEBP', quality=q, method=6)
    else:
        t.save(b, 'JPEG', quality=q, optimize=True, progressive=True)
    return b.getvalue(), t.size


# name: (source, aspect, grade kwargs, widths, inline width, inline quality)
# name: (source, aspect, grade kwargs, widths, inline width, inline quality)
# NOTE: tool_steel / tools_set / rig_vehicle are deliberately unused — a rival tool
# brand ("FORCE") and a rival contractor ("ERIELL") are legible in them.
SPEC = {
 'hero':        ('rig_night_a', (16, 9),  dict(shadow=.42, highlight=.06, sat=.72, contrast=1.06), [1920, 1280, 800], 1600, 72),
 'ph-services': ('rig_sil',     (21, 9),  dict(shadow=.50, highlight=.08, sat=.52, contrast=1.06), [1600, 900], 1280, 66),
 'ph-ega':      ('tool_macro',  (21, 9),  dict(shadow=.48, highlight=.05, sat=.42, contrast=1.10), [1600, 900], 1280, 66),
 'ph-well':     ('rig_desert',  (21, 9),  dict(shadow=.50, highlight=.08, sat=.55, contrast=1.06), [1600, 900], 1280, 66),
 'ph-about':    ('desert_dusk', (21, 9),  dict(shadow=.48, highlight=.09, sat=.52, contrast=1.05), [1600, 900], 1280, 66),
 'ph-contact':  ('tower_night', (21, 9),  dict(shadow=.40, highlight=.06, sat=.70, contrast=1.06), [1600, 900], 1280, 66),

 'excl':        ('wh_bars',     (4, 3),   dict(shadow=.42, highlight=.06, sat=.55, contrast=1.10), [900, 600], 860, 68),
 'partners':    ('pipes_dark',  (16, 9),  dict(shadow=.46, highlight=.06, sat=.30, contrast=1.14), [1600, 900], 1280, 64),
 'field':       ('pump_sunset', (4, 3),   dict(shadow=.44, highlight=.12, sat=.62, contrast=1.06), [900, 600], 860, 66),
 'stock':       ('wh_dark',     (4, 3),   dict(shadow=.44, highlight=.06, sat=.48, contrast=1.10), [900, 600], 860, 66),
 'hse':         ('hat_dark',    (4, 3),   dict(shadow=.42, highlight=.08, sat=.60, contrast=1.08), [900, 600], 860, 66),
 'plant':       ('refin_circ',  (16, 9),  dict(shadow=.40, highlight=.08, sat=.62, contrast=1.06), [1200, 800], 1100, 66),
}

manifest = {}
total_files = 0
for name, (src, ratio, gk, widths, iw, iq) in SPEC.items():
    p = os.path.join(RAW, src + '.jpg')
    im = grade(crop_to(Image.open(p), ratio), **gk)
    entry = dict(lqip=lqip(im), w=im.width, h=im.height, srcs=[])
    for w in widths:
        data, sz = encode(im, w, 78 if w > 1000 else 80, 'WEBP')
        fn = '%s-%d.webp' % (name, w)
        open(os.path.join(OUT, fn), 'wb').write(data)
        entry['srcs'].append(dict(f=fn, w=sz[0], kb=round(len(data) / 1024)))
        total_files += len(data)
    jd, _ = encode(im, widths[0], 74, 'JPEG')
    open(os.path.join(OUT, '%s.jpg' % name), 'wb').write(jd)
    entry['jpg'] = '%s.jpg' % name
    inline, isz = encode(im, iw, iq, 'WEBP')
    entry['inline'] = 'data:image/webp;base64,' + base64.b64encode(inline).decode()
    entry['inline_kb'] = round(len(inline) / 1024)
    entry['ratio'] = '%d / %d' % ratio
    manifest[name] = entry
    print('%-13s %-12s %4dx%-4d files=%3dKB inline=%3dKB' %
          (name, src, im.width, im.height,
           sum(s['kb'] for s in entry['srcs']), entry['inline_kb']))

json.dump(manifest, open(os.path.join(ROOT, 'tools', 'imgs.json'), 'w'))
print('\nfiles total: %d KB   inline total: %d KB' %
      (total_files / 1024, sum(v['inline_kb'] for v in manifest.values())))
