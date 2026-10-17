const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getMenuItems(includeInactive = false) {
    const sql = includeInactive
        ? 'SELECT * FROM menu_items WHERE removed = false ORDER BY id'
        : 'SELECT * FROM menu_items WHERE active = true AND removed = false ORDER BY id';
    const result = await pool.query(sql);
    return result.rows;
}

async function getMenuItem(id) {
    if (!Number.isInteger(id)) {
        return undefined;
    }
    const result = await pool.query('SELECT * FROM menu_items WHERE id = $1 AND removed = false', [id]);
    return result.rows[0];
}

async function getCategories() {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    return result.rows;
}

async function getCategory(id) {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
}

async function addMenuItem(name, pricePence, categoryId) {
    const result = await pool.query(
        'INSERT INTO menu_items (name, price_pence, category_id) VALUES ($1, $2, $3) RETURNING *',
        [name, pricePence, categoryId]
    );
    return result.rows[0];
}

async function updateMenuItemPrice(id, pricePence) {
    const result = await pool.query(
        'UPDATE menu_items SET price_pence = $1 WHERE id = $2 RETURNING *',
        [pricePence, id]
    );
    return result.rows[0];
}

async function updateMenuItemActive(id, active) {
    const result = await pool.query(
        'UPDATE menu_items SET active = $1 WHERE id = $2 RETURNING *',
        [active, id]
    );
    return result.rows[0];
}

async function removeMenuItem(id) {
    await pool.query('UPDATE menu_items SET removed = true, active = false WHERE id = $1', [id]);
}

async function getStaffByUsername(username) {
    const result = await pool.query('SELECT * FROM staff WHERE username = $1', [username]);
    return result.rows[0];
}

// Saves the order and all its lines together, or nothing at all if anything fails
async function createOrder(lines) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const orderResult = await client.query('INSERT INTO orders DEFAULT VALUES RETURNING *');
        const order = orderResult.rows[0];

        for (const line of lines) {
            await client.query(
                `INSERT INTO order_items (order_id, menu_item_id, name, price_pence, quantity)
                 VALUES ($1, $2, $3, $4, $5)`,
                [order.id, line.menuItemId, line.name, line.pricePence, line.quantity]
            );
        }

        await client.query('COMMIT');
        return order;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

const MINUTES_UNTIL_READY = 40;

// Any order waiting longer than the cooking time counts as ready
async function markOldOrdersReady() {
    await pool.query(
        `UPDATE orders SET status = 'ready'
         WHERE status = 'pending' AND created_at <= now() - make_interval(mins => $1)`,
        [MINUTES_UNTIL_READY]
    );
}

const ORDER_COLUMNS = `
    orders.id AS order_id,
    orders.status,
    orders.created_at,
    orders.created_at + make_interval(mins => $1) AS ready_at,
    order_items.name,
    order_items.price_pence,
    order_items.quantity`;

// The database gives one row per item, so join those back up into one entry per order
function groupOrderRows(rows) {
    const orders = new Map();
    for (const row of rows) {
        if (!orders.has(row.order_id)) {
            orders.set(row.order_id, {
                id: row.order_id,
                status: row.status,
                createdAt: row.created_at,
                readyAt: row.ready_at,
                totalPence: 0,
                items: [],
            });
        }
        const order = orders.get(row.order_id);
        order.items.push({ name: row.name, quantity: row.quantity });
        order.totalPence += row.price_pence * row.quantity;
    }
    return [...orders.values()];
}

// Orders still waiting to be cooked, oldest first, each with its own list of items
async function getPendingOrders() {
    await markOldOrdersReady();
    const result = await pool.query(
        `SELECT ${ORDER_COLUMNS}
         FROM orders
         JOIN order_items ON order_items.order_id = orders.id
         WHERE orders.status = 'pending'
         ORDER BY orders.created_at, orders.id, order_items.id`,
        [MINUTES_UNTIL_READY]
    );
    return groupOrderRows(result.rows);
}


// Only a pending order can be marked ready, so nothing comes back for unknown or finished ones
async function markOrderReady(id) {
    if (!Number.isInteger(id)) {
        return undefined;
    }
    const result = await pool.query(
        `UPDATE orders SET status = 'ready' WHERE id = $1 AND status = 'pending' RETURNING *`,
        [id]
    );
    return result.rows[0];
}

module.exports = {
    pool,
    createOrder,
    getPendingOrders,
    markOrderReady,
    getMenuItems,
    getMenuItem,
    getCategories,
    getCategory,
    addMenuItem,
    updateMenuItemPrice,
    updateMenuItemActive,
    removeMenuItem,
    getStaffByUsername
};
