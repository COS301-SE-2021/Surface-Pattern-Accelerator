"use strict";
exports.__esModule = true;
// Imports ///////////////////////////////////////////
var express_1 = require("express");
var express_session_1 = require("express-session");
var googleapis_1 = require("googleapis");
var body_parser_1 = require("body-parser");
var fs_1 = require("fs");
var cors_1 = require("cors");
////////////////////////////////////////////////////
// Constants ////////////////////////////////////////
var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN_PATH = 'token.json';
var port = 3000; // default port to listen
////////////////////////////////////////////////////
// global variables /////////////////////////////////
var auth;
var globalCredentials;
////////////////////////////////////////////////////
// on startup function calls/////////////////////////
loadCredentials();
////////////////////////////////////////////////////
// Express setup /////////////////////////////////////////////////////////
var app = express_1["default"]();
app.use(cors_1["default"]({ origin: // cors so it can work with application on another domain
    ["http://localhost:8100"],
    credentials: true }));
app.use(express_session_1["default"]({
    secret: "super secret secret",
    resave: false,
    saveUninitialized: true
}));
app.use(body_parser_1["default"].json()); // parse request body for when its a JSON file
////////////////////////////////////////////////////////////////////////
// functions ///////////////////////////////////
function loadCredentials() {
    fs_1["default"].readFile('credentials.json', function (err, content) {
        if (err)
            return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        globalCredentials = JSON.parse(content.toString());
        // console.log(globalCredentials);
    });
}
/////////////////////////////////////////////////
// Endpoints /////////////////////////////////////
app.get('/api/googleLogin', function (req, res) {
    // Authorize a client with credentials, then call the Google Drive API.
    console.log("get url");
    var _a = globalCredentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris; // 'installed' name in  json file
    // @ts-ignore
    var oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    var authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log("sign in URL: " + authUrl);
    res.json({ 'signInURL': authUrl }); // send JSON with sign in URL
});
app.post('/api/consumeAccessCode', function (req, res) {
    var code = req.body.accessCode;
    var _a = globalCredentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris; // 'installed' name in  json file
    var oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.getToken(code, function (err, token) {
        if (err)
            return console.error('Error retrieving access token', err);
        console.log("access token: " + token.access_token);
        oAuth2Client.setCredentials(token);
        // Store the token to disk to see its content for debugging purposes
        fs_1["default"].writeFile(TOKEN_PATH, JSON.stringify(token), function (writeError) {
            if (writeError)
                return console.error(writeError);
            console.log('Token stored to', TOKEN_PATH);
        });
        auth = oAuth2Client;
        req.session.save(); // use this if res.send is not used. Normally a session is saved on res.send
        res.status(200).send({
            Message: 'Access token is now set!'
        });
    });
});
app.get('/api/getCollections', function (req, res) {
    var collectionsSkeleton = '{"collectionNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
    var obj = JSON.parse(collectionsSkeleton);
    var retOBJ = new Promise(function (success, failure) {
        var drive = googleapis_1.google.drive({ version: 'v3', auth: auth });
        drive.files.list({
            q: "mimeType='application/json'",
            spaces: 'drive',
            pageSize: 20,
            fields: 'nextPageToken, files(id, name)'
        }, function (err, driveRes) {
            if (err)
                return console.log('The API returned an error: ' + err);
            var files = driveRes.data.files;
            if (files.length) {
                files.forEach(function (file) {
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
    }).then(function (data) {
        console.log(data);
        return data;
    });
    retOBJ.then(function (retValue) {
        console.log(retValue);
        res.json(retValue);
    });
});
// define a route handler for the default home page
app.get("/", function (req, res) {
    res.send("Hello world!");
});
// start the Express server
app.listen(port, function () {
    // tslint:disable-next-line:no-console
    console.log("server started at http://localhost:" + port);
});
