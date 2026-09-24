const express = require('express')
const app = express()

app.get('/api/health', (req, res) => {
    const uptime = Math.floor(process.uptime())
    const status  = {status: 'ok', uptimeSeconds: uptime}
    res.json(status)
})

app.listen(3000, () => {
   console.log('the server is running')
})