const fs = require('node:fs');
const path = require('node:path');
const { db } = require('./db');

db.exec('DROP TABLE IF EXISTS order_items');
db.exec('DROP TABLE IF EXISTS orders');
db.exec('DROP TABLE IF EXISTS menu_items');
db.exec('DROP TABLE IF EXISTS categories');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

const categories = ['Curries', 'Sundries', 'Burgers', 'Drinks'];
const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');

for (const name of categories) {
  insertCategory.run(name);
}

const menuItems = [
  { name: 'Chicken Tikka Masala', price_pence: 895, category_id: 1 },
  { name: 'Chicken Korma', price_pence: 695, category_id: 1 },
  { name: 'Chicken Bhoona', price_pence: 695, category_id: 1 },
  { name: 'South Indian Garlic Chilli Chicken', price_pence: 895, category_id: 1 },
  { name: 'Chicken Dopiaza', price_pence: 695, category_id: 1 },

  { name: 'Chips', price_pence: 240, category_id: 2 },
  { name: 'Chips & Cheese', price_pence: 380, category_id: 2 },
  { name: 'Chicken Pakora', price_pence: 690, category_id: 2 },
  { name: 'Veg Pakora', price_pence: 380, category_id: 2 },
  { name: 'Mushroom Pakora', price_pence: 480, category_id: 2 },

  { name: 'Ham Burger', price_pence: 380, category_id: 3 },
  { name: 'Cheese Burger', price_pence: 450, category_id: 3 },
  { name: 'Chicken Burger', price_pence: 450, category_id: 3 },
  { name: 'Peri Peri Burger', price_pence: 450, category_id: 3 },
  { name: 'Donner Burger', price_pence: 350, category_id: 3 },

  { name: 'Fanta', price_pence: 80, category_id: 4 },
  { name: 'Irn-Bru', price_pence: 80, category_id: 4 },
  { name: 'Coke', price_pence: 80, category_id: 4 },
  { name: 'Water', price_pence: 80, category_id: 4 },
  { name: 'Sprite', price_pence: 80, category_id: 4 }
];

for(const item of menuItems) {
    db.prepare('INSERT INTO menu_items (name, price_pence, category_id) VALUES (?, ?, ?)').run(item.name, item.price_pence, item.category_id);
}

console.log('Database seeded');