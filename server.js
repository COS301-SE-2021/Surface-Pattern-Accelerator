const express = require('express')
const  fs = require('fs')
const cors = require('cors');
const app = express()
app.use(cors());
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/collections', (req, res) => {

    console.log("get fired");

    fs.readdir('./testFolder', (err, files) => {
        collectionsSkeleton = '{"collectionNames": []}'; //create a "skeleton" JSON object into which all the other json object names will be placed in
        const obj = JSON.parse(collectionsSkeleton);
        files.forEach(file => {            
            
            obj["collectionNames"].push(file);
            
          console.log(file);
        });
        console.log(JSON.stringify(obj));
        res.json(obj); // already parsed
      });

    // fs.readFile('./db.json', (err, json) => {
    //     let obj = JSON.parse(json);
    //     res.json(obj);
    // });


});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})