"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports ///////////////////////////////////////////
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const googleapis_1 = require("googleapis");
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
// declare module 'express-session' { interface Session { authObj: OAuth2Client; } }
////////////////////////////////////////////////////
// Constants ////////////////////////////////////////
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
const port = 3000; // default port to listen
////////////////////////////////////////////////////
// classes //////////////////////////////////////////
class AuthClientObjectWrapper {
    constructor(authCred, sessID) {
        this.auth = authCred;
        this.sessionID = sessID;
    }
}
///////////////////////////////////////////////////
// global variables /////////////////////////////////
// let auth: OAuth2Client;
const authArr = new Array(100);
let globalCredentials;
////////////////////////////////////////////////////
// on startup function calls/////////////////////////
loadCredentials();
////////////////////////////////////////////////////
// Express setup /////////////////////////////////////////////////////////
const app = express_1.default();
app.use(cors_1.default({ origin: // cors so it can work with application on another domain
    ["http://localhost:8100"],
    credentials: true }));
app.use(express_session_1.default({
    secret: "super secret secret",
    resave: false,
    saveUninitialized: true
}));
app.use(body_parser_1.default.json()); // parse request body for when its a JSON file
////////////////////////////////////////////////////////////////////////
// functions ///////////////////////////////////
function storeAccessCredentials(tempAccessCredentials) {
    console.log("Store ID is: " + tempAccessCredentials.sessionID);
    for (const accCred of authArr) {
        if (accCred !== undefined) {
            if (accCred.sessionID === tempAccessCredentials.sessionID) {
                console.log("Access Credentials already stored");
                return;
            }
        }
    }
    for (let i = 0; i < authArr.length; i++) {
        if (authArr[i] === undefined) {
            authArr[i] = tempAccessCredentials;
            console.log("Access Credentials stored successfully");
            return;
        }
    }
    // if the code gets here the array is full.
    // prune every now and then
}
function retrieveAccessCredentials(sessID) {
    console.log("fetch ID is: " + sessID);
    for (const accCred of authArr) {
        if (accCred !== undefined) {
            if (accCred.sessionID === sessID) {
                console.log("Credentials returned successfully");
                return accCred;
            }
        }
    }
    console.log("Credentials unsuccessfully fetched");
    // if the code gets here then the access credentials is not in the array
}
function loadCredentials() {
    fs_1.default.readFile('credentials.json', (err, content) => {
        if (err)
            return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        globalCredentials = JSON.parse(content.toString());
        // console.log(globalCredentials);
    });
}
/////////////////////////////////////////////////
// Endpoints /////////////////////////////////////
app.get('/api/googleLogin', (req, res) => {
    // let sess = req.session;
    console.log("My session id is: " + req.session.id);
    // Authorize a client with credentials, then call the Google Drive API.
    console.log("get url");
    const { client_secret, client_id, redirect_uris } = globalCredentials.installed; // 'installed' name in  json file
    // @ts-ignore
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log("sign in URL: " + authUrl);
    res.json({ 'signInURL': authUrl }); // send JSON with sign in URL
});
app.post('/api/consumeAccessCode', (req, res) => {
    const code = req.body.accessCode;
    console.log("My session id is: " + req.session.id);
    const { client_secret, client_id, redirect_uris } = globalCredentials.installed; // 'installed' name in  json file
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.getToken(code, (err, token) => {
        if (err)
            return console.error('Error retrieving access token', err);
        console.log("access token: " + token.access_token);
        oAuth2Client.setCredentials(token);
        // Store the token to disk to see its content for debugging purposes
        fs_1.default.writeFile(TOKEN_PATH, JSON.stringify(token), (writeError) => {
            if (writeError)
                return console.error(writeError);
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
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        drive.files.list({
            q: "mimeType='application/json'",
            spaces: 'drive',
            pageSize: 20,
            fields: 'nextPageToken, files(id, name)',
        }, (err, driveRes) => {
            if (err)
                return console.log('The API returned an error: ' + err);
            const files = driveRes.data.files;
            if (files.length) {
                files.forEach((file) => {
                    // console.log('Found File: ', file.name, file.id);
                    obj.collectionNames.push(file.name);
                });
                console.log(obj);
                // res.end(obj);
                success(obj);
            }
            else {
                console.log('No files found.');
                failure(obj);
            }
        });
    }).then(data => {
        console.log(data);
        return data;
    });
    retOBJ.then((retValue) => {
        console.log(retValue);
        // console.log('Client id is: ' + auth._clientId);
        res.json(retValue);
    });
});
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.get('/api/getSVG', (req, res) => {
    generatePublicURL(req.session.id)
        .then(r => {
        console.log("getSVG fired");
    });
    listFiles(req.session.id);
});
function generatePublicURL(sessID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tempAccT = retrieveAccessCredentials(sessID);
            const auth = tempAccT.auth;
            const drive = googleapis_1.google.drive({ version: 'v3', auth });
            const fileID = '1a-pgwbymErfJ89M4EkCVX5xI0Nx6Wm_l';
            yield drive.permissions.create({
                fileId: fileID,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
            const result = yield drive.files.get({
                fileId: '1a-pgwbymErfJ89M4EkCVX5xI0Nx6Wm_l',
                fields: 'webViewLink, webContentLink'
                // alt: 'media'
                // fields: 'webViewLink, webContentLink'
            });
            console.log(result.data);
        }
        catch (error) {
            console.log(error.message);
        }
    });
}
function listFiles(sessID) {
    const tempAccT = retrieveAccessCredentials(sessID);
    const auth = tempAccT.auth;
    const drive = googleapis_1.google.drive({ version: 'v3', auth });
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err)
            return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        }
        else {
            console.log('No files found.');
        }
    });
}
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=test.js.map