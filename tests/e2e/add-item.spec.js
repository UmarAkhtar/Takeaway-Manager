const { test, expect } = require('@playwright/test');
const { logIn } = require('./helpers');

test('staff can add a menu item', async ({ page }) => {
    await logIn(page);
    await page.getByLabel('Name').fill('Test Wrap');
    await page.getByLabel('Price').fill('5.50');
    await page.getByLabel('Category').selectOption('Sundries');
    await page.getByRole('button', { name: 'Add item' }).click();
    await page.getByRole('button', { name: 'Sundries' }).click();
    await expect(page.getByText('Test Wrap')).toBeVisible();
});











