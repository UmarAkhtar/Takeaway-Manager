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

module.exports = {
    pool,
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
