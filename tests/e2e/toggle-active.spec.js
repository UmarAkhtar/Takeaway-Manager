const { test, expect } = require('@playwright/test');
const { logIn } = require('./helpers');

test('staff can turn an item off and back on', async ({ page }) => {
    await logIn(page);
    await page.getByRole('button', { name: 'Burgers' }).click();
    const row = page.getByRole('listitem').filter({ hasText: 'Ham Burger' });

    await row.getByRole('button', { name: 'Turn off' }).click();
    await expect(row.getByText('Off', { exact: true })).toBeVisible();

    await page.reload();
    await page.getByRole('button', { name: 'Burgers' }).click();
    await expect(row.getByText('Off', { exact: true })).toBeVisible();

    await row.getByRole('button', { name: 'Turn on' }).click();
    await expect(row.getByText('Off', { exact: true })).toBeHidden();
    await expect(row.getByRole('button', { name: 'Turn off' })).toBeVisible();
});