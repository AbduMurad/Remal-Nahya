import { test, expect, type Page } from '@playwright/test';

const PAGES = ['', 'services/', 'ega-master/', 'well-services/', 'about/', 'contact/'];
const LANGS = ['en', 'ar'] as const;
const ALL = LANGS.flatMap((l) => PAGES.map((p) => `/${l}/${p}`));

/* ------------------------------------------------------------------ pages */

test.describe('every page', () => {
  for (const path of ALL) {
    test(`${path} renders cleanly`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

      const res = await page.goto(path);
      expect(res?.status(), 'http status').toBeLessThan(400);

      const lang = path.split('/')[1];
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

      // exactly one h1, a non-empty title and description
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.title()).not.toEqual('');
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(desc?.length ?? 0).toBeGreaterThan(60);

      // reciprocal hreflang, both directions plus x-default
      for (const hl of ['en', 'ar', 'x-default']) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hl}"]`)).toHaveCount(1);
      }

      // every image has an alt attribute (empty is fine on decorative ones)
      const noAlt = await page.locator('img:not([alt])').count();
      expect(noAlt, 'images missing alt').toBe(0);

      // nothing may overflow horizontally
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, 'horizontal overflow').toBeLessThanOrEqual(0);

      expect(errors, 'console/page errors').toEqual([]);
    });
  }
});

/* ------------------------------------------------------------------ links */

test('no internal link 404s', async ({ page, baseURL }) => {
  const seen = new Set<string>();
  for (const path of ALL) {
    await page.goto(path);
    const hrefs = await page.locator('a[href]').evaluateAll((as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? ''));
    for (const h of hrefs) {
      if (!h || h.startsWith('#') || /^(mailto|tel|https?):/.test(h)) continue;
      seen.add(new URL(h, `${baseURL}${path}`).pathname);
    }
  }
  const bad: string[] = [];
  for (const p of seen) {
    const r = await page.request.get(p);
    if (r.status() >= 400) bad.push(`${p} -> ${r.status()}`);
  }
  expect(bad, 'broken internal links').toEqual([]);
});

/* ---------------------------------------------------------- language pair */

