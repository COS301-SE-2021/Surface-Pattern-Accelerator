import {AuthClientObjectWrapper} from './AuthClientObjectWrapper'
import {google} from "googleapis";
import fs from "fs";

export class GoogleApiFunctions {

    globalCredentials: { installed: { client_secret: any; client_id: any; redirect_uris: any; }; };


    userSessionID: string;
    constructor(sessID: string) {
        this.userSessionID = sessID;
        console.log("g api created");
        this.globalCredentials = JSON.parse('{\n' +
            '    "installed":{\n' +
            '        "client_id":"838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com",\n' +
            '        "project_id":"spadd-6","auth_uri":"https://accounts.google.com/o/oauth2/auth",\n' +
            '        "token_uri":"https://oauth2.googleapis.com/token",\n' +
            '        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",\n' +
            '        "client_secret":"qykE5ojYUpiRNSl3WFTlCIfR",\n' +
            '        "redirect_uris":["http://localhost:8100/loginResponse"],\n' +
            '        "javascript_origins":["http://localhost:3000"]\n' +
            '    }\n' +
            '}')
    }

    printSomething()
    {
        console.log("print something to test multiple files");
    }

    // takes authorisation object to store and and finds a place in the array to store it
    storeAccessCredentials(tempAccessCredentials: AuthClientObjectWrapper, authArr: AuthClientObjectWrapper[])
    {
        console.log("Store ID is: " + tempAccessCredentials.sessionID);
        for(const accCred of authArr)
        {
            if (accCred !== undefined)
            {
                if (accCred.sessionID === tempAccessCredentials.sessionID)
                {
                    console.log("Access Credentials already stored");
                    return;
                }
            }
        }
        for(let i = 0; i < authArr.length; i++)
        {
            if (authArr[i] === undefined)
            {
                authArr[i] = tempAccessCredentials;
                console.log("Access Credentials stored successfully");
                return;
            }
        }
        // if the code gets here the array is full.
        // prune every now and then
    }

    // gets the autharisation object matching the users session ID, the session ID is passed through the object constructor
    retrieveAccessCredentials(authArr: AuthClientObjectWrapper[])
    {
        console.log("fetch ID is: " + this.userSessionID);
        for(const accCred of authArr)
        {
            if (accCred !== undefined)
            {
                if (accCred.sessionID === this.userSessionID)
                {
                    console.log("Credentials returned successfully");
                    return accCred;
                }
            }
        }
        console.log("Credentials unsuccessfully fetched");
        // if the code gets here then the access credentials is not in the array
    }

    consumeAccessCode(accessCode: string, authArr: AuthClientObjectWrapper[])
    {
        console.log("My session id is: " + this.userSessionID);

        const {client_secret, client_id, redirect_uris} = this.globalCredentials.installed; // 'installed' name in  json file
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(accessCode, (err: any, token: { access_token: string; }) => {
                if (err) return console.error('Error retrieving access token', err);

                console.log("access token: " + token.access_token);
                oAuth2Client.setCredentials(token);

                const gAPI = new GoogleApiFunctions(this.userSessionID);
                gAPI.storeAccessCredentials(new AuthClientObjectWrapper(oAuth2Client, this.userSessionID), authArr); // Stores access credentials in array

                resolve({text: 'access code successfully set'});

            });
        })
    }


    getCollections(authArr: AuthClientObjectWrapper[])
    {
        const collectionsSkeleton = '{"collectionNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
        const obj = JSON.parse(collectionsSkeleton);
        return new Promise((success, failure) => {
            const gAPI = new GoogleApiFunctions(this.userSessionID);
            const tempAccT = gAPI.retrieveAccessCredentials(authArr);
            const auth = tempAccT.auth;

            const drive = google.drive({version: 'v3', auth});
            drive.files.list({
                q: "mimeType='application/json'",
                spaces: 'drive',
                pageSize: 20,
                fields: 'nextPageToken, files(id, name)',
            }, (err, driveRes) => {
                if (err) return console.log('The API returned an error: ' + err);
                const files = driveRes.data.files;
                if (files.length) {
                    files.forEach((file) =>
                    {
                        // console.log('Found File: ', file.name, file.id);
                        obj.collectionNames.push(file.name);
                    });
                    console.log(obj);
                    // res.end(obj);
                    success(obj);

                } else {
                    console.log('No files found.');
                    failure(obj);
                }
            });
        }).then( data => {
            console.log(data);
            return data;
        })
    }

    listMotifs(authArr: AuthClientObjectWrapper[])
    {
        const gAPI = new GoogleApiFunctions(this.userSessionID);
        const tempAccT = gAPI.retrieveAccessCredentials(authArr);
        const auth = tempAccT.auth;

        // const motifSkeleton = '{"motifNames": []}'; // create a "skeleton" JSON object into which all the other json object names will be placed in
        const motifDetails = JSON.parse('{"motifNames": []}');

        return new Promise((resolve, reject) => {
            const drive = google.drive({version: 'v3', auth});
            drive.files.list({
                q: "mimeType='image/svg+xml'",
                spaces: 'drive',
                pageSize: 10,
                fields: 'nextPageToken, files(id, name)',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const files = res.data.files;
                if (files.length) {

                    console.log('Files:');
                    files.map((file) => {
                        console.log(`${file.name} (${file.id})`);
                        const motifContainer = JSON.parse('{"motifName": "","motifID": "", "motifLink": ""}')
                        motifContainer.motifName = file.name;
                        motifContainer.motifID = file.id;
                        // obj.motifNames.push(file.id);
                        motifDetails.motifNames.push(motifContainer);
                    });
                    console.log(motifDetails);
                    resolve(motifDetails);

                } else {
                    reject({text: "something went wrong with fetching motifs"});
                    console.log('No files found.');
                }
            });
        })
    }

    setPermissions(authArr: AuthClientObjectWrapper[], motifContainer: any)
    {
        // const promiseArr: Promise<any>[] = [];

        const gAPI = new GoogleApiFunctions(this.userSessionID);
        const tempAccT = gAPI.retrieveAccessCredentials(authArr);
        const auth = tempAccT.auth;

        // let test;
        try {

            console.log("the motif ID is: " + motifContainer.motifID);
            const drive = google.drive({version: 'v3', auth});
            return drive.permissions.create({
                fileId: motifContainer.motifID,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            }).then(permissionSuccess => {
                console.log(permissionSuccess)
            }).catch(permissionFailure => {
                console.log(permissionFailure)
            })
            // console.log("the test is: " + test)
        } catch (error) {
            console.log(error.message)

        }
    }

    getPublicURLs(authArr: AuthClientObjectWrapper[], motifDetails: any)
    {
        const permissionPromiseArray: Promise<any>[] = []
        for(const elem in motifDetails.motifNames)
        {
            if (elem)
            {
                const permissionPromise = this.setPermissions(authArr, motifDetails.motifNames[elem]);
                permissionPromiseArray.push(permissionPromise);
                console.log(motifDetails.motifNames[elem]);
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
        console.log(permissionPromiseArray);
    }


}

