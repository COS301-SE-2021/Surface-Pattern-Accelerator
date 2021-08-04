// Imports ///////////////////////////////////////////
import express from "express";
import session from "express-session"
import {google} from "googleapis";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";

import {GoogleApiFunctions} from './GoogleApiFunctions';

const gAPI = new GoogleApiFunctions();
gAPI.printSomething();

// declare module 'express-session' { interface Session { authObj: OAuth2Client; } }



////////////////////////////////////////////////////

// Constants ////////////////////////////////////////
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
const port = 3000; // default port to listen
////////////////////////////////////////////////////

// classes //////////////////////////////////////////

class AuthClientObjectWrapper {
    auth: OAuth2Client;
    sessionID: string;

    constructor(authCred: OAuth2Client, sessID: string) {
        this.auth = authCred;
        this.sessionID = sessID;

    }

}

///////////////////////////////////////////////////

// global variables /////////////////////////////////
// let auth: OAuth2Client;

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

// functions ///////////////////////////////////
function storeAccessCredentials(tempAccessCredentials: AuthClientObjectWrapper)
{
    console.log("Store ID is: " + tempAccessCredentials.sessionID);
    for(const accCred of authArr)
    {
        if (accCred !== undefined)
        {
            if (accCred.sessionID === tempAccessCredentials.sessionID)
            {
                console.log("Access Credentials already stored");
                return;
            }
        }
    }

    for(let i = 0; i < authArr.length; i++)
    {
        if (authArr[i] === undefined)
        {
            authArr[i] = tempAccessCredentials;
            console.log("Access Credentials stored successfully");
            return;
        }
    }
    // if the code gets here the array is full.
    // prune every now and then
}

function retrieveAccessCredentials(sessID: string)
{

    console.log("fetch ID is: " + sessID);
    for(const accCred of authArr)
    {
        if (accCred !== undefined)
        {
            if (accCred.sessionID === sessID)
            {
                console.log("Credentials returned successfully");
                return accCred;
            }
        }
    }
    console.log("Credentials unsuccessfully fetched");
    // if the code gets here then the access credentials is not in the array
}


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

    const code = req.body.accessCode;
    console.log("My session id is: " + req.session.id);

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

        // auth = oAuth2Client;
        storeAccessCredentials(new AuthClientObjectWrapper(oAuth2Client, req.session.id)); // Stores access credentials in array

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
        const tempAccT = retrieveAccessCredentials(req.session.id);
        const auth = tempAccT.auth;

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
        // console.log('Client id is: ' + auth._clientId);
        res.json(retValue);
    })
})



// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.get('/api/getSVG', (req, res) => {
    // generatePublicURL(req.session.id)
    //     .then(r => {
    //         console.log("getSVG fired");
    //     });
    listFiles(req.session.id);
})

async function generatePublicURL(sessID: string, fileID: string)
{
    try {
        const tempAccT = retrieveAccessCredentials(sessID);
        const auth = tempAccT.auth;

        const drive = google.drive({version: 'v3', auth});
        // const fileID = '1a-pgwbymErfJ89M4EkCVX5xI0Nx6Wm_l';
        await drive.permissions.create({
            fileId: fileID,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        const result = await drive.files.get({
            fileId: fileID,
            fields: 'webContentLink'
            // fields: 'webViewLink, webContentLink'
            // alt: 'media'
            // fields: 'webViewLink, webContentLink'
        });
        console.log(result.data);
        return result.data;
    }
    catch (error){
        console.log(error.message)
    }

}

function listFiles(sessID: string) {
    const tempAccT = retrieveAccessCredentials(sessID);
    const auth = tempAccT.auth;

    const motifSkeleton = '{"motifNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
    const obj = JSON.parse(motifSkeleton);

    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        q: "mimeType='image/svg+xml'",
        spaces: 'drive',
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
                const motifLink = generatePublicURL(sessID, file.id)
                    .then(r => {
                        console.log("getSVG fired");
                    })
                console.log("Link is: " + motifLink);
                obj.motifNames.push(motifLink)
            });
            console.log(obj);
        } else {
            console.log('No files found.');
        }
    });
}

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );