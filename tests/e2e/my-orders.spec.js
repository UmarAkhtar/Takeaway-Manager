const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');

async function orderFromMenu(page) {
    await page.goto('/');
    const curry = page.getByRole('listitem').filter({ hasText: 'Chicken Bhoona' });
    await curry.getByRole('button', { name: 'Add' }).click();
    await curry.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Place order' }).click();

    const thanks = page.getByText(/Thanks! Your order number is \d+/);
    await expect(thanks).toBeVisible();
    return Number((await thanks.textContent()).match(/\d+/)[0]);
}

test('a customer can see the orders they placed', async ({ page }) => {
    const orderId = await orderFromMenu(page);

    await page.getByRole('link', { name: 'Track it on My orders' }).click();
    await expect(page.getByRole('heading', { name: 'My orders' })).toBeVisible();

    const card = page.getByRole('listitem').filter({
        has: page.getByRole('heading', { name: `Order #${orderId}`, exact: true }),
    });
    await expect(card.getByText('2 × Chicken Bhoona')).toBeVisible();
    await expect(card.getByText('£13.90')).toBeVisible();
    await expect(card.getByText(/Ready in (40:00|39:\d\d)/)).toBeVisible();

    // Still there after a reload, because it is kept in the session
    await page.reload();
    await expect(card).toBeVisible();
});

test('another visitor cannot see someone else\'s orders', async ({ page, browser }) => {
    await orderFromMenu(page);

    const stranger = await browser.newContext();
    const strangerPage = await stranger.newPage();
    await strangerPage.goto('/my-orders');
    await expect(strangerPage.getByText("You haven't placed any orders yet")).toBeVisible();
    await stranger.close();
});

test('an order shows as ready to collect after 40 minutes', async ({ page }) => {
    const orderId = await orderFromMenu(page);

    // Pretend the order came in 41 minutes ago
    const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await pool.query(`UPDATE orders SET created_at = now() - interval '41 minutes' WHERE id = $1`, [orderId]);
    await pool.end();

    await page.goto('/my-orders');
    const card = page.getByRole('listitem').filter({
        has: page.getByRole('heading', { name: `Order #${orderId}`, exact: true }),
    });
    await expect(card.getByText('Ready to collect')).toBeVisible();
});
