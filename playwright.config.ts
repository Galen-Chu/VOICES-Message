import { defineConfig } from '@playwright/test';

/** E2E smoke:跑在 `npm run preview`(serve dist,含 base 路徑)。 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  workers: 4,
  retries: 1,
  reporter: process.env.CI ? 'list' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/VOICES-Message/',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