test('the language switch lands on the matching page', async ({ page }) => {
  await page.goto('/en/well-services/');
  await page.locator('.hdr .lang').click();
  await expect(page).toHaveURL(/\/ar\/well-services\/$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.locator('.hdr .lang').click();
  await expect(page).toHaveURL(/\/en\/well-services\/$/);
});

test('the root gate offers both languages', async ({ page }) => {
  const r = await page.request.get('/');
  expect(r.status()).toBe(200);
  const html = await r.text();
  expect(html).toContain('/en/');
  expect(html).toContain('/ar/');
});

/* ---------------------------------------------------------------- RTL care */

test('Arabic never applies letter-spacing, and Latin runs stay isolated', async ({ page }) => {
  await page.goto('/ar/');
  const spaced = await page.evaluate(() =>
    [...document.querySelectorAll('body *')].filter((el) => {
      const ls = getComputedStyle(el).letterSpacing;
      return ls && ls !== 'normal' && parseFloat(ls) !== 0;
    }).length);
  expect(spaced, 'elements with letter-spacing in RTL').toBe(0);

  // Latin inside Arabic prose must be wrapped so the bidi boundary behaves
  await expect(page.locator('bdi').first()).toBeVisible();
});

test('Arabic uses Western numerals, as Libya does', async ({ page }) => {
  await page.goto('/ar/');
  const text = await page.locator('body').innerText();
  expect(text, 'Eastern Arabic-Indic digits found').not.toMatch(/[٠-٩]/);
});

/* -------------------------------------------------------------- catalogue */

test('the catalogue filters and searches', async ({ page }) => {
  await page.goto('/en/services/');
  const cards = page.locator('.srv');
  const all = await cards.count();
  expect(all).toBeGreaterThan(15);

  await page.getByRole('button', { name: 'Well services' }).click();
  const wells = await cards.count();
  expect(wells).toBeGreaterThan(0);
  expect(wells).toBeLessThan(all);

  await page.locator('.searchbox input').fill('cementing');
  expect(await cards.count()).toBeLessThanOrEqual(wells);

  await page.locator('.searchbox input').fill('zzzzzz');
  await expect(page.locator('#noresult')).toBeVisible();
});

/* ------------------------------------------------------------------- form */

test('the contact form confirms and says it is a demo', async ({ page }) => {
  await page.goto('/en/contact/');
  await page.locator('#f-name').fill('Test');
  await page.locator('#f-em').fill('t@example.com');
  await page.locator('#f-msg').fill('Zone 1, ATEX, 20 sets, Tripoli.');
  await page.getByRole('button', { name: /send enquiry/i }).click();
  const ok = page.locator('#rfqok');
  await expect(ok).toBeVisible();
  await expect(ok).toContainText(/demonstration/i);
});

/* ------------------------------------------------------------- wellbore */

test('the wellbore highlights the stage you scroll to', async ({ page }) => {
  await page.goto('/en/well-services/');
  const stick = page.locator('.wellstick');
  const steps = page.locator('.wstep');
  await expect(steps).toHaveCount(4);

  await steps.nth(2).hover();
  await expect(stick).toHaveAttribute('data-active', 'completion');
  await expect(steps.nth(2)).toHaveAttribute('data-on', 'true');
  await expect(steps.nth(0)).toHaveAttribute('data-on', 'false');
});

/* ------------------------------------------------------------ bottom bar */

test.describe('bottom tab bar', () => {
  test.skip(({ isMobile }) => !isMobile, 'phones and small tablets only');

  for (const lang of LANGS) {
    test(`${lang}: fixed, flush, and every target is tappable`, async ({ page }) => {
      await page.goto(`/${lang}/services/`);
      const bar = page.locator('.tabbar');
      await expect(bar).toBeVisible();

      const links = bar.locator('a');
      await expect(links).toHaveCount(5);
      await expect(bar.locator('a[aria-current="page"]')).toHaveCount(1);
      await expect(bar.locator('a.is-cta')).toHaveCount(1);

      const geom = await page.evaluate(() => {
        const b = document.querySelector('.tabbar')!.getBoundingClientRect();
        return {
          bottom: Math.round(b.bottom),
          vh: window.innerHeight,
          h: Math.round(b.height),
          pad: Math.round(parseFloat(getComputedStyle(document.body).paddingBottom)),
          fixed: getComputedStyle(document.querySelector('.tabbar')!).position,
        };
      });
      expect(geom.fixed).toBe('fixed');
      expect(Math.abs(geom.bottom - geom.vh), 'flush to the viewport bottom').toBeLessThanOrEqual(2);
      // one token drives both, so they must not drift
      expect(geom.pad, 'body padding clears the bar').toBeGreaterThanOrEqual(geom.h - 1);

      for (let i = 0; i < 5; i++) {
        const box = await links.nth(i).boundingBox();
        expect(box!.width, `tab ${i} width`).toBeGreaterThanOrEqual(44);
        expect(box!.height, `tab ${i} height`).toBeGreaterThanOrEqual(44);
      }
    });
  }

  test('the bar never covers the end of the footer', async ({ page }) => {
    await page.goto('/ar/');
    await settle(page);
    const clear = await page.evaluate(() => {
      const bar = document.querySelector('.tabbar')!.getBoundingClientRect();
      const last = document.querySelector('.foot__bar')!.getBoundingClientRect();
      return Math.round(last.bottom) <= Math.round(bar.top) + 2;
    });
    expect(clear).toBe(true);
  });

  test('the drawer still carries all six pages', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('#burger').click();
    const drawer = page.locator('#drawer');
    await expect(drawer).toHaveAttribute('data-open', 'true');
    await expect(drawer.locator('nav a')).toHaveCount(6);
    await page.keyboard.press('Escape');
    await expect(drawer).toHaveAttribute('data-open', 'false');
  });
});

/** Scroll until the document stops growing — Arabic pages are taller and lazy
 *  images keep extending them while they settle. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    let last = -1;
    for (let i = 0; i < 40; i++) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 120));
      if (Math.round(window.scrollY) === last) break;
      last = Math.round(window.scrollY);
    }
  });
  await page.waitForTimeout(400);
}
