const express = require('express')
const app = express()

const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('practice.db');


app.get('/api/health', (req, res) => {
    const uptime = Math.floor(process.uptime())
    const status  = {status: 'ok', uptimeSeconds: uptime}
    res.json(status)
})



app.get('/menu', (req, res) => {
    const rows = db.prepare('SELECT * FROM menu_items').all();
    res.json(rows)
})

app.get('/menu/:id', (req, res) => {
    const id = Number(req.params.id)
    const rows = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    res.json(rows)
})

app.listen(3000, () => {
   console.log('the server is running')
})