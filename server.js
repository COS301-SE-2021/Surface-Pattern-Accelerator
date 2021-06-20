const express = require('express')
const readline = require('readline');
const {google} = require('googleapis');
const session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
const  fs = require('fs')
const cors = require('cors');
const { stringify } = require('querystring');
const { file } = require('googleapis/build/src/apis/file');
const app = express()
//app.use(cors());
const port = 3000

// read and write access to drive
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'; //this file is the users access token for when they gave acccess

let auth;
var globalCredentials;
loadCredentials();

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
  
  if(req.session.accessToken)
  {
    console.log("1 (return) Access token is set: " + req.session.accessToken);
  }
  else
  {
    console.log("(return) access token not set");
  }
    res.send('Hello World!')
})

app.get('/api/collections', (req, res) => {

    console.log("get fired");

    // fs.readdir('./testFolder', (err, files) => {
    //     collectionsSkeleton = '{"collectionNames": []}'; //create a "skeleton" JSON object into which all the other json object names will be placed in
    //     const obj = JSON.parse(collectionsSkeleton);
    //     files.forEach(file => {            
            
    //         obj["collectionNames"].push(file);
            
    //       console.log(file);
    //     });
    //     console.log(JSON.stringify(obj)); //log stringified obj for triublehsooting, yes I cant spell
    //     res.json(obj); // already parsed, send
    //   });
    collectionsSkeleton = '{"collectionNames": []}'; //create a "skeleton" JSON object into which all the other json object names will be placed in
    const obj = JSON.parse(collectionsSkeleton);
    const retOBJ = new Promise((success, failure) => {
      const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        q: "mimeType='application/json'",
        spaces: 'drive',
        pageSize: 20,
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          files.forEach(function(file)
          {
            //console.log('Found File: ', file.name, file.id);
            obj["collectionNames"].push(file.name);
          });
          console.log(obj);
          //res.end(obj);
          success(obj);
          
        } else {
          console.log('No files found.');
          failure(obj);
        }
      });
    }).then( data => {
      console.log(data);
      return data;
    })

    retOBJ.then(function(retValue){
      console.log(retValue);
      
      res.json(retValue);
    })
    
   

   

})

app.get('/api/newCollection/:tagId', function(req, res) {
    // let rawdata = fs.readFileSync('collectionTemplate.json');
    // console.log(JSON.parse(rawdata));

    // fs.copyFile('collectionTemplate.json', './testFolder/' + req.params.tagId + '.json', () =>
    // {
    //     console.log("file coppied");
    // });
    // listFiles(auth);
    const drive = google.drive({version: 'v3', auth});

    var fileMetadata = {
      'name': req.params.tagId+ '.json'
    };

    var media = {
      mimeType: 'application/json',
      body: fs.createReadStream('collectionTemplate.json')
    };

    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('File Id: ', file.id);
      }
    });
  
    res.status(220);

  });



  ////////////////////////////////////////////google stuff
  app.get('/api/googleLogin', function(req, res)
{
  fs.readFile('credentials.json', (err, content) => 
  {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    console.log("get url");

    const {client_secret, client_id, redirect_uris} = globalCredentials.installed; //'installed' name in  json file
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    
    res.json({ 'signInURL': authUrl}); //send JSON with sign in URL
  });

  //res.send("test");
});

app.post('/api/consumeAccessCode', (req, res) => { //read about express middlewares, like validatePayload
  
  code = req.body.accessCode;

  //authorize(JSON.parse(content), listFiles);
  const {client_secret, client_id, redirect_uris} = globalCredentials.installed; //'installed' name in  json file
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);

    stringToken = JSON.stringify(token);
    console.log(stringToken);
    req.session.oToken = stringToken; //save oAuthToken as stringToken in Session
    
    console.log("access token: " + token.access_token);
    oAuth2Client.setCredentials(token);

    //req.session.oAuth2Client = oAuth2Client;
    auth = oAuth2Client;

    req.session.save(); //use this if res.send is not used. Normally a session is saved on res.send
    res.status(200).send({
      Message: 'Access token is now set!'
    });
  });
});

function loadCredentials()
{
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    globalCredentials = JSON.parse(content);
  });
}



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

