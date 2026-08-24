import { defineConfig, devices } from '@playwright/test';

/**
 * Tests run against the static export in out/, served the way the real host
 * serves it — mounted at NEXT_PUBLIC_BASE_PATH. Serving it at the root instead
 * gives you pages whose every asset 404s, which surfaces as a dozen unrelated
 * failures rather than one configuration mistake.
 *
 * Because baseURL therefore carries a path, test paths must be RELATIVE
 * ('en/', not '/en/') — a leading slash would discard the mount point.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const PORT = Number(process.env.PORT ?? 4321);
const baseURL = process.env.BASE_URL ?? `http://127.0.0.1:${PORT}${BASE_PATH}/`;

/**
 * Normally Playwright uses the browser it installed itself. CHROMIUM_PATH lets a
 * sandbox or a locked-down CI box point at a Chromium that is already present.
 */
const executablePath = process.env.CHROMIUM_PATH || undefined;
const launchOptions = {
  executablePath,
  // CI images and containers routinely run as root
  args: process.env.CI || process.env.CHROMIUM_PATH ? ['--no-sandbox'] : [],
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, trace: 'on-first-retry' },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'node scripts/serve.mjs',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions } },
    {
      name: 'mobile',
      // the iPhone descriptor defaults to WebKit; Chrome on Android is the
      // realistic target for this audience, and it keeps CI to one browser
      use: { ...devices['iPhone 13'], browserName: 'chromium', launchOptions },
    },
  ],
});
