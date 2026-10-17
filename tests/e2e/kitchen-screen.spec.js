const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');
const { logIn } = require('./helpers');

async function placeOrder(request, items) {
    const menu = await (await request.get('/api/menu')).json();
    const lines = items.map(({ name, quantity }) => ({
        menuItemId: menu.find((item) => item.name === name).id,
        quantity,
    }));
    const response = await request.post('/api/orders', { data: { items: lines } });
    return response.json();
}

test('the kitchen sees new orders and can mark them ready', async ({ page }) => {
    await logIn(page);
    await page.goto('/kitchen');
    await expect(page.getByRole('heading', { name: 'Kitchen' })).toBeVisible();

    // Placed after the page is open, so it has to turn up by itself
    const order = await placeOrder(page.request, [
        { name: 'Chips', quantity: 2 },
        { name: 'Coke', quantity: 1 },
    ]);

    const card = page.getByRole('listitem').filter({
        has: page.getByRole('heading', { name: `Order #${order.id}`, exact: true }),
    });
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card.getByText('2 × Chips')).toBeVisible();
    await expect(card.getByText('1 × Coke')).toBeVisible();
    await expect(card.getByText(/Ready in (40:00|39:\d\d)/)).toBeVisible();

    await card.getByRole('button', { name: 'Ready' }).click();
    await expect(card).toHaveCount(0);

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Kitchen' })).toBeVisible();
    await expect(card).toHaveCount(0);
});

test('only staff can see or change orders', async ({ request }) => {
    const order = await placeOrder(request, [{ name: 'Fanta', quantity: 1 }]);

    expect((await request.get('/api/orders')).status()).toBe(401);
    const ready = await request.patch(`/api/orders/${order.id}`, { data: { status: 'ready' } });
    expect(ready.status()).toBe(401);
});

test('an order can only be marked ready once', async ({ page }) => {
    await logIn(page);
    const order = await placeOrder(page.request, [{ name: 'Sprite', quantity: 1 }]);

    const wrongStatus = await page.request.patch(`/api/orders/${order.id}`, { data: { status: 'cooking' } });
    expect(wrongStatus.status()).toBe(400);

    const first = await page.request.patch(`/api/orders/${order.id}`, { data: { status: 'ready' } });
    expect(first.status()).toBe(200);

    const second = await page.request.patch(`/api/orders/${order.id}`, { data: { status: 'ready' } });
    expect(second.status()).toBe(404);
});

test('an order counts as ready once 40 minutes have passed', async ({ page }) => {
    await logIn(page);
    const order = await placeOrder(page.request, [{ name: 'Irn-Bru', quantity: 1 }]);

    // Pretend the order came in 41 minutes ago
    const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await pool.query(`UPDATE orders SET created_at = now() - interval '41 minutes' WHERE id = $1`, [order.id]);

    const pending = await (await page.request.get('/api/orders')).json();
    expect(pending.some((waiting) => waiting.id === order.id)).toBe(false);

    const result = await pool.query('SELECT status FROM orders WHERE id = $1', [order.id]);
    expect(result.rows[0].status).toBe('ready');
    await pool.end();

    await page.goto('/kitchen');
    await expect(page.getByRole('heading', { name: 'Kitchen' })).toBeVisible();
    await expect(page.getByRole('heading', { name: `Order #${order.id}`, exact: true })).toHaveCount(0);
});
