// Imports ///////////////////////////////////////////
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import {google} from "googleapis";
import {ITokenInterface} from "./token.interface";

import {AuthClientObjectWrapper} from "./AuthClientObjectWrapper";
import {GoogleApiFunctions} from "./GoogleApiFunctions";

// tslint:disable-next-line:interface-name
declare module "express-session" { interface Session { accessToken: ITokenInterface; } }

////////////////////////////////////////////////////

// Constants ////////////////////////////////////////
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const TOKEN_PATH = "token.json";
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

function loadCredentials() {
    fs.readFile("credentials.json", (err, content) => {
        if (err) { return console.log("Error loading client secret file:", err); }
        // Authorize a client with credentials, then call the Google Drive API.
        globalCredentials = JSON.parse(content.toString());
        // console.log(globalCredentials);
    });
}

/////////////////////////////////////////////////

// Endpoints /////////////////////////////////////
app.get("/api/googleLogin", (req, res) => {
    // let sess = req.session;
    console.log("My session id is: " + req.session.id);

    // Authorize a client with credentials, then call the Google Drive API.
    console.log("get url");

    const {client_secret, client_id, redirect_uris} = globalCredentials.installed; // 'installed' name in  json file
    // @ts-ignore
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("sign in URL: " + authUrl);
    res.json({ signInURL: authUrl}); // send JSON with sign in URL

});

app.post("/api/consumeAccessCode", (req, res) => { // read about express middlewares, like validatePayload

    const gAPI = new GoogleApiFunctions();
    gAPI.consumeAccessCode(req.body.accessCode, authArr).then((success) => {
        console.log(success);

        req.session.accessToken = success as ITokenInterface; // make success an ITokenInterface and store it in the users session for later oAuthObject creation

        res.status(200).send({ // 200 - OK
            Message: "Access token is now set!"
        });

    }).catch((failure) => {
        res.status(503).send({ // 503 - Service unavailable
            Message: failure
        });
    });

});

app.get("/api/getCollections", (req, res) => {

    console.log(req.session.accessToken);
    const gAPI = new GoogleApiFunctions();
    gAPI.getCollections(req.session.accessToken)
        .then((retValue) => {
        console.log(retValue);
        // console.log('Client id is: ' + auth._clientId);
        res.json(retValue);
    });
});

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.get("/api/getMotifs", (req, res) => {
    // generatePublicURL(req.session.id)
    //     .then(r => {
    //         console.log("getSVG fired");
    //     });
    const gAPI = new GoogleApiFunctions();
    gAPI.listMotifs(req.session.accessToken)
        .then((motifsJson) => {
            console.log(motifsJson);
            gAPI.getPublicMotifsInfo(req.session.accessToken, motifsJson)
                .then((permissionsRes) => {
                    gAPI.generatePublicLinksJSON(req.session.accessToken, permissionsRes)
                        .then((motifsJSON) => {
                            console.log(motifsJSON);
                            res.json(motifsJSON);
                        });
                    // console.log(permissionsRes);
                });

        });
});

// start the Express server
app.listen(port, () => {
        // tslint:disable-next-line:no-console
        console.log(`server started at http://localhost:${port}`);
    });
