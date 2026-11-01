import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  outputDir: '/tmp/playwright-results',
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    screenshot: 'only-on-failure',
    permissions: ['geolocation'],
    geolocation: { latitude: 37.5665, longitude: 126.978 },
  },
  retries: 0,
  workers: 1,
  webServer: {
    command: 'pnpm dev:mock --port 3001',
    port: 3001,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
