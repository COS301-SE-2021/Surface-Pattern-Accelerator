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
const multer_1 = __importDefault(require("multer"));
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
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer_1.default({
    storage,
    limits: { fileSize: 10000 }
});
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
        console.log("Could not find collections");
        console.log(error);
        gAPI.createFolder(req.session.accessToken, "SPA")
            .then((SPAFolderResult) => {
            const SPAFolderDetails = SPAFolderResult.data;
            console.log(SPAFolderDetails.id);
            const collectionsPromise = gAPI.createFolder(req.session.accessToken, "Collections", SPAFolderDetails.id);
            const patternsPromise = gAPI.createFolder(req.session.accessToken, "Patterns", SPAFolderDetails.id);
            const motifsPromise = gAPI.createFolder(req.session.accessToken, "Motifs", SPAFolderDetails.id);
            Promise.all([collectionsPromise, patternsPromise, motifsPromise])
                .then((promiseResultArray) => {
                res.json({ collections: [] = [] });
            });
        });
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
    })
        .catch(() => {
        res.json({ motifDetails: [] = [] }); // TODO: use motif Array interface motifArray.interface.ts
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
app.post("/api/updateFile", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    if (req.body.newName) {
        gAPI.updateJSONFile(req.session.accessToken, req.body.fileID, req.body.content, req.body.newName).then((result) => {
            res.status(200).send({
                Message: "Rename and Write to File Successful"
            });
        });
    }
    else {
        gAPI.updateJSONFile(req.session.accessToken, req.body.fileID, req.body.content).then((result) => {
            res.status(200).send({
                Message: "Write to File Successful"
            });
        });
    }
});
app.post("/api/getFileByID", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.getFileByID(req.session.accessToken, req.body.fileID).then((fileContents) => {
        res.json(fileContents);
    });
});
app.post("/api/newCollection", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.getFolderID(req.session.accessToken, "SPA").then((resultSPAid) => {
        const motifsPromise = gAPI.getFolderID(req.session.accessToken, "Motifs");
        const patternsPromise = gAPI.getFolderID(req.session.accessToken, "Patterns");
        const collectionsPromise = gAPI.getFolderID(req.session.accessToken, "Collections");
        Promise.all([motifsPromise, patternsPromise, collectionsPromise])
            .then((folderIDResults) => {
            console.log(folderIDResults);
            const motifFolderDetails = folderIDResults[0];
            const patternFolderDetails = folderIDResults[1];
            const collectionsFolderDetails = folderIDResults[2];
            const SPAfolderDetails = resultSPAid; // TODO: replace getFolderID with session implementation
            console.log("The collection name is: " + req.body.collectionName);
            gAPI.createNewJSONFile(req.session.accessToken, req.body.collectionName, "", collectionsFolderDetails.fileID)
                .then((result) => {
                const emptyCollectionID = result;
                console.log(emptyCollectionID.id);
                const fileBody = {
                    collectionName: req.body.collectionName,
                    collectionID: emptyCollectionID.id,
                    motifsFolderID: motifFolderDetails.fileID,
                    patternsFolderID: patternFolderDetails.fileID,
                    childPatterns: [] = [],
                    story: "a story here",
                    colorThemes: [] = []
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
    }).catch((error) => {
        console.log(error);
    });
});
app.post("/api/createNewJSONFile", (req, res) => {
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.createNewJSONFile(req.session.accessToken, "reservation", "", req.body.patternFolderID)
        .then((result) => {
        // let newFileDetails: any = result;
        console.log(result);
        res.json(result);
    });
});
app.post("/api/uploadMotif", upload.array("files"), (req, res) => {
    const files = req.files;
    const gAPI = new GoogleApiFunctions_1.GoogleApiFunctions();
    gAPI.getFolderID(req.session.accessToken, "Motifs")
        .then((resultMotifsID) => {
        const motifFolderDetails = resultMotifsID;
        const uploadPromisesArray = [];
        for (const file in files) {
            if (files.hasOwnProperty(file)) { // complains if its just "file"
                const filePath = "./uploads/" + files[file].filename;
                console.log(filePath);
                if (fs_1.default.existsSync(filePath)) {
                    const uploadPromise = gAPI.uploadMotif(req.session.accessToken, files[file].filename, motifFolderDetails.fileID);
                    uploadPromisesArray.push(uploadPromise);
                }
                else {
                    console.log("Does not exist");
                }
            }
        }
        Promise.all(uploadPromisesArray).then(() => {
            res.json({ Status: "200 - success" });
        }).catch(() => {
            res.json({ Status: "404 - no file found in request" });
        });
    });
});
/////////////////////////////////////////////////////////////// PAYMENT
// app.post("/api/create-checkout-session", async (req, res) => {
//     const YOUR_DOMAIN = "http://localhost:8100";
//     const session = await stripe.checkout.sessions.create({
//                 line_items: [
//                     {
//                         // TODO: replace this with the `price` of the product you want to sell
//                         price: "price_1JWJO7GnSZPbZIbccDcaukYW",
//                         quantity: 1,
//                     },
//                 ],
//                 payment_method_types: [
//                     "card",
//                     "alipay"
//                 ],
//                 mode: "payment",
//                 success_url: `${YOUR_DOMAIN}/success.html`,
//                 cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//             });
//
//     res.redirect(303, session.url);
//         });
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
// app.get("/addPayment", function(request, response) {
//     const firstname = request.body.firstname;
//     const surname = request.body.surname;
//     const idNumber = request.body.idnumber;
//     const password = request.body.password;
//
//     if (firstname && password) {
//         connection.query("SELECT * FROM voter WHERE id = ? AND firstname = ? AND surname = ? AND password = ?", [idNumber, firstname, surname, password], function(error: any, results: string | any[], fields: any) {
//             if (results.length > 0) {
//                 // request.session.loggedin = true;
//                 // request.session.userID = idNumber;
//                 // response.redirect('/voterMain');
//                 response.send("successful");
//             } else {
//                 response.send("Incorrect firstname and/or Password!");
//             }
//             response.end();
//         });
//     } else {
//         response.send("Please enter firstname and Password!");
//         response.end();
//     }
// });
//# sourceMappingURL=test.js.map