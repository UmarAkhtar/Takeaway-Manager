const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3100',
  },
  webServer: {
    command: 'npm run build && npm run seed && npm start',
    url: 'http://localhost:3100/api/health',
    env: { PORT: '3100' },
    reuseExistingServer: false,
  },
});