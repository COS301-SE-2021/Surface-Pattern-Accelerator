// Imports ///////////////////////////////////////////
import express from "express";
import session from "express-session"
import {google} from "googleapis";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";

import {GoogleApiFunctions} from './GoogleApiFunctions';
import {AuthClientObjectWrapper} from './AuthClientObjectWrapper'



// declare module 'express-session' { interface Session { authObj: OAuth2Client; } }



////////////////////////////////////////////////////

// Constants ////////////////////////////////////////
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
const port = 3000; // default port to listen
////////////////////////////////////////////////////


// global variables /////////////////////////////////
const authArr = new Array<AuthClientObjectWrapper>(100);

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
    // let sess = req.session;
    console.log("My session id is: " + req.session.id);

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


    const gAPI = new GoogleApiFunctions(req.session.id);
    gAPI.consumeAccessCode(req.body.accessCode, authArr).then(success => {
        console.log(success);
        res.status(200).send({
            Message: 'Access token is now set!'
        });
    })



});



app.get('/api/getCollections', (req, res) => {

    const gAPI = new GoogleApiFunctions(req.session.id);
    gAPI.getCollections(authArr)
        .then((retValue) =>{
        console.log(retValue);
        // console.log('Client id is: ' + auth._clientId);
        res.json(retValue);
    })
})

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.get('/api/getMotifs', (req, res) => {
    // generatePublicURL(req.session.id)
    //     .then(r => {
    //         console.log("getSVG fired");
    //     });
    const gAPI = new GoogleApiFunctions(req.session.id);
    gAPI.listMotifs(authArr).then(motifsJson => {
        console.log(motifsJson);
        gAPI.setPermissions(authArr, motifsJson);
    });
})

// async function generatePublicURL(sessID: string, fileID: string)
// {
//     try {
//         const gAPI = new GoogleApiFunctions(sessID);
//         const tempAccT = gAPI.retrieveAccessCredentials(authArr);
//         const auth = tempAccT.auth;
//
//         const drive = google.drive({version: 'v3', auth});
//         await drive.permissions.create({
//             fileId: fileID,
//             requestBody: {
//                 role: 'reader',
//                 type: 'anyone'
//             }
//         })
//
//         const result = await drive.files.get({
//             fileId: fileID,
//             fields: 'webContentLink'
//         });
//         console.log(result.data);
//         return result.data;
//     }
//     catch (error){
//         console.log(error.message)
//     }
//
// }



// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );