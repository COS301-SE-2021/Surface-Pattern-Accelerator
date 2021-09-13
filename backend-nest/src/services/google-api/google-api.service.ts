import { Injectable } from '@nestjs/common';
import {ITokenInterface} from "../../../BackendInterfaces/token.interface";
import {google} from "googleapis";
import {IFolderInterface} from "../../../BackendInterfaces/folder.interface";
import {ICollectionsInterface} from "../../../BackendInterfaces/collections.interface";
import {ICollectionDetailsInterface} from "../../../BackendInterfaces/collectionDetails.interface";
import {Stream} from "stream";
import * as fs from "fs";
import {createReadStream} from "fs";


@Injectable()
export class GoogleApiService {

    private appCredentials: { installed: { client_secret: any; client_id: any; redirect_uris: any; }; };
    private SCOPES = ["https://www.googleapis.com/auth/drive"];
    getCredentials()
    {
        if (this.appCredentials == undefined)
        {
            //TODO: replace with environment variables
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
        else
        {
            return this.appCredentials;
        }
    }

    getScopes()
    {
        return this.SCOPES;
    }

    public createAuthObject(token: ITokenInterface) {
        const {client_secret, client_id, redirect_uris} = this.getCredentials().installed; // 'installed' name in  json file
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    }

    public getFolderID(token: ITokenInterface, folderName: string) {
        return new Promise((success, failure) => {

            const auth = this.createAuthObject(token);
            const drive = google.drive({version: "v3", auth});

            drive.files.list({
                q: "mimeType = 'application/vnd.google-apps.folder'" + " and trashed=false",
                spaces: "drive",
                fields: "nextPageToken, files(id, name, mimeType)",
            }).then((filesListResult) => {
                const files = filesListResult.data.files;
                if (files.length) {
                    files.forEach((file) => { // loop through all files and search for name === folderName
                        console.log(`${file.name} (${file.id})`);
                        if (file.name === folderName) {
                            console.log("SPA folder found");
                            const folderDetails: IFolderInterface = {fileName: file.name, fileID: file.id } as IFolderInterface;
                            success(folderDetails); // if found: success
                            return;
                        }
                    });
                    failure({text: "No Folder \'" + folderName + "\' was found"});

                } else {
                    console.log("Zero folders exist on the users drive");
                    failure({text: "The users google drive is empty "}); // TODO: create folder if the users google drive is empty
                }
            });

        });
        //     .then( (folderDetails) => {
        //     // console.log(folderDetails);
        //     return folderDetails;
        // });
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

    public getCollections(token: ITokenInterface) {
        const auth = this.createAuthObject(token);

        return new Promise((resolve, reject) => {
            this.getFolderID(token, "Collections") //
                .then((folderIDResult) => { // Then get all contents of folder
                    // TODO: insert try catch if type is wrong
                    const fDetails: IFolderInterface = folderIDResult as IFolderInterface;

                    console.log("The file ID is: " + fDetails.fileID);
                    const FILE_ID = "'" + fDetails.fileID + "' in parents and trashed=false";

                    const drive = google.drive({version: "v3", auth});
                    drive.files.list({ // gets folder content***************
                        q: FILE_ID,
                        pageSize: 10,
                        fields: "nextPageToken, files(id, name, mimeType)",
                    }, (err, res) => {
                        if (err) {
                            return console.log("The API returned an error: " + err);
                        }
                        const files = res.data.files;
                        const collectionsJSON: ICollectionsInterface = {collections: [] = []} as unknown as ICollectionsInterface;
                        if (files.length) {

                            console.log("Contents in folder:");
                            files.map((file) => {
                                console.log(`${file.name} (${file.id}) ${file.mimeType}`);
                                if (file.mimeType === "application/json") {
                                    collectionsJSON.collections.push({collectionName: file.name, collectionID: file.id} as ICollectionDetailsInterface);
                                }
                            });
                            resolve(collectionsJSON);

                        } else {
                            // Folder is empty
                            resolve(collectionsJSON);
                            console.log("Collections folder is empty");
                        }
                    });
                }).catch((noFolderWithThatNameError) => {
                console.log(noFolderWithThatNameError);
                reject({text: "something went wrong with fetching folder content - No folder named SPA, one will be created"});
            });

        });
    }

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

    public uploadImage(token: ITokenInterface, fileName: string, parentID: string = "", mimeType ="image/svg+xml") {
        const auth = this.createAuthObject(token);
        const drive = google.drive({version: "v3", auth});
        const filePath = "./files/" + fileName;

        if (parentID === "") {
            //console.log("No Parent***************************************************************************************")
            const fileMetadata = {
                name: fileName
            };
            const media = {
                mimeType: mimeType,
                body: createReadStream(filePath)
            };

            return drive.files.create({
                // @ts-ignore
                resource: fileMetadata,
                media,
                fields: "id"
            });
        } else {
            //console.log("Has Parent***************************************************************************************")
            const fileMetadata = {
                name: fileName,
                parents: [parentID]
            };
            const media = {
                mimeType: mimeType,
                body: createReadStream(filePath)
            };

            return drive.files.create({
                // @ts-ignore
                resource: fileMetadata,
                media,
                fields: "id"
            });
        }

    }

    public listMotifs(token: ITokenInterface) {
        const auth = this.createAuthObject(token);

        // const motifSkeleton = '{"motifNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
        const motifDetails = JSON.parse('{"motifNames": []}');

        return new Promise((resolve, reject) => {
            const drive = google.drive({version: "v3", auth});

            this.getFolderID(token, "Motifs")
                .then((motifsFolderResult) => {

                    const motifsFolderDetails: IFolderInterface = motifsFolderResult as IFolderInterface;
                    const FILE_ID = "'" + motifsFolderDetails.fileID + "' in parents and trashed=false";

                    drive.files.list({
                        // q: "mimeType='image/svg+xml'",
                        q: FILE_ID,
                        // pageSize: 10,
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
                            reject({text: "No Motifs Found"});
                            console.log("No files found.");
                        }
                    });
                })
                .catch((getMotifsFolderError) => {
                    reject({text: "something went wrong with fetching motifs"});
                });

        });
    }

    public getPublicMotifsInfo(token: ITokenInterface, motifDetails: any) {
        const permissionPromiseArray: Array<Promise<any>> = [];
        for (const elem in motifDetails.motifNames) {
            if (elem) {
                const permissionPromise = this.setPermissions(token, motifDetails.motifNames[elem]);
                permissionPromiseArray.push(permissionPromise);

            }
        }
        console.log("Permissions promise array: " + permissionPromiseArray);
        return Promise.all(permissionPromiseArray);
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

    public getPublicLink(token: ITokenInterface, itemID: any) {

        const auth = this.createAuthObject(token);

        try {
            const drive = google.drive({version: "v3", auth});
            return drive.files.get({
                fileId: itemID,
                fields: "webContentLink"
            });

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
                    const publicLink = this.getPublicLink(token, motifContainer[elem].motifID);
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

}
