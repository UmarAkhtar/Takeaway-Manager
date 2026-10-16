const { test, expect } = require('@playwright/test');
const { logIn } = require('./helpers');

test('staff can remove an item from both menus', async ({ page }) => {
    await logIn(page);
    await page.getByRole('button', { name: 'Drinks' }).click();
    const row = page.getByRole('listitem').filter({ hasText: 'Water' });

    page.once('dialog', (dialog) => dialog.accept());
    await row.getByRole('button', { name: 'Remove' }).click();
    await expect(row).toHaveCount(0);

    await page.reload();
    await page.getByRole('button', { name: 'Drinks' }).click();
    await expect(row).toHaveCount(0);

    await page.goto('/');
    await page.getByRole('button', { name: 'Drinks' }).click();
    await expect(page.getByText('Coke')).toBeVisible();
    await expect(page.getByText('Water')).toHaveCount(0);
});

test('cancelling keeps the item', async ({ page }) => {
    await logIn(page);
    await page.getByRole('button', { name: 'Drinks' }).click();
    const row = page.getByRole('listitem').filter({ hasText: 'Sprite' });

    page.once('dialog', (dialog) => dialog.dismiss());
    await row.getByRole('button', { name: 'Remove' }).click();
    await expect(row).toBeVisible();
});
