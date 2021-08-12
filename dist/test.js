"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports ///////////////////////////////////////////
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const GoogleApiFunctions_1 = require("./GoogleApiFunctions");
////////////////////////////////////////////////////
// Constants ////////////////////////////////////////
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const TOKEN_PATH = "token.json";
const port = 3000; // default port to listen
////////////////////////////////////////////////////
// global variables /////////////////////////////////
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
function loadCredentials() {
    fs_1.default.readFile("credentials.json", (err, content) => {
        if (err) {
            return console.log("Error loading client secret file:", err);
        }
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
    const { client_secret, client_id, redirect_uris } = globalCredentials.installed; // 'installed' name in  json file
    // @ts-ignore
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("sign in URL: " + authUrl);
    res.json({ signInURL: authUrl }); // send JSON with sign in URL
});
app.post("/api/consumeAccessCode", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.consumeAccessCode(req.body.accessCode, authArr).then((success) => {
        console.log(success);
        req.session.accessToken = success; // make success an ITokenInterface and store it in the users session for later oAuthObject creation
        res.status(200).send({
            Message: "Access token is now set!"
        });
    }).catch((failure) => {
        res.status(503).send({
            Message: failure
        });
    });
});
app.get("/api/getCollections", (req, res) => {
    console.log(req.session.accessToken);
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.getCollections(req.session.accessToken)
        .then((retValue) => {
        console.log(retValue);
        // console.log('Client id is: ' + auth._clientId);
        res.json(retValue);
    }).catch((error) => {
        // TODO: send error response for if no collections were found
        console.log(error);
    });
});
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.get("/api/getMotifs", (req, res) => {
    // generatePublicURL(req.session.id)
    //     .then(r => {
    //         console.log("getSVG fired");
    //     });
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
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
app.get("/api/createFolder", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.createFolder(req.session.accessToken, "someName2").then((r) => {
        console.log(r);
    });
});
app.get("/api/createSubFolder", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.createFolder(req.session.accessToken, "a sub folder name", "1OsdJZ7U31Z7MTUzyixgpH3ZdcEeVsnF5").then((r) => {
        console.log(r);
    });
});
app.get("/api/updateFile", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    // gAPI.updateFile(req.session.accessToken, "1LyeZUJJmtd-lLm9FcYNGLN-SG0hKf2r_");
});
app.post("/api/getFileByID", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    // "1GZw_Uog5thUHWy42jqP16L2lAuyftnlB"
    gAPI.getFileByID(req.session.accessToken, req.body.fileID).then((fileContents) => {
        res.json(fileContents);
    });
});
app.post("/api/newCollection", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.getFolderID(req.session.accessToken, "SPA", true).then((resultSPAid) => {
        const motifsPromise = gAPI.getFolderID(req.session.accessToken, "Motifs", false);
        const patternsPromise = gAPI.getFolderID(req.session.accessToken, "Patterns", false);
        Promise.all([motifsPromise, patternsPromise])
            .then((folderIDResults) => {
            console.log(folderIDResults);
            const motifFolderDetails = folderIDResults[0];
            const patternFolderDetails = folderIDResults[1];
            const SPAfolderDetails = resultSPAid;
            console.log("The collection name is: " + req.body.collectionName);
            gAPI.createNewJSONFile(req.session.accessToken, req.body.collectionName, "", SPAfolderDetails.fileID)
                .then((result) => {
                const emptyCollectionID = result;
                console.log(emptyCollectionID.id);
                const fileBody = {
                    collectionName: req.body.collectionName,
                    collectionID: emptyCollectionID.id,
                    motifsFolderID: motifFolderDetails.fileID,
                    patternsFolderID: patternFolderDetails.fileID,
                    childPatterns: [],
                    story: "a story here",
                    colorThemes: []
                };
                gAPI.updateJSONFile(req.session.accessToken, emptyCollectionID.id, JSON.stringify(fileBody))
                    .then((updateResult) => {
                    console.log(updateResult);
                    res.json(fileBody);
                }).catch((updateError) => {
                    console.log(updateError);
                });
            });
        })
            .catch((error) => {
            console.log(error + "Could not fetch Motifs and/or Pattern Folder IDs");
        });
    });
});
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=test.js.map