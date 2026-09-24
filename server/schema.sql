CREATE TABLE categories (
id INTEGER PRIMARY KEY,
name TEXT NOT NULL) STRICT;

CREATE TABLE menu_items(
id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
price_pence INTEGER NOT NULL CHECK (price_pence >= 0),
category_id INTEGER NOT NULL REFERENCES categories(id),
active INTEGER NOT NULL DEFAULT 1) STRICT;

CREATE TABLE orders (
id INTEGER PRIMARY KEY,
status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready')),
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP) STRICT;

CREATE TABLE order_items(
id INTEGER PRIMARY KEY,
order_id INTEGER NOT NULL REFERENCES orders(id),
menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
name TEXT NOT NULL,
price_pence INTEGER NOT NULL CHECK (price_pence >= 0),
quantity INTEGER NOT NULL CHECK (quantity > 0)) STRICT;