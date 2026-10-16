const { pool } = require('./db');

const categories = ['Curries', 'Sundries', 'Burgers', 'Drinks'];

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

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed: this would wipe the live menu');
  }

  await pool.query('TRUNCATE order_items, orders, menu_items, categories RESTART IDENTITY CASCADE');

  for (const name of categories) {
    await pool.query('INSERT INTO categories (name) VALUES ($1)', [name]);
  }

  for (const item of menuItems) {
    await pool.query(
      'INSERT INTO menu_items (name, price_pence, category_id) VALUES ($1, $2, $3)',
      [item.name, item.price_pence, item.category_id]
    );
  }

  console.log('Database seeded');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
