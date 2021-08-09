import fs, {linkSync} from "fs";
import {google} from "googleapis";
import {AuthClientObjectWrapper} from "./AuthClientObjectWrapper";
import {IFolderInterface} from "./folder.interface";
import {ITokenInterface} from "./token.interface";

export class GoogleApiFunctions {

    public globalCredentials: { installed: { client_secret: any; client_id: any; redirect_uris: any; }; };

    constructor() {

        console.log("g api created");
        this.globalCredentials = JSON.parse("{\n" +
            '    "installed":{\n' +
            '        "client_id":"838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com",\n' +
            '        "project_id":"spadd-6","auth_uri":"https://accounts.google.com/o/oauth2/auth",\n' +
            '        "token_uri":"https://oauth2.googleapis.com/token",\n' +
            '        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",\n' +
            '        "client_secret":"qykE5ojYUpiRNSl3WFTlCIfR",\n' +
            '        "redirect_uris":["http://localhost:8100/loginResponse"],\n' +
            '        "javascript_origins":["http://localhost:3000"]\n' +
            "    }\n" +
            "}");
    }

    public printSomething() {
        console.log("print something to test multiple files");
    }

    // takes authorisation object to store and and finds a place in the array to store it
    // public storeAccessCredentials(tempAccessCredentials: AuthClientObjectWrapper, authArr: AuthClientObjectWrapper[]) {
    //     console.log("Store ID is: " + tempAccessCredentials.sessionID);
    //     for (const accCred of authArr) {
    //         if (accCred !== undefined) {
    //             if (accCred.sessionID === tempAccessCredentials.sessionID) {
    //                 console.log("Access Credentials already stored");
    //                 return;
    //             }
    //         }
    //     }
    //     for (let i = 0; i < authArr.length; i++) {
    //         if (authArr[i] === undefined) {
    //             authArr[i] = tempAccessCredentials;
    //             console.log("Access Credentials stored successfully");
    //             return;
    //         }
    //     }
    //     // if the code gets here the array is full.
    //     // prune every now and then
    // }
    //
    // // gets the autharisation object matching the users session ID, the session ID is passed through the object constructor
    // public retrieveAccessCredentials(authArr: AuthClientObjectWrapper[]) {
    //     console.log("fetch ID is: " + this.userSessionID);
    //     for (const accCred of authArr) {
    //         if (accCred !== undefined) {
    //             if (accCred.sessionID === this.userSessionID) {
    //                 console.log("Credentials returned successfully");
    //                 return accCred;
    //             }
    //         }
    //     }
    //     console.log("Credentials unsuccessfully fetched");
    //     // if the code gets here then the access credentials is not in the array
    // }

