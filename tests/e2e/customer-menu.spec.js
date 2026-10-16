const { test, expect } = require('@playwright/test');

test('customers see the menu without staff buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Chicken Tikka Masala')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Turn off' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add item' })).toHaveCount(0);
});