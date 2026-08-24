import sys, os, asyncio
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
OUT = os.path.join(ROOT, 'tools', 'shots')
os.makedirs(OUT, exist_ok=True)

JOBS = eval(sys.argv[1]) if len(sys.argv) > 1 else [
    ('en/index.html', 'en-home', 1440, 900, True),
    ('ar/index.html', 'ar-home', 1440, 900, True),
]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chromium_path(),
                                    args=['--no-sandbox', '--font-render-hinting=none'])
        for path, name, w, h, full in JOBS:
            pg = await b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=2 if w < 600 else 1)
            errs = []
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            pg.on('pageerror', lambda ex: errs.append('PAGEERROR: ' + str(ex)))
            await pg.goto(os.environ.get('SHOT_BASE','http://127.0.0.1:8901/') + path, wait_until='networkidle', timeout=60000)
            await pg.wait_for_timeout(900)
            await pg.evaluate("document.querySelectorAll('[data-rv]').forEach(e=>e.setAttribute('data-in','true'))")
            if full:
                await pg.evaluate("""async()=>{const d=document.documentElement;
                  for(let y=0;y<d.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,110));}
                  window.scrollTo(0,0);await new Promise(r=>setTimeout(r,500));}""")
            await pg.screenshot(path=os.path.join(OUT, name + '.png'), full_page=full)
            if errs: print('  !! %s: %s' % (name, errs[:4]))
            print('shot', name, w)
            await pg.close()
        await b.close()

asyncio.run(main())