    public consumeAccessCode(accessCode: string, authArr: AuthClientObjectWrapper[]) {

        const {client_secret, client_id, redirect_uris} = this.globalCredentials.installed; // 'installed' name in  json file
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(accessCode, (err: any, token: ITokenInterface) => {
                if (err) { return console.error("Error retrieving access token", err); }

                console.log("access token: " + token.access_token);
                oAuth2Client.setCredentials(token);

                // const gAPI = new GoogleApiFunctions(this.userSessionID);
                // gAPI.storeAccessCredentials(new AuthClientObjectWrapper(oAuth2Client, this.userSessionID), authArr); // Stores access credentials in array

                // resolve({text: "access code successfully set"});
                resolve(token);

            });
        });
    }

    public createAuthObject(token: ITokenInterface) {
        const {client_secret, client_id, redirect_uris} = this.globalCredentials.installed; // 'installed' name in  json file
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    }

    // public getCollections(token: ITokenInterface) {
    //     const collectionsSkeleton = '{"collectionNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
    //     const obj = JSON.parse(collectionsSkeleton);
    //     return new Promise((success, failure) => {
    //
    //         const auth = this.createAuthObject(token);
    //
    //         const drive = google.drive({version: "v3", auth});
    //         drive.files.list({
    //             q: "mimeType = 'application/vnd.google-apps.folder'",
    //             // q: "mimeType='application/json'",
    //             spaces: "drive",
    //             pageSize: 20,
    //             fields: "nextPageToken, files(id, name)",
    //         }, (err, driveRes) => {
    //             if (err) { return console.log("The API returned an error: " + err); }
    //             const files = driveRes.data.files;
    //             if (files.length) {
    //                 files.forEach((file) => {
    //                     console.log(`${file.name} (${file.id})`);
    //                     obj.collectionNames.push(file.name);
    //                 });
    //                 console.log(obj);
    //                 success(obj);
    //
    //             } else {
    //                 console.log("No files found.");
    //                 failure(obj);
    //             }
    //         });
    //     }).then( (data) => {
    //         console.log(data);
    //         return data;
    //     });
    // }

    public listMotifs(token: ITokenInterface) {
        const auth = this.createAuthObject(token);

        // const motifSkeleton = '{"motifNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
        const motifDetails = JSON.parse('{"motifNames": []}');

        return new Promise((resolve, reject) => {
            const drive = google.drive({version: "v3", auth});
            drive.files.list({
                q: "mimeType='image/svg+xml'",
                spaces: "drive",
                pageSize: 10,
                fields: "nextPageToken, files(id, name)",
            }, (err, res) => {
                if (err) { return console.log("The API returned an error: " + err); }
                const files = res.data.files;
                if (files.length) {

                    console.log("Files:");
                    files.map((file) => {
                        console.log(`${file.name} (${file.id})`);
                        const motifContainer = JSON.parse('{"motifName": "","motifID": "", "motifLink": "", "linkPermission": ""}');
                        motifContainer.motifName = file.name;
                        motifContainer.motifID = file.id;
                        // obj.motifNames.push(file.id);
                        motifDetails.motifNames.push(motifContainer);
                    });
                    console.log(motifDetails);
                    resolve(motifDetails);

                } else {
                    reject({text: "something went wrong with fetching motifs"});
                    console.log("No files found.");
                }
            });
        });
    }

    public setPermissions(token: ITokenInterface, motifContainer: any) {

        const auth = this.createAuthObject(token);

        // let test;
        try {

            console.log("the motif ID is: " + motifContainer.motifID);
            const drive = google.drive({version: "v3", auth});
            return drive.permissions.create({ // returns promise
                fileId: motifContainer.motifID,
                requestBody: {
                    role: "reader",
                    type: "anyone"
                }
            })
            .then((permissionSuccess) => {
                // console.log(permissionSuccess)
                motifContainer.linkPermission = "good";
                // return {text: "good"}; //the promise returns this when permission setting has been successful
                return motifContainer;
            }).catch((permissionFailure) => {
                motifContainer.linkPermission = "bad";
                // console.log(permissionFailure)
                // return {text: "bad"}; ////the promise returns this when permission setting has been unsuccessful
                return motifContainer;
            });
            // console.log("the test is: " + test)
        } catch (error) {
            console.log(error.message);

        }
    }

    public getPublicMotifsInfo(token: ITokenInterface, motifDetails: any) {
        const permissionPromiseArray: Array<Promise<any>> = [];
        for (const elem in motifDetails.motifNames) {
            if (elem) {
                const permissionPromise = this.setPermissions(token, motifDetails.motifNames[elem]);
                permissionPromiseArray.push(permissionPromise);
                // console.log(motifDetails.motifNames[elem]);
                // const motifPermissionPromise = new Promise((resolve, reject) => {
                //     try
                //     {
                //         const drive = google.drive({version: 'v3', auth});
                //         drive.permissions.create({
                //             fileId: motifDetails.motifNames[elem].motifID,
                //             requestBody: {
                //                 role: 'reader',
                //                 type: 'anyone'
                //             }
                //         })
                //         console.log(motifDetails.motifNames[elem]);
                //         promiseArr.push(motifPermissionPromise);
                //         resolve(motifDetails.motifNames[elem]);
                //     }
                //     catch (error) {
                //         console.log(error.message)
                //         reject({text: "{}"});
                //     }
                // })
            }
        }
        console.log("Permissions promise array: " + permissionPromiseArray);
        return Promise.all(permissionPromiseArray);
    }

    public getPublicLink(token: ITokenInterface, motifContainer: any) {

        const auth = this.createAuthObject(token);

        // let test;
        try {
            console.log("the motif ID is: " + motifContainer.motifID);
            const drive = google.drive({version: "v3", auth});
            if (motifContainer.linkPermission === "bad") {
                return null;
            }
            return drive.files.get({
                fileId: motifContainer.motifID,
                fields: "webContentLink"
            });
                // .then(permissionSuccess => {
                //     // console.log(permissionSuccess)
                //     motifContainer.linkPermission = "good";
                //     // return {text: "good"}; //the promise returns this when permission setting has been successful
                //     return motifContainer;
                // }).catch(permissionFailure => {
                //     motifContainer.linkPermission = "bad";
                //     // console.log(permissionFailure)
                //     // return {text: "bad"}; ////the promise returns this when permission setting has been unsuccessful
                //     return motifContainer;
                // })
            // console.log("the test is: " + test)
        } catch (error) {
            console.log(error.message);
        }
    }

    public generatePublicLinksJSON(token: ITokenInterface, motifContainer: any[]) {
        const linkPromiseArray: Array<Promise<any>> = [];
        const goodMotifs = JSON.parse('{"motifDetails": []}');
        for (const elem in motifContainer) {
            if (elem) {
                if (motifContainer[elem].linkPermission === "good") {
                    const publicLink = this.getPublicLink(token, motifContainer[elem]);
                    linkPromiseArray.push(publicLink);
                    goodMotifs.motifDetails.push(motifContainer[elem]);

                    console.log(motifContainer[elem]);
                }

            }
        }
        return Promise.all(linkPromiseArray).then((links) => {
            for (const link in links) {
                if (link) {
                    console.log(links[link].data);
                    goodMotifs.motifDetails[link].motifLink = links[link].data.webContentLink;
                }

            }
            return goodMotifs;
            // console.log(goodMotifs);

        });

    }

    public getCollections(token: ITokenInterface) {
        const auth = this.createAuthObject(token);

        return new Promise((resolve, reject) => {
            this.getFolderID(token, "SPA") // get folder ID of name "SPA"
                .then((folderIDResult) => { // Then get all contents of folder
                    // TODO: insert try catch if type is wrong
                    const fDetails: IFolderInterface = folderIDResult as IFolderInterface;
                    // const ID = "1bBwaYPMKdkuarODP5dVuaiTakehLu183";
                    // const ID = fDetails.fileID;
                    console.log("The file ID is: " + fDetails.fileID);
                    const FILE_ID = "'" + fDetails.fileID + "' in parents";

                    const drive = google.drive({version: "v3", auth});
                    drive.files.list({
                        q: FILE_ID,
                        pageSize: 10,
                        fields: "nextPageToken, files(id, name, mimeType)",
                    }, (err, res) => {
                        if (err) {
                            return console.log("The API returned an error: " + err);
                        }
                        const files = res.data.files;
                        if (files.length) {

                            // const collectionsSkeleton = '{"collectionNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
                            const collectionsSkeleton = JSON.parse('{"collectionNames": []}');

                            console.log("Contents in folder:");
                            files.map((file) => {
                                console.log(`${file.name} (${file.id}) ${file.mimeType}`);
                                if (file.mimeType === "application/json") {
                                    collectionsSkeleton.collectionNames.push(file.name);
                                }

                            });

                            resolve(collectionsSkeleton);

                        } else {
                            reject({text: "something went wrong with fetching folder content"});
                            console.log("No files found.");
                        }
                    });
            });

        });
    }

    public getFolderID(token: ITokenInterface, folderName: string) {
        return new Promise((success, failure) => {

            const auth = this.createAuthObject(token);

            const drive = google.drive({version: "v3", auth});
            drive.files.list({
                q: "mimeType = 'application/vnd.google-apps.folder'",
                spaces: "drive",
                pageSize: 20,
                fields: "nextPageToken, files(id, name, mimeType)",
            }, (err, driveRes) => {
                if (err) { return console.log("The API returned an error: " + err); }
                const files = driveRes.data.files;
                if (files.length) {
                    files.forEach((file) => {
                        console.log(`${file.name} (${file.id})`);
                        if (file.name === folderName) {
                            const folderDetails: IFolderInterface = {fileName: file.name, fileID: file.id } as IFolderInterface;

                            success(folderDetails);
                            // ends function here
                        }
                    });
                    failure(); // TODO: create main folder here, parameter to make file if needed: true/false

                } else {
                    console.log("No files found.");
                    failure();
                }
            });
        }).then( (folderDetails) => {
            // console.log(folderDetails);
            return folderDetails;
        });
    }
}
