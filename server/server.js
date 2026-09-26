const express = require('express')
const app = express()

const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('practice.db');


app.get('/api/health', (req, res) => {
    const uptime = Math.floor(process.uptime())
    const status  = {status: 'ok', uptimeSeconds: uptime}
    res.json(status)
})



app.get('/api/menu', (req, res) => {
    const rows = db.prepare('SELECT * FROM menu_items').all();
    res.json(rows)
})

app.get('/api/menu/:id', (req, res) => {
    const id = Number(req.params.id)
    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    if(!item){
        return res.status(404).json({error: 'Menu item does not exist'});
    }
    res.json(item)
})

app.listen(3000, () => {
   console.log('the server is running')
})