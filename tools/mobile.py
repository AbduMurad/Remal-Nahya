"""Mobile screenshots + bottom-bar assertions. Wants dist/ served on 8901."""
import asyncio, os, sys
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def chromium_path():
    import glob
    env = os.environ.get('CHROMIUM_PATH')
    if env and os.path.exists(env):
        return env
    for pat in ('/opt/pw-browsers/chromium-*/chrome-linux/chrome',
                os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome')):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None


BASE = os.environ.get('SHOT_BASE', 'http://127.0.0.1:8901/')
OUT = os.path.join(ROOT, 'tools', 'shots')
os.makedirs(OUT, exist_ok=True)

JOBS = [('en/index.html', 'm-en-home', 390, 844),
        ('ar/index.html', 'm-ar-home', 390, 844),
        ('en/services.html', 'm-en-srv', 390, 844),
        ('en/contact.html', 'm-en-con', 360, 740),
        ('en/index.html', 'm-en-tiny', 320, 640)]

PROBE = """() => {
  const bar = document.querySelector('.tabbar');
  if (!bar) return {err: 'no .tabbar'};
  const cs = getComputedStyle(bar), r = bar.getBoundingClientRect();
  const links = [...bar.querySelectorAll('a')].map(a => {
    const b = a.getBoundingClientRect();
    return {w: Math.round(b.width), h: Math.round(b.height),
            label: a.querySelector('.tabbar__l').textContent,
            cur: a.getAttribute('aria-current') === 'page',
            cta: a.classList.contains('is-cta')};
  });
  const bodyPad = parseFloat(getComputedStyle(document.body).paddingBottom);
  // does the bar cover the last thing in the footer?
  const last = document.querySelector('.foot__bar');
  const lastR = last ? last.getBoundingClientRect() : null;
  return {
    display: cs.display, pos: cs.position,
    bottom: Math.round(r.bottom), vh: window.innerHeight,
    barH: Math.round(r.height), bodyPad: Math.round(bodyPad),
    links,
    topbarHidden: getComputedStyle(document.querySelector('.topbar')).display === 'none',
    footerClear: lastR ? Math.round(lastR.bottom) <= Math.round(r.top) + 2 : null,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
}"""


async def main():
    fails = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chromium_path(), args=['--no-sandbox'])
        for path, name, w, h in JOBS:
            pg = await b.new_page(viewport={'width': w, 'height': h},
                                  device_scale_factor=2, is_mobile=True, has_touch=True)
            await pg.goto(BASE + path, wait_until='networkidle', timeout=60000)
            await pg.wait_for_timeout(700)
            await pg.screenshot(path=os.path.join(OUT, name + '-top.png'))
            # scroll until it actually stops moving — Arabic pages are taller and
            # lazy images keep extending the document while it settles
            await pg.evaluate('''async () => {
              let last = -1;
              for (let i = 0; i < 40; i++) {
                window.scrollTo(0, document.documentElement.scrollHeight);
                await new Promise(r => setTimeout(r, 120));
                if (Math.round(window.scrollY) === last) break;
                last = Math.round(window.scrollY);
              }
            }''')
            await pg.wait_for_timeout(500)
            await pg.screenshot(path=os.path.join(OUT, name + '-bot.png'))
            d = await pg.evaluate(PROBE)

            print('\n%s  %dx%d' % (name, w, h))
            if 'err' in d:
                fails.append('%s: %s' % (name, d['err'])); print('  **', d['err']); await pg.close(); continue
            print('   bar %spx, sits at %d of %dvh | body pad %dpx | topbar hidden %s | overflow-x %d'
                  % (d['barH'], d['bottom'], d['vh'], d['bodyPad'], d['topbarHidden'], d['overflowX']))
            for L in d['links']:
                flag = ('  ← active' if L['cur'] else '') + ('  ← cta' if L['cta'] else '')
                print('     %-10s %3dx%-3d%s' % (L['label'], L['w'], L['h'], flag))

            def bad(cond, msg):
                if cond:
                    fails.append('%s: %s' % (name, msg)); print('     ** FAIL:', msg)

            bad(d['display'] == 'none', 'bar not shown at this width')
            bad(d['pos'] != 'fixed', 'bar is not fixed')
            bad(abs(d['bottom'] - d['vh']) > 2, 'bar not flush to the viewport bottom')
            bad(len(d['links']) != 5, 'expected 5 tabs, found %d' % len(d['links']))
            bad(sum(1 for L in d['links'] if L['cur']) != 1, 'exactly one tab must be current')
            bad(sum(1 for L in d['links'] if L['cta']) != 1, 'exactly one tab must be the CTA')
            for L in d['links']:
                bad(L['w'] < 44 or L['h'] < 44,
                    'touch target %s is %dx%d, under 44x44' % (L['label'], L['w'], L['h']))
            bad(d['bodyPad'] < d['barH'] - 1, 'body padding %d < bar height %d — content hides behind the bar'
                % (d['bodyPad'], d['barH']))
            bad(d['footerClear'] is False, 'bar covers the end of the footer')
            bad(d['overflowX'] > 0, 'horizontal overflow of %dpx' % d['overflowX'])
            await pg.close()
        await b.close()

    print('\n' + '=' * 62)
    if fails:
        print('MOBILE: %d failure(s)' % len(fails))
        for f in fails:
            print('  -', f)
        sys.exit(1)
    print('MOBILE: all checks pass')


asyncio.run(main())
