const { test, expect } = require('@playwright/test');

test('a customer can fill a basket and place an order', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Your basket is empty')).toBeVisible();

    const tikka = page.getByRole('listitem').filter({ hasText: 'Chicken Tikka Masala' });
    const dopiaza = page.getByRole('listitem').filter({ hasText: 'Chicken Dopiaza' });
    await tikka.getByRole('button', { name: 'Add' }).click();
    await tikka.getByRole('button', { name: 'Add' }).click();
    await dopiaza.getByRole('button', { name: 'Add' }).click();

    const basket = page.getByRole('region', { name: 'Basket' });
    await expect(basket.getByText('2 × Chicken Tikka Masala')).toBeVisible();
    await expect(basket.getByText('Total £24.85')).toBeVisible();

    await basket.getByRole('button', { name: 'One less Chicken Dopiaza' }).click();
    await expect(basket.getByText('Chicken Dopiaza')).toHaveCount(0);
    await expect(basket.getByText('Total £17.90')).toBeVisible();

    await basket.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByText(/Thanks! Your order number is \d+/)).toBeVisible();
    await expect(page.getByText('Total to pay when you collect: £17.90')).toBeVisible();
});

test('the server charges the real price, not one the browser makes up', async ({ request }) => {
    const menu = await (await request.get('/api/menu')).json();
    const tikka = menu.find((item) => item.name === 'Chicken Tikka Masala');

    const response = await request.post('/api/orders', {
        data: { items: [{ menuItemId: tikka.id, quantity: 1, pricePence: 1 }] },
    });
    expect(response.status()).toBe(201);
    const order = await response.json();
    expect(order.totalPence).toBe(895);
    expect(order.items[0].pricePence).toBe(895);
});

test('the server turns down empty baskets and unknown items', async ({ request }) => {
    const empty = await request.post('/api/orders', { data: { items: [] } });
    expect(empty.status()).toBe(400);

    const unknown = await request.post('/api/orders', {
        data: { items: [{ menuItemId: 999999, quantity: 1 }] },
    });
    expect(unknown.status()).toBe(400);
});
