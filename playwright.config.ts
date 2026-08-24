import { defineConfig, devices } from '@playwright/test';

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

/** Tests run against the static export in out/, served locally. */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npx --yes http-server out -p 4321 -s',
        url: 'http://127.0.0.1:4321/en/',
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
