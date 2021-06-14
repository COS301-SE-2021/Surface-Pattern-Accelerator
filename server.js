const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const  fs = require('fs')
const cors = require('cors');
const app = express()
//app.use(cors());
const port = 3000

app.use(cors({origin: //cors so it can work with application on another domain
  ["http://localhost:8100"],
  credentials: true}));

app.use(session({
  secret: "super secret secret",
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json()); //parse request body for when its a JSON file
/////////////////////////////////////////////////////////////////////////////////
//mock DB

const appUsers = {
  'max@gmail.com': {
      email: 'max@gmail.com',
      name: 'Max Miller',
      pw: '1234'
  },
  'lilly@gmail.com': {
      email: 'lilly@gmail.com',
      name: 'Lilly Walter',
      pw: '1234'
  }
}

/////////////////////////////////////////////////////////////////////////////////
//middleware to check if payload is present

const validatePayload = (req, res, next) => {
  if( req.body )
  {
      next();
  }
  else
  {
      res.status(403).send({
          errorMessage: 'You must be signed in'
      });
  }
}
//////////////////////////////////////////////////////////////////////////////////

app.post('/api/login', validatePayload, (req, res) => { //read about express middlewares, like validatePayload
  const user = appUsers[req.body.email]; //access DB like an array
  console.log("login called");
  if(user && user.pw === req.body.password)
  {
      const userWithoutPassword = {...user}; //spread operator
      delete userWithoutPassword.pw;
      req.session.user = userWithoutPassword;
      res.status(200).send({
          user: userWithoutPassword
      });
  }
  else
  {
      res.status(403).send({
          errorMessage: 'Permission denied!'
      });
  }
});

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
        console.log(JSON.stringify(obj)); //log stringified obj for triublehsooting, yes I cant spell
        res.json(obj); // already parsed, send
      });
});

app.get('/api/newCollection/:tagId', function(req, res) {
    let rawdata = fs.readFileSync('collectionTemplate.json');
    console.log(JSON.parse(rawdata));

    fs.copyFile('collectionTemplate.json', './testFolder/' + req.params.tagId + '.json', () =>
    {
        console.log("file coppied");
    });

    //res.sendStatus(200);
    res.status(220);

  });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})