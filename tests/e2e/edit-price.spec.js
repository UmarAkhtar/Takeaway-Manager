const { test, expect } = require('@playwright/test');

test('staff can edit an item price', async ({ page }) => {
    await page.goto('/');
    const row = page.getByRole('listitem').filter({ hasText: 'Chicken Korma' });
    await row.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Price for Chicken Korma').fill('7.50');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(row.getByText('£7.50')).toBeVisible();
});
