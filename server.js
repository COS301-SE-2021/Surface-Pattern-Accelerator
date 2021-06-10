const express = require('express')
const  fs = require('fs')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/items', (req, res) => {

    fs.readFile('./db.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    });

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})