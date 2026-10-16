const { defineConfig } = require('@playwright/test');
const { TEST_STAFF } = require('./tests/e2e/helpers');

module.exports = defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3100',
  },
  webServer: {
    command: 'npm run build && npm run seed && npm start',
    url: 'http://localhost:3100/api/health',
    env: {
      PORT: '3100',
      STAFF_USERNAME: TEST_STAFF.username,
      STAFF_PASSWORD: TEST_STAFF.password,
      SESSION_SECRET: 'test-session-secret',
    },
    reuseExistingServer: false,
  },
});
