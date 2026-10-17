const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');
const { logIn } = require('./helpers');

async function placeOrderAt(request, pool, items, ukTime) {
    const menu = await (await request.get('/api/menu')).json();
    const lines = items.map(({ name, quantity }) => ({
        menuItemId: menu.find((item) => item.name === name).id,
        quantity,
    }));
    const order = await (await request.post('/api/orders', { data: { items: lines } })).json();

    // Move the order to a set day and time, given in UK time
    await pool.query(
        `UPDATE orders SET created_at = ($1::timestamp AT TIME ZONE 'Europe/London') WHERE id = $2`,
        [ukTime, order.id]
    );
    return order;
}

test('staff can see what was taken on a day', async ({ page }) => {
    const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await logIn(page);

    // A summer day, so UK time is an hour ahead of GMT
    await placeOrderAt(page.request, pool, [{ name: 'Chicken Tikka Masala', quantity: 2 }], '2020-06-15 09:00');
    await placeOrderAt(page.request, pool, [
        { name: 'Chicken Tikka Masala', quantity: 1 },
        { name: 'Coke', quantity: 3 },
    ], '2020-06-15 23:30');
    // Just after midnight counts as the next day
    await placeOrderAt(page.request, pool, [{ name: 'Coke', quantity: 1 }], '2020-06-16 00:30');
    await pool.end();

    const day = await (await page.request.get('/api/takings?date=2020-06-15')).json();
    expect(day).toEqual({
        date: '2020-06-15',
        orderCount: 2,
        totalPence: 2925,
        items: [
            { name: 'Chicken Tikka Masala', quantity: 3, totalPence: 2685 },
            { name: 'Coke', quantity: 3, totalPence: 240 },
        ],
    });

    const nextDay = await (await page.request.get('/api/takings?date=2020-06-16')).json();
    expect(nextDay.orderCount).toBe(1);
    expect(nextDay.totalPence).toBe(80);

    await page.goto('/takings');
    await expect(page.getByRole('heading', { name: 'End of day takings' })).toBeVisible();
    await page.getByLabel('Day').fill('2020-06-15');

    const summary = page.locator('.takings-summary');
    await expect(summary.getByText('£29.25')).toBeVisible();
    const tikkaRow = page.getByRole('row').filter({ hasText: 'Chicken Tikka Masala' });
    await expect(tikkaRow.getByRole('cell').nth(1)).toHaveText('3');
    await expect(tikkaRow.getByRole('cell').nth(2)).toHaveText('£26.85');

    await page.getByLabel('Day').fill('2020-01-01');
    await expect(page.getByText('No orders on this day')).toBeVisible();
});

test('only staff can see takings, and the day must be real', async ({ page, request }) => {
    expect((await request.get('/api/takings')).status()).toBe(401);

    await logIn(page);
    const today = await page.request.get('/api/takings');
    expect(today.status()).toBe(200);
    expect((await today.json()).date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    expect((await page.request.get('/api/takings?date=2026-02-30')).status()).toBe(400);
    expect((await page.request.get('/api/takings?date=yesterday')).status()).toBe(400);
});
