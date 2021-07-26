// Imports ///////////////////////////////////////////
import express from "express";
import session from "express-session"
import {google} from "googleapis";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";


////////////////////////////////////////////////////

// Constants ////////////////////////////////////////
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
const port = 3000; // default port to listen
////////////////////////////////////////////////////

//classes //////////////////////////////////////////

class authClientObjectWrapper {
    auth: OAuth2Client;
    userID: string;

    constructor(auth: OAuth2Client) {
        this.auth = auth;
        this.userID = auth._clientId;

    }

}

///////////////////////////////////////////////////

// global variables /////////////////////////////////
let auth: OAuth2Client;

let authArr = new Array<authClientObjectWrapper>(100);

let globalCredentials: { installed: { client_secret: any; client_id: any; redirect_uris: any; }; };
////////////////////////////////////////////////////

// on startup function calls/////////////////////////
loadCredentials();
////////////////////////////////////////////////////

// Express setup /////////////////////////////////////////////////////////
const app = express();

app.use(cors({origin: // cors so it can work with application on another domain
        ["http://localhost:8100"],
    credentials: true}));

app.use(session({
    secret: "super secret secret",
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json()); // parse request body for when its a JSON file

////////////////////////////////////////////////////////////////////////

// functions ///////////////////////////////////
function loadCredentials()
{
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        globalCredentials = JSON.parse(content.toString());
        // console.log(globalCredentials);
    });
}

/////////////////////////////////////////////////

// Endpoints /////////////////////////////////////
app.get('/api/googleLogin', (req, res) =>
{


    // Authorize a client with credentials, then call the Google Drive API.
    console.log("get url");

    const {client_secret, client_id, redirect_uris} = globalCredentials.installed; // 'installed' name in  json file
    // @ts-ignore
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log("sign in URL: " + authUrl);
    res.json({ 'signInURL': authUrl}); // send JSON with sign in URL

});

app.post('/api/consumeAccessCode', (req, res) => { // read about express middlewares, like validatePayload

    const code = req.body.accessCode;

    const {client_secret, client_id, redirect_uris} = globalCredentials.installed; // 'installed' name in  json file

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);


    oAuth2Client.getToken(code, (err: any, token: { access_token: string; }) => {
        if (err) return console.error('Error retrieving access token', err);

        console.log("access token: " + token.access_token);
        oAuth2Client.setCredentials(token);

        // Store the token to disk to see its content for debugging purposes
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (writeError) => {
            if (writeError) return console.error(writeError);
            console.log('Token stored to', TOKEN_PATH);
        });

        auth = oAuth2Client;

        req.session.save(); // use this if res.send is not used. Normally a session is saved on res.send
        res.status(200).send({
            Message: 'Access token is now set!'
        });
    });
});

app.get('/api/getCollections', (req, res) => {

    const collectionsSkeleton = '{"collectionNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
    const obj = JSON.parse(collectionsSkeleton);
    const retOBJ = new Promise((success, failure) => {
        const drive = google.drive({version: 'v3', auth});
        drive.files.list({
            q: "mimeType='application/json'",
            spaces: 'drive',
            pageSize: 20,
            fields: 'nextPageToken, files(id, name)',
        }, (err, driveRes) => {
            if (err) return console.log('The API returned an error: ' + err);
            const files = driveRes.data.files;
            if (files.length) {
                files.forEach((file) =>
                {
                    // console.log('Found File: ', file.name, file.id);
                    obj.collectionNames.push(file.name);
                });
                console.log(obj);
                // res.end(obj);
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

    retOBJ.then((retValue) =>{
        console.log(retValue);
        console.log('Client id is: ' + auth._clientId);
        res.json(retValue);
    })
})



// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );