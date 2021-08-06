import {OAuth2Client} from "google-auth-library";

export class AuthClientObjectWrapper {
    public auth: OAuth2Client;
    public sessionID: string;

    constructor(authCred: OAuth2Client, sessID: string) {
        this.auth = authCred;
        this.sessionID = sessID;

    }

}
