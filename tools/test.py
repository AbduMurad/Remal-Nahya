import os, asyncio
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


F = 'file://' + os.path.join(ROOT, 'dist', 'remal-nahya.html')
OUT = os.path.join(ROOT, 'tools', 'shots')

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(
            executable_path=chromium_path(), args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 1440, 'height': 950})
        errs = []
        pg.on('pageerror', lambda ex: errs.append('PAGEERROR: ' + str(ex)))
        pg.on('console', lambda m: errs.append('CONSOLE: ' + m.text) if m.type == 'error' else None)
        await pg.goto(F, wait_until='load')
        await pg.wait_for_timeout(1200)

        async def state(tag):
            d = await pg.evaluate("""() => {
              const vis = [...document.querySelectorAll('.site')].filter(s=>!s.hidden).map(s=>s.dataset.lang);
              const site = document.querySelector('.site:not([hidden])');
              const pages = site ? [...site.querySelectorAll('[data-page]')].filter(p=>!p.hidden).map(p=>p.dataset.page) : [];
              return {hash: location.hash, dir: document.documentElement.dir,
                      lang: document.documentElement.lang, sites: vis, pages,
                      title: document.title.slice(0,48),
                      h1: (site && site.querySelector('[data-page]:not([hidden]) h1')||{}).textContent};
            }""")
            print('%-14s %s' % (tag, d))
            return d

        await state('initial')
        for h in ['#/en/services', '#/en/ega-master', '#/ar/index', '#/ar/well-services',
                  '#/ar/contact', '#/en/about', '#/en/contact']:
            await pg.evaluate("h=>location.hash=h", h)
            await pg.wait_for_timeout(600)
            await state(h)

        # nav click test
        await pg.evaluate("location.hash='#/en/index'"); await pg.wait_for_timeout(500)
        await pg.click('.site:not([hidden]) .nav a[href="#/en/services"]')
        await pg.wait_for_timeout(700)
        await state('click nav')
        # lang toggle
        await pg.click('.site:not([hidden]) .hdr__cta .lang')
        await pg.wait_for_timeout(700)
        await state('lang toggle')

        # services filter
        await pg.evaluate("location.hash='#/en/services'"); await pg.wait_for_timeout(700)
        n_all = await pg.evaluate("document.querySelectorAll('.site:not([hidden]) [data-page=\\'services\\']:not([hidden]) .srv').length")
        await pg.click(".site:not([hidden]) [data-page='services']:not([hidden]) .chip[data-filter='wells']")
        await pg.wait_for_timeout(300)
        n_w = await pg.evaluate("[...document.querySelectorAll('.site:not([hidden]) [data-page=\\'services\\']:not([hidden]) .srv')].filter(e=>e.style.display!=='none').length")
        await pg.fill(".site:not([hidden]) [data-page='services']:not([hidden]) input[type=search]", 'cementing')
        await pg.wait_for_timeout(300)
        n_s = await pg.evaluate("[...document.querySelectorAll('.site:not([hidden]) [data-page=\\'services\\']:not([hidden]) .srv')].filter(e=>e.style.display!=='none').length")
        print('filter: total=%d wells=%d wells+"cementing"=%d' % (n_all, n_w, n_s))

        # form
        await pg.evaluate("location.hash='#/en/contact'"); await pg.wait_for_timeout(700)
        await pg.fill(".site:not([hidden]) [data-page='contact']:not([hidden]) #f-name", 'Test')
        await pg.fill(".site:not([hidden]) [data-page='contact']:not([hidden]) #f-em", 'a@b.com')
        await pg.fill(".site:not([hidden]) [data-page='contact']:not([hidden]) #f-msg", 'Zone 1, ATEX')
        await pg.click(".site:not([hidden]) [data-page='contact']:not([hidden]) #rfq button[type=submit]")
        await pg.wait_for_timeout(500)
        ok = await pg.evaluate("document.querySelector('.site:not([hidden]) [data-page=\\'contact\\']:not([hidden]) #rfqok').getAttribute('data-on')")
        print('form confirm:', ok)

        # mobile drawer must not leak when closed
        pg2 = await b.new_page(viewport={'width': 390, 'height': 844})
        await pg2.goto(F, wait_until='load'); await pg2.wait_for_timeout(900)
        leak = await pg2.evaluate("""() => {
          const d=document.querySelector('.site:not([hidden]) .drawer');
          const r=d.getBoundingClientRect();
          return {bottom: Math.round(r.bottom), vis: getComputedStyle(d).visibility};
        }""")
        print('drawer closed:', leak)
        await pg2.click('.site:not([hidden]) #burger'); await pg2.wait_for_timeout(700)
        openst = await pg2.evaluate("""() => {
          const d=document.querySelector('.site:not([hidden]) .drawer');
          return {top: Math.round(d.getBoundingClientRect().top), vis: getComputedStyle(d).visibility};
        }""")
        print('drawer open:  ', openst)
        await pg2.screenshot(path=os.path.join(OUT, 'drawer.png'))
        await pg2.close()

        print('\nERRORS:', errs[:8] if errs else 'none')
        await b.close()

        # gate CI on the things that must hold
        real = [x for x in errs if 'ERR_CONNECTION' not in x and 'favicon' not in x]
        checks = [
            ('no console/page errors', not real),
            ('catalogue filter narrows results', 0 < n_w < n_all),
            ('search narrows further', n_s <= n_w),
            ('contact form confirms', ok == 'true'),
            ('closed drawer is hidden', leak['vis'] == 'hidden'),
            ('open drawer is visible', openst['vis'] == 'visible'),
        ]
        for name, passed in checks:
            print('  %-34s %s' % (name, 'PASS' if passed else '** FAIL **'))
        if not all(p for _, p in checks):
            raise SystemExit(1)

asyncio.run(main())
