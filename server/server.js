const express = require('express')
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express()
const path = require('node:path');

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 },
}));

function requireStaff(req, res, next) {
    if (!req.session.staffId) {
        return res.status(401).json({ error: 'Please log in' });
    }
    next();
}

const PORT = process.env.PORT || 3000;

const {getMenuItems, getMenuItem, getCategories, addMenuItem, getCategory, updateMenuItemPrice, updateMenuItemActive, getStaffByUsername} = require('./db.js')


app.get('/api/health', (req, res) => {
    const uptime = Math.floor(process.uptime())
    const status  = {status: 'ok', uptimeSeconds: uptime}
    res.json(status)
})

app.post('/api/menu', requireStaff, (req, res) => {
    const {name, pricePence, categoryId} = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
}

if (!Number.isInteger(pricePence) || pricePence <= 0) {
    return res.status(400).json({ error: 'Price is required and must be an integer and positive' });
}

if (!Number.isInteger(categoryId) || !getCategory(categoryId)) {
    return res.status(400).json({ error: 'Category ID is required and must be a valid category ID' });
}

    const newItem = addMenuItem(name.trim(), pricePence, categoryId);
    res.status(201).json(newItem);
})

app.patch('/api/menu/:id', requireStaff, (req, res) => {
const id = Number(req.params.id);
const { pricePence, active } = req.body;

if (!getMenuItem(id)) {
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
    updatedItem = updateMenuItemPrice(id, pricePence);
}
if (active !== undefined) {
    updatedItem = updateMenuItemActive(id, active);
}
res.json(updatedItem);
})




app.get('/api/menu', (req, res) => {
    const includeInactive = req.query.includeInactive === 'true'
    if (includeInactive && !req.session.staffId) {
        return res.status(401).json({ error: 'Please log in' });
    }
    res.json(getMenuItems(includeInactive))
})

app.get('/api/menu/:id', (req, res) => {
    const id = Number(req.params.id)
    const item = getMenuItem(id);
    if(!item){
        return res.status(404).json({error: 'Menu item does not exist'});
    }
    res.json(item)
})

app.get('/api/categories', (req, res) => {
    res.json(getCategories())
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(401).json({ error: 'Wrong username or password' });
    }

    const staff = getStaffByUsername(username);
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

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
})