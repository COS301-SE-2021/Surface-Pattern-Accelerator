import {OAuth2Client} from "google-auth-library";

export class AuthClientObjectWrapper {
    auth: OAuth2Client;
    sessionID: string;

    constructor(authCred: OAuth2Client, sessID: string) {
        this.auth = authCred;
        this.sessionID = sessID;

    }

}