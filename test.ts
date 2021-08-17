// Imports ///////////////////////////////////////////
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import {google} from "googleapis";
import {ITokenInterface} from "./Interfaces/token.interface";

import {AuthClientObjectWrapper} from "./AuthClientObjectWrapper";
import {GoogleApiFunctions} from "./GoogleApiFunctions";
import {ICollectionsContent} from "./Interfaces/collectionContents.interface";
import {IFolderInterface} from "./Interfaces/folder.interface";

import {rejects} from "assert";
import multer from "multer" ;

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

const storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

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
    }).catch((error) => {
        // TODO: send error response for if no collections were found
        console.log(error);
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

app.get("/api/createFolder", (req, res) => {
    const gAPI = new GoogleApiFunctions();
    gAPI.createFolder(req.session.accessToken, "someName2").then((r) => {
        console.log(r);
    });
});

app.get("/api/createSubFolder", (req, res) => {
    const gAPI = new GoogleApiFunctions();
    gAPI.createFolder(req.session.accessToken, "a sub folder name", "1OsdJZ7U31Z7MTUzyixgpH3ZdcEeVsnF5").then((r) => {
        console.log(r);
    });
});

app.post("/api/updateFile", (req, res) => {
    const gAPI = new GoogleApiFunctions();

    if (req.body.newName) {
        gAPI.updateJSONFile(req.session.accessToken, req.body.fileID, req.body.content, req.body.newName).then((result) => {
            res.status(200).send({ // 200 - OK
                Message: "Rename and Write to File Successful"
            });
        });
    } else {
        gAPI.updateJSONFile(req.session.accessToken, req.body.fileID, req.body.content).then((result) => {
            res.status(200).send({ // 200 - OK
                Message: "Write to File Successful"
            });
        });
    }

});

app.post("/api/getFileByID", (req, res) => {

    const gAPI = new GoogleApiFunctions();
    // "1GZw_Uog5thUHWy42jqP16L2lAuyftnlB"
    gAPI.getFileByID(req.session.accessToken, req.body.fileID).then((fileContents) => {
        res.json(fileContents);
    });
});

app.post("/api/newCollection", (req, res) => {

    const gAPI = new GoogleApiFunctions();
    gAPI.getFolderID(req.session.accessToken, "SPA", true).then((resultSPAid) => {

        const motifsPromise = gAPI.getFolderID(req.session.accessToken, "Motifs", false);
        const patternsPromise = gAPI.getFolderID(req.session.accessToken, "Patterns", false);

        Promise.all([motifsPromise, patternsPromise])
            .then((folderIDResults) => {
                console.log(folderIDResults);

                const motifFolderDetails: IFolderInterface = folderIDResults[0] as IFolderInterface;
                const patternFolderDetails: IFolderInterface = folderIDResults[1] as IFolderInterface;

                const SPAfolderDetails: IFolderInterface = resultSPAid as IFolderInterface;

                console.log("The collection name is: " + req.body.collectionName);
                gAPI.createNewJSONFile(req.session.accessToken, req.body.collectionName, "", SPAfolderDetails.fileID)
                    .then((result) => {
                        const emptyCollectionID: any = result;
                        console.log(emptyCollectionID.id);

                        const fileBody: ICollectionsContent = {
                            collectionName: req.body.collectionName,
                            collectionID: emptyCollectionID.id,
                            motifsFolderID: motifFolderDetails.fileID,
                            patternsFolderID: patternFolderDetails.fileID,
                            childPatterns: [],
                            story: "a story here",
                            colorThemes: []
                        } as unknown as ICollectionsContent;

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

app.post("/api/createNewJSONFile", (req, res) => {
    const gAPI = new GoogleApiFunctions();

    gAPI.createNewJSONFile(req.session.accessToken, "reservation", "", req.body.patternFolderID)
        .then((result) => {
            // let newFileDetails: any = result;
            console.log(result);
            res.json(result);
        });

});

app.post("/api/uploadMotif", upload.array("files"), (req, res) => {
    const files: any = req.files;
    const gAPI = new GoogleApiFunctions();
    // "./uploads/frame.png"

    // console.log(files[0].filename);

    const uploadPromisesArray: any[] = [];
    for (const file in files) {
        if (file) {
            const filePath = "./uploads/" + files[file].filename;
            console.log(filePath);
            if (fs.existsSync(filePath)) {
                const uploadPromise = gAPI.uploadMotif(req.session.accessToken, files[file].filename);
                uploadPromisesArray.push(uploadPromise);
            } else {
                console.log("Does not exist");
            }
        }

    }

    Promise.all(uploadPromisesArray).then(() => {
        res.json({Status: "200 - success"});
    }).catch(() => {
        res.json({Status: "404 - no file found in request"});
    });

    // if (Array.isArray(files) && files.length > 0) {
    //
    // } else {
    //
    // }

    // console.log(req);
});

// start the Express server
app.listen(port, () => {
        // tslint:disable-next-line:no-console
        console.log(`server started at http://localhost:${port}`);
    });
