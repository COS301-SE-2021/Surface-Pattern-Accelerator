exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 10:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleApiService = void 0;
const common_1 = __webpack_require__(6);
const googleapis_1 = __webpack_require__(11);
let GoogleApiService = class GoogleApiService {
    constructor() {
        this.SCOPES = ["https://www.googleapis.com/auth/drive"];
    }
    getCredentials() {
        if (this.appCredentials == undefined) {
            this.appCredentials = JSON.parse("{\n" +
                '    "installed":{\n' +
                '        "client_id":"838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com",\n' +
                '        "project_id":"spadd-6","auth_uri":"https://accounts.google.com/o/oauth2/auth",\n' +
                '        "token_uri":"https://oauth2.googleapis.com/token",\n' +
                '        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",\n' +
                '        "client_secret":"qykE5ojYUpiRNSl3WFTlCIfR",\n' +
                '        "redirect_uris":["http://localhost:8100/loginResponse"],\n' +
                '        "javascript_origins":["http://localhost:3000","http://localhost:8100"]\n' +
                "    }\n" +
                "}");
            return this.appCredentials;
        }
        else {
            return this.appCredentials;
        }
    }
    getScopes() {
        return this.SCOPES;
    }
    createAuthObject(token) {
        const { client_secret, client_id, redirect_uris } = this.getCredentials().installed;
        const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    }
    async getFolderID(token, folderName) {
        return new Promise((success, failure) => {
            const auth = this.createAuthObject(token);
            const drive = googleapis_1.google.drive({ version: "v3", auth });
            drive.files.list({
                q: "mimeType = 'application/vnd.google-apps.folder'" + " and trashed=false",
                spaces: "drive",
                fields: "nextPageToken, files(id, name, mimeType)",
            }).then((filesListResult) => {
                const files = filesListResult.data.files;
                if (files.length) {
                    files.forEach((file) => {
                        console.log(`${file.name} (${file.id})`);
                        if (file.name === folderName) {
                            console.log("SPA folder found");
                            const folderDetails = { fileName: file.name, fileID: file.id };
                            success(folderDetails);
                            return;
                        }
                    });
                    failure({ text: "No Folder \'" + folderName + "\' was found" });
                }
                else {
                    console.log("Zero folders exist on the users drive");
                    failure({ text: "The users google drive is empty " });
                }
            });
        });
    }
    async getCollections(token) {
        const auth = this.createAuthObject(token);
        return new Promise((resolve, reject) => {
            this.getFolderID(token, "Collections")
                .then((folderIDResult) => {
                const fDetails = folderIDResult;
                console.log("The file ID is: " + fDetails.fileID);
                const FILE_ID = "'" + fDetails.fileID + "' in parents and trashed=false";
                const drive = googleapis_1.google.drive({ version: "v3", auth });
                drive.files.list({
                    q: FILE_ID,
                    pageSize: 10,
                    fields: "nextPageToken, files(id, name, mimeType)",
                }, (err, res) => {
                    if (err) {
                        return console.log("The API returned an error: " + err);
                    }
                    const files = res.data.files;
                    const collectionsJSON = { collections: [] = [] };
                    if (files.length) {
                        console.log("Contents in folder:");
                        files.map((file) => {
                            console.log(`${file.name} (${file.id}) ${file.mimeType}`);
                            if (file.mimeType === "application/json") {
                                collectionsJSON.collections.push({ collectionName: file.name, collectionID: file.id });
                            }
                        });
                        resolve(collectionsJSON);
                    }
                    else {
                        resolve(collectionsJSON);
                        console.log("Collections folder is empty");
                    }
                });
            }).catch((noFolderWithThatNameError) => {
                console.log(noFolderWithThatNameError);
                reject({ text: "something went wrong with fetching folder content - No folder named SPA, one will be created" });
            });
        });
    }
    createFolder(token, folderName, parentID = "") {
        const auth = this.createAuthObject(token);
        const drive = googleapis_1.google.drive({ version: "v3", auth });
        if (parentID !== "") {
            const fileMetadata = {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
                parents: [parentID]
            };
            return drive.files.create({
                fields: "id",
                resource: fileMetadata
            });
        }
        else {
            const fileMetadata = {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder"
            };
            return drive.files.create({
                fields: "id",
                resource: fileMetadata
            });
        }
    }
};
GoogleApiService = __decorate([
    (0, common_1.Injectable)()
], GoogleApiService);
exports.GoogleApiService = GoogleApiService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("72dd4f06885da2889bd9")
/******/ })();
/******/ 
/******/ }
;