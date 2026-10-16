const { test, expect } = require('@playwright/test');
const { logIn } = require('./helpers');

test('staff page asks for a login first', async ({ page }) => {
    await page.goto('/staff');
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add item' })).toHaveCount(0);
});

test('a wrong password shows an error', async ({ page }) => {
    await page.goto('/staff');
    await page.getByLabel('Username').fill('teststaff');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText('Wrong username or password')).toBeVisible();
});

test('staff can log in and out', async ({ page }) => {
    await logIn(page);
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});

test('the server refuses staff changes when logged out', async ({ request }) => {
    const response = await request.patch('/api/menu/1', { data: { active: false } });
    expect(response.status()).toBe(401);
});
