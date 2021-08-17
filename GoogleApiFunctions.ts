import bodyParser from "body-parser";
import fs, {linkSync} from "fs";
import {google} from "googleapis";
import {toolresults} from "googleapis/build/src/apis/toolresults";

// import stream from "node:stream";
import path from "path";
import { Stream } from "stream";
import {AuthClientObjectWrapper} from "./AuthClientObjectWrapper";
import {ICollectionDetailsInterface} from "./Interfaces/collectionDetails.interface";
import {ICollectionsInterface} from "./Interfaces/collections.interface";
import {IFolderInterface} from "./Interfaces/folder.interface";
import {ITokenInterface} from "./Interfaces/token.interface";

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

    // returns list of collections, namely json files in the SPA folder on G drive
    public getCollections(token: ITokenInterface) {
        const auth = this.createAuthObject(token);

        return new Promise((resolve, reject) => {
            this.getFolderID(token, "SPA", true) // get folder ID of name "SPA", true to create folder SPA folder if it does not exist
                .then((folderIDResult) => { // Then get all contents of folder
                    // TODO: insert try catch if type is wrong
                    const fDetails: IFolderInterface = folderIDResult as IFolderInterface;
                    // const ID = "1bBwaYPMKdkuarODP5dVuaiTakehLu183";
                    // const ID = fDetails.fileID;
                    console.log("The file ID is: " + fDetails.fileID);
                    const FILE_ID = "'" + fDetails.fileID + "' in parents and trashed=false";

                    const drive = google.drive({version: "v3", auth});
                    drive.files.list({ // gets folder content
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
                            // const collections = JSON.parse('{"collectionNames": []}');
                            const collectionsJSON: ICollectionsInterface = {collections: []} as unknown as ICollectionsInterface;

                            console.log("Contents in folder:");
                            files.map((file) => {
                                console.log(`${file.name} (${file.id}) ${file.mimeType}`);
                                if (file.mimeType === "application/json") {
                                    collectionsJSON.collections.push({collectionName: file.name, collectionID: file.id} as ICollectionDetailsInterface);
                                }
                            });
                            // console.log(collectionsJSON);
                            resolve(collectionsJSON);

                        } else {
                            reject({text: "something went wrong with fetching folder content - No Collections Found"});
                            console.log("No files found.");
                        }
                    });
            }).catch((noFolderWithThatNameError) => {
                console.log(noFolderWithThatNameError);
                reject({text: "something went wrong with fetching folder content - No folder named SPA, one will be created"});
            });

        });
    }

    public getFolderID(token: ITokenInterface, folderName: string, createIfNone: boolean) {
        return new Promise((success, failure) => {

            const auth = this.createAuthObject(token);

            const drive = google.drive({version: "v3", auth});
            drive.files.list({
                q: "mimeType = 'application/vnd.google-apps.folder'",
                spaces: "drive",
                pageSize: 20,
                fields: "nextPageToken, files(id, name, mimeType)",
            }, (err, driveRes) => {
                let spaFolderFound = false;
                if (err) { return console.log("The API returned an error: " + err); }
                const files = driveRes.data.files;
                if (files.length) {
                    files.forEach((file) => { // loop through all files and search for name === folderName
                        console.log(`${file.name} (${file.id})`);
                        if (file.name === folderName) {
                            console.log("SPA folder found");
                            const folderDetails: IFolderInterface = {fileName: file.name, fileID: file.id } as IFolderInterface;
                            spaFolderFound = true;
                            success(folderDetails); // if found: success
                            return;
                            // ends function here
                        }
                    });
                    // end of loop so folder not found
                    // create folder if parameter createIfNone === true
                    if (createIfNone === true && spaFolderFound === false) {
                        this.createFolder(token, "SPA").then((r) => {
                            console.log("SPA Folder created as it was not found");
                            console.log(r.data);
                            const idResponse: any = r.data;

                            const PatternsPromise = this.createFolder(token, "Patterns", idResponse.id); // create Patterns sub folder
                            const MotifsPromise = this.createFolder(token, "Motifs", idResponse.id); // create Motifs sub folder

                            Promise.all([PatternsPromise, MotifsPromise]).then((subFoldersResponse) => {
                                console.log(subFoldersResponse);
                                const folderDetails: IFolderInterface = {fileName: "SPA", fileID: idResponse.id } as IFolderInterface;
                                success(folderDetails); // if found: success
                            });

                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                    failure();

                } else {
                    console.log("No files found.");
                    failure(); // TODO: create folder if the users google drive is empty
                }
            });
        }).then( (folderDetails) => {
            // console.log(folderDetails);
            return folderDetails;
        });
    }

    public createFolder(token: ITokenInterface, folderName: string, parentID: string = "") {
        const auth = this.createAuthObject(token);
        const drive = google.drive({version: "v3", auth});

        if (parentID !== "") {
            const fileMetadata = {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
                parents: [parentID]
            };

            // @ts-ignore - Typescript does not recognise this function but javascript does, transpiles successfully
            return drive.files.create({
                fields: "id",
                resource: fileMetadata
            });
        } else {
            const fileMetadata = {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder"
            };

            // @ts-ignore - Typescript does not recognise this function but javascript does, transpiles successfully
            return drive.files.create({
                fields: "id",
                resource: fileMetadata
            });
        }
    }

    public updateJSONFile(token: ITokenInterface, fileID: string, content: any, newName: string = "") {
        const auth = this.createAuthObject(token);
        const drive = google.drive({version: "v3", auth});

        const buf = Buffer.from(content, "binary");
        const buffer = Uint8Array.from(buf);

        const bufferStream = new Stream.PassThrough();
        bufferStream.end(buffer);

        const media = {
            mimeType: "application/json",
            body: bufferStream
        };

        if (newName === "") { // if the file should not be renamed
            return drive.files.update({
                fileId: fileID,
                media
            }).then((result) => {
                console.log(result);
                return {text: "JSON file updated successfully"};
            }).catch((error) => {
                console.log(error);
                return {text: "Error Updating JSON file"};
            });
        } else { // if file should be renamed
            const body = {name: newName};
            // @ts-ignore
            return drive.files.update({
                fileId: fileID,
                resource: body,
                media
            }).then((result) => {
                console.log(result);
                return {text: "JSON file updated successfully"};
            }).catch((error) => {
                console.log(error);
                return {text: "Error Updating JSON file"};
            });
        }

    }

    // return the file contents
    public getFileByID(token: ITokenInterface, fileID: string) {
        const auth = this.createAuthObject(token);
        const drive = google.drive({version: "v3", auth});

        return drive.files.get({
            fileId: fileID,
            alt: "media"
        }).then((result) => {
            console.log(result.data);
            return result.data;
        }).catch((error) => {
            console.log(error);
        });
    }

    public createNewJSONFile(token: ITokenInterface, fileName: string, content: any, parentID: string = "") {
        const auth = this.createAuthObject(token);
        const drive = google.drive({version: "v3", auth});

        const fileMetadata = {
            name: fileName + ".json",
            parents: [parentID]
        };

        const media = {
            mimeType: "application/json",
            body: JSON.stringify(content)
        };

        // @ts-ignore
        return drive.files.create({
            // @ts-ignore
            resource: fileMetadata,
            media,
            fields: "id"
        }).then((result) => {
            console.log(result);
            return result.data;
        }).catch((error) => {
            console.log(error);
            return {text: "JSON file creation failed"};
        });
    }

    public uploadMotif(token: ITokenInterface, fileName: string) {
        const auth = this.createAuthObject(token);
        const drive = google.drive({version: "v3", auth});
        const filePath = "./uploads/" + fileName;

        const fileMetadata = {
            name: fileName
        };
        const media = {
            mimeType: "image/svg+xml",
            body: fs.createReadStream(filePath)
        };

        return drive.files.create({
            // @ts-ignore
            resource: fileMetadata,
            media,
            fields: "id"
        });
    }

}
