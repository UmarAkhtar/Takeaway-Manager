const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(path.join(__dirname, '..', 'practice.db'));
db.exec('PRAGMA foreign_keys = ON');

function getMenuItems() {
    return db.prepare('SELECT * FROM menu_items WHERE active = 1').all();
}

function getMenuItem(id) {
    return db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
}

function getCategories() {
    return db.prepare('SELECT * FROM categories').all();
}


module.exports = {
    getMenuItems,
    getMenuItem,
    getCategories,
    db
};