const express = require('express')
const app = express()
const path = require('node:path');

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const {getMenuItems, getMenuItem, getCategories, addMenuItem, getCategory} = require('./db.js')


app.get('/api/health', (req, res) => {
    const uptime = Math.floor(process.uptime())
    const status  = {status: 'ok', uptimeSeconds: uptime}
    res.json(status)
})

app.post('/api/menu', (req, res) => {
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



app.get('/api/menu', (req, res) => {
    res.json(getMenuItems())
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

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
})