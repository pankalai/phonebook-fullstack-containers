import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
      command: 'npm start',
      url: 'http://localhost:3001/',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  testDir: './e2e-tests',
  use: {
    baseURL: 'http://localhost:3001',
    headless: true
  }
})
