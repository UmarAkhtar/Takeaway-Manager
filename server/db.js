const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(path.join(__dirname, '..', 'practice.db'));
db.exec('PRAGMA foreign_keys = ON');

function getMenuItems(includeInactive = false) {
    if (includeInactive) {
        return db.prepare('SELECT * FROM menu_items WHERE removed = 0').all();
    }
    return db.prepare('SELECT * FROM menu_items WHERE active = 1 AND removed = 0').all();
}

function getMenuItem(id) {
    return db.prepare('SELECT * FROM menu_items WHERE id = ? AND removed = 0').get(id);
}

function getCategories() {
    return db.prepare('SELECT * FROM categories').all();
}

function getCategory(id) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
}

function addMenuItem(name, pricePence, categoryId) {
    const result = db.prepare('INSERT INTO menu_items (name, price_pence, category_id) VALUES (?, ?, ?)').run(name, pricePence, categoryId);

    return getMenuItem(result.lastInsertRowid);
}

function updateMenuItemPrice(id, pricePence) {
    db.prepare('UPDATE menu_items SET price_pence = ? WHERE id = ?').run(pricePence, id);
    return getMenuItem(id);
}

function updateMenuItemActive(id, active) {
    db.prepare('UPDATE menu_items SET active = ? WHERE id = ?').run(active ? 1 : 0, id);
    return getMenuItem(id);
}

function removeMenuItem(id) {
    db.prepare('UPDATE menu_items SET removed = 1, active = 0 WHERE id = ?').run(id);
}

function getStaffByUsername(username) {
    return db.prepare('SELECT * FROM staff WHERE username = ?').get(username);
}

module.exports = {
    getMenuItems,
    getMenuItem,
    getCategories,
    db,
    addMenuItem, 
    getCategory,
    updateMenuItemPrice,
    updateMenuItemActive,
    removeMenuItem,
    getStaffByUsername
};