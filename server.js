const express = require('express')
const readline = require('readline');
const {google} = require('googleapis');
const session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
const  fs = require('fs')
const cors = require('cors');
const { stringify } = require('querystring');
const app = express()
//app.use(cors());
const port = 3000

// read and write access to drive
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'; //this file is the users access token for when they gave acccess


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
  
  // if(req.session.accessToken)
  // {
  //   console.log("1 (return) Access token is set: " + req.session.accessToken);
  // }
  // else
  // {
  //   console.log("(return) access token not set");
  // }

  // console.log(req.url);
  // console.log(req.query.code);
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



  ////////////////////////////////////////////google stuff
  app.get('/api/googleLogin', function(req, res)
{
  // if(req.session.accessToken)
  // {
  //   console.log("1 Access token is set: " + req.session.accessToken);
  // }
  // else
  // {
  //   req.session.accessToken = "some access token here";
  //   console.log("2 Access token is set as: " + req.session.accessToken);
  // }

  //const strWindowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
  //window.open(authorize(JSON.parse(content)), 'sign in', strWindowFeatures);
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    console.log("get url");
    res.json({ 'signInURL': authorize(JSON.parse(content))}); //send JSON with sign in URL
  });

  //res.send("test");
});



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
//authorize generates a URL used to get access to a users Drive
function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed; //'installed' name in  json file
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    return  authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

  // Check if we have previously stored a token.
  // fs.readFile(TOKEN_PATH, (err, token) => {
  //   // if (err) return getAccessToken(oAuth2Client, callback);
  //   // oAuth2Client.setCredentials(JSON.parse(token));
  //   // callback(oAuth2Client);
  //   const authUrl = oAuth2Client.generateAuthUrl({
  //     access_type: 'offline',
  //     scope: SCOPES,
  //   });
  //   //console.log(authUrl);
  //   //return authUrl;
  // });
  
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  
  // console.log('Authorize this app by visiting this url:', authUrl);
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  // rl.question('Enter the code from that page here: ', (code) => {
  //   rl.close();
  //   oAuth2Client.getToken(code, (err, token) => {
  //     if (err) return console.error('Error retrieving access token', err);
  //     oAuth2Client.setCredentials(token);
  //     // Store the token to disk for later program executions
  //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
  //       if (err) return console.error(err);
  //       console.log('Token stored to', TOKEN_PATH);
  //     });
  //     callback(oAuth2Client);
  //   });
  // });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 20,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}



app.post('/api/setAccessToken', (req, res) => { //read about express middlewares, like validatePayload
  
  if(req.session.accessToken)
  {
    req.session.accessToken = req.body.accessToken; //reset access token for now while in development
    console.log("access token is already set " + req.session.accessToken);
    res.status(200).send({
      Message: 'Access token is already set!'
    });

  }
  else
  {
    req.session.accessToken = req.body.accessToken;
    console.log("Access token is now set: " + req.body.accessToken);
    res.status(200).send({
      Message: 'Access token is now set!'
  });

  }

  // res.status(403).send({
  //     errorMessage: 'Permission denied!'
  // });
  
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})