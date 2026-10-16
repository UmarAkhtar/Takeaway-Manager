const { expect } = require('@playwright/test');

const TEST_STAFF = { username: 'teststaff', password: 'test-password-123' };

async function logIn(page) {
    await page.goto('/staff');
    await page.getByLabel('Username').fill(TEST_STAFF.username);
    await page.getByLabel('Password').fill(TEST_STAFF.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText(`Logged in as ${TEST_STAFF.username}`)).toBeVisible();
}

module.exports = { TEST_STAFF, logIn };
