import os, re, json, glob, asyncio
from playwright.async_api import async_playwright

import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def chromium_path():
    """Playwright's bundled Chromium, wherever this checkout happens to run."""
    import glob
    env = os.environ.get('CHROMIUM_PATH')
    if env and os.path.exists(env):
        return env
    for pat in ('/opt/pw-browsers/chromium-*/chrome-linux/chrome',
                os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome')):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None            # let Playwright resolve it itself


DIST = os.path.join(ROOT, 'dist')
BASE = os.environ.get('QA_BASE','http://127.0.0.1:8901/')

# ---------- 1. link integrity (static) ----------
def links():
    bad = []
    for f in glob.glob(DIST + '/[ea][nr]/*.html'):
        d = os.path.dirname(f)
        html = open(f, encoding='utf-8').read()
        for href in re.findall(r'href="([^"]+)"', html):
            if href.startswith(('http', 'mailto:', 'tel:', 'data:', '#')):
                continue
            tgt = os.path.normpath(os.path.join(d, href.split('#')[0]))
            if not os.path.exists(tgt):
                bad.append((os.path.relpath(f, DIST), href))
        for src in re.findall(r'src="([^"]+)"', html) + re.findall(r'srcset="([^"]+)"', html):
            for part in src.split(','):
                u = part.strip().split(' ')[0]
                if u.startswith(('data:', 'http')) or not u:
                    continue
                if not os.path.exists(os.path.normpath(os.path.join(d, u))):
                    bad.append((os.path.relpath(f, DIST), u))
    return bad


# ---------- 2. contrast ----------
def lum(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]


def cr(a, b):
    la, lb = lum(a), lum(b)
    return round((max(la, lb) + .05) / (min(la, lb) + .05), 2)


PAIRS = [
    ('body text on white',        '#3E4C74', '#FFFFFF', 4.5),
    ('ink on paper',              '#0B1533', '#F4F6FA', 4.5),
    ('body text on paper',        '#3E4C74', '#F4F6FA', 4.5),
    ('white on navy-900',         '#FFFFFF', '#0B1533', 4.5),
    ('white on navy-800',         '#FFFFFF', '#101E42', 4.5),
    ('white on navy-700',         '#FFFFFF', '#16264F', 4.5),
    ('steel-200 on navy-800',     '#B6C1D6', '#101E42', 4.5),
    ('steel-200 on navy-900',     '#B6C1D6', '#0B1533', 4.5),
    ('steel-300 on navy-900 (sm)', '#7C8DB5', '#0B1533', 4.5),
    ('white on crimson-600',      '#FFFFFF', '#C8102E', 4.5),
    ('crimson-600 on white',      '#C8102E', '#FFFFFF', 4.5),
    ('crimson-600 on paper',      '#C8102E', '#F4F6FA', 4.5),
    ('crimson-500 on navy-900 (lg)', '#E01235', '#0B1533', 3.0),
    ('steel-300 border on navy',  '#7C8DB5', '#0B1533', 3.0),
    ('steel-300 on navy-800',     '#7C8DB5', '#101E42', 4.5),
]


# ---------- 3. live DOM audit ----------
async def dom():
    pages = ['en/index.html', 'en/services.html', 'en/ega-master.html',
             'en/well-services.html', 'en/about.html', 'en/contact.html',
             'ar/index.html', 'ar/services.html', 'ar/contact.html']
    out = []
    async with async_playwright() as p:
        b = await p.chromium.launch(
            executable_path=chromium_path(), args=['--no-sandbox'])
        for u in pages:
            pg = await b.new_page(viewport={'width': 1440, 'height': 950})
            bytes_ = {'n': 0}
            pg.on('response', lambda r: None)
            await pg.goto(BASE + u, wait_until='networkidle')
            await pg.wait_for_timeout(500)
            r = await pg.evaluate("""() => {
              const q=s=>[...document.querySelectorAll(s)];
              const hs=q('h1,h2,h3,h4').map(h=>+h.tagName[1]);
              let jump=0, prev=0;
              hs.forEach(l=>{ if(prev && l>prev+1) jump++; prev=l; });
              return {
                h1: q('h1').length,
                noAlt: q('img').filter(i=>!i.hasAttribute('alt')).length,
                imgs: q('img').length,
                jumps: jump,
                noLabel: q('input,select,textarea').filter(
                  i=>!i.getAttribute('aria-label') &&
                     (!i.id || !document.querySelector('label[for="'+i.id+'"]'))).length,
                emptyLinks: q('a').filter(a=>!a.textContent.trim() && !a.getAttribute('aria-label')).length,
                btnNoName: q('button').filter(x=>!x.textContent.trim() && !x.getAttribute('aria-label')).length,
                lang: document.documentElement.lang, dir: document.documentElement.dir,
                title: document.title.length, desc: (document.querySelector('meta[name=description]')||{}).content?.length||0,
                hreflang: q('link[rel=alternate]').length,
                overflowX: document.documentElement.scrollWidth > window.innerWidth + 2,
              };}""")
            # mobile overflow
            await pg.set_viewport_size({'width': 360, 'height': 780})
            await pg.wait_for_timeout(400)
            r['overflowX_360'] = await pg.evaluate(
                "document.documentElement.scrollWidth > window.innerWidth + 2")
            r['page'] = u
            out.append(r)
            await pg.close()
        await b.close()
    return out


print('=' * 74)
print('1. LINK / ASSET INTEGRITY')
bad = links()
print('   broken references:', len(bad))
for x in bad[:12]:
    print('     ', x)

print('\n2. COLOUR CONTRAST (WCAG 2.1)')
fails = 0
for name, fg, bg, need in PAIRS:
    v = cr(fg, bg)
    ok = v >= need
    if not ok:
        fails += 1
    print('   %-32s %5.2f:1  need %.1f  %s' % (name, v, need, 'PASS' if ok else '** FAIL **'))
print('   known-bad pair kept out of the design:')
print('   %-32s %5.2f:1  (crimson text on navy — never used)' % ('crimson-600 on navy-600', cr('#C8102E', '#1B2A5B')))

print('\n3. PER-PAGE DOM AUDIT')
rows = asyncio.run(dom())
hdr = ('page', 'h1', 'img', 'noAlt', 'hJump', 'noLbl', 'a□', 'b□', 'lang', 'dir', 'hrefl', 'ovf', 'ovf360')
print('   %-24s %3s %4s %6s %6s %6s %3s %3s %5s %4s %6s %4s %7s' % hdr)
prob = 0
for r in rows:
    bad_row = (r['h1'] != 1 or r['noAlt'] or r['jumps'] or r['noLabel']
               or r['emptyLinks'] or r['btnNoName'] or r['overflowX'] or r['overflowX_360'])
    prob += bool(bad_row)
    print('   %-24s %3d %4d %6d %6d %6d %3d %3d %5s %4s %6d %4s %7s%s' % (
        r['page'], r['h1'], r['imgs'], r['noAlt'], r['jumps'], r['noLabel'],
        r['emptyLinks'], r['btnNoName'], r['lang'], r['dir'], r['hreflang'],
        r['overflowX'], r['overflowX_360'], '   <<<' if bad_row else ''))

print('\n4. WEIGHT')
tot = 0
for f in sorted(glob.glob(DIST + '/en/*.html')):
    n = os.path.getsize(f)
    tot += n
    print('   %-34s %6.1f KB' % (os.path.basename(f), n / 1024))
ass = sum(os.path.getsize(f) for f in glob.glob(DIST + '/assets/**/*', recursive=True) if os.path.isfile(f))
print('   %-34s %6.1f KB' % ('all assets (img+font+css+js)', ass / 1024))
print('   %-34s %6.2f MB' % ('single-file demo', os.path.getsize(DIST + '/remal-nahya.html') / 1048576))
print('=' * 74)
print('SUMMARY: %d broken refs, %d contrast fails, %d pages with DOM issues'
      % (len(bad), fails, prob))

# non-zero exit so CI can gate a deploy on this
import sys
sys.exit(1 if (bad or fails or prob) else 0)
