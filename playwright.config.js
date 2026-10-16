const { defineConfig } = require('@playwright/test');
const { TEST_STAFF } = require('./tests/e2e/helpers');

try {
  process.loadEnvFile('.env');
} catch {
  // No .env file, e.g. on GitHub. The settings come from the workflow instead.
}

if (!process.env.TEST_DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL is not set, so the browser tests have no database to use');
}

module.exports = defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3100',
  },
  webServer: {
    command: 'npm run build && npm run migrate && npm run seed && npm run create-staff && npm start',
    url: 'http://localhost:3100/api/health',
    env: {
      PORT: '3100',
      DATABASE_URL: process.env.TEST_DATABASE_URL,
      STAFF_USERNAME: TEST_STAFF.username,
      STAFF_PASSWORD: TEST_STAFF.password,
      SESSION_SECRET: 'test-session-secret',
    },
    reuseExistingServer: false,
  },
});
