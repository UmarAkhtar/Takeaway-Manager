const express = require('express')
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcryptjs');
const app = express()
const path = require('node:path');
const { pool } = require('./db.js');

// Render sits in front of the app, so trust it to say the visit was over https
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.json());

app.use(session({
    store: new PgSession({ pool, tableName: 'session' }),
    secret: process.env.SESSION_SECRET || 'dev-only-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 8,
    },
}));

function requireStaff(req, res, next) {
    if (!req.session.staffId) {
        return res.status(401).json({ error: 'Please log in' });
    }
    next();
}

const PORT = process.env.PORT || 3000;

const {getMenuItems, getMenuItem, getCategories, addMenuItem, getCategory, updateMenuItemPrice, updateMenuItemActive, removeMenuItem, getStaffByUsername, createOrder, getPendingOrders, markOrderReady} = require('./db.js')
const { checkOrderItems } = require('./orders.js');


app.get('/api/health', (req, res) => {
    const uptime = Math.floor(process.uptime())
    const status  = {status: 'ok', uptimeSeconds: uptime}
    res.json(status)
})

app.post('/api/menu', requireStaff, async (req, res) => {
    const {name, pricePence, categoryId} = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
}

if (!Number.isInteger(pricePence) || pricePence <= 0) {
    return res.status(400).json({ error: 'Price is required and must be an integer and positive' });
}

if (!Number.isInteger(categoryId) || !(await getCategory(categoryId))) {
    return res.status(400).json({ error: 'Category ID is required and must be a valid category ID' });
}

    const newItem = await addMenuItem(name.trim(), pricePence, categoryId);
    res.status(201).json(newItem);
})

app.patch('/api/menu/:id', requireStaff, async (req, res) => {
const id = Number(req.params.id);
const { pricePence, active } = req.body;

if (!(await getMenuItem(id))) {
    return res.status(404).json({ error: 'Menu item does not exist' });
}

if (pricePence === undefined && active === undefined) {
    return res.status(400).json({ error: 'Send a price or an active setting to change' });
}

if (pricePence !== undefined && (!Number.isInteger(pricePence) || pricePence <= 0)) {
    return res.status(400).json({ error: 'Price is required and must be an integer and positive' });
}

if (active !== undefined && typeof active !== 'boolean') {
    return res.status(400).json({ error: 'Active must be true or false' });
}

let updatedItem;
if (pricePence !== undefined) {
    updatedItem = await updateMenuItemPrice(id, pricePence);
}
if (active !== undefined) {
    updatedItem = await updateMenuItemActive(id, active);
}
res.json(updatedItem);
})

app.delete('/api/menu/:id', requireStaff, async (req, res) => {
    const id = Number(req.params.id);

    if (!(await getMenuItem(id))) {
        return res.status(404).json({ error: 'Menu item does not exist' });
    }

    await removeMenuItem(id);
    res.status(204).end();
});




app.get('/api/menu', async (req, res) => {
    const includeInactive = req.query.includeInactive === 'true'
    if (includeInactive && !req.session.staffId) {
        return res.status(401).json({ error: 'Please log in' });
    }
    res.json(await getMenuItems(includeInactive))
})

app.get('/api/menu/:id', async (req, res) => {
    const id = Number(req.params.id)
    const item = await getMenuItem(id);
    if(!item){
        return res.status(404).json({error: 'Menu item does not exist'});
    }
    res.json(item)
})

app.get('/api/categories', async (req, res) => {
    res.json(await getCategories())
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(401).json({ error: 'Wrong username or password' });
    }

    const staff = await getStaffByUsername(username);
    if (!staff || !(await bcrypt.compare(password, staff.password_hash))) {
        return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.regenerate((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log in' });
        }
        req.session.staffId = staff.id;
        req.session.username = staff.username;
        res.json({ username: staff.username });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ loggedOut: true });
    });
});

app.get('/api/me', (req, res) => {
    if (!req.session.staffId) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    res.json({ username: req.session.username });
});

app.post('/api/orders', async (req, res) => {
    const checked = checkOrderItems(req.body?.items);
    if (checked.error) {
        return res.status(400).json({ error: checked.error });
    }

    // Look up each price ourselves, so the browser can never set what it pays
    const lines = [];
    for (const { menuItemId, quantity } of checked.items) {
        const menuItem = await getMenuItem(menuItemId);
        if (!menuItem || !menuItem.active) {
            return res.status(400).json({ error: 'One of the items is no longer available' });
        }
        lines.push({ menuItemId, quantity, name: menuItem.name, pricePence: menuItem.price_pence });
    }

    const order = await createOrder(lines);
    const totalPence = lines.reduce((sum, line) => sum + line.pricePence * line.quantity, 0);
    res.status(201).json({ id: order.id, totalPence, items: lines });
});

app.get('/api/orders', requireStaff, async (req, res) => {
    res.json(await getPendingOrders());
});

app.patch('/api/orders/:id', requireStaff, async (req, res) => {
    if (req.body?.status !== 'ready') {
        return res.status(400).json({ error: 'Orders can only be marked ready' });
    }

    const order = await markOrderReady(Number(req.params.id));
    if (!order) {
        return res.status(404).json({ error: 'No waiting order with that number' });
    }
    res.json(order);
});

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
})