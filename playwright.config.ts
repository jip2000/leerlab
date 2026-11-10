import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// In de cloud-omgeving staat al een Chromium klaar; lokaal gebruikt Playwright zijn eigen browser.
const cloudChromium = '/opt/pw-browsers/chromium';
const launchOptions = existsSync(cloudChromium) ? { executablePath: cloudChromium } : {};

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'off',
    launchOptions,
  },
  webServer: {
    // Met een nep-Supabase-adres, zodat de inlogschermen getest kunnen worden (de test vangt alle verzoeken af).
    command: 'VITE_SUPABASE_URL=https://test.supabase.invalid VITE_SUPABASE_ANON_KEY=test-anon npm run build && npm run preview -- --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    { name: 'mobiel', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
