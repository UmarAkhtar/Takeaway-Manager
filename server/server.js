const express = require('express')
const app = express()

const {getMenuItems, getMenuItem, getCategories} = require('./db.js')


app.get('/api/health', (req, res) => {
    const uptime = Math.floor(process.uptime())
    const status  = {status: 'ok', uptimeSeconds: uptime}
    res.json(status)
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

app.listen(3000, () => {
   console.log('the server is running')
})