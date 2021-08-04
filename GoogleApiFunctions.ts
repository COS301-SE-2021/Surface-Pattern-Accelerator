import {AuthClientObjectWrapper} from './AuthClientObjectWrapper'

export class GoogleApiFunctions {

    userSessionID: string;
    constructor(sessID: string) {
        this.userSessionID = sessID;
        console.log("g api created");
    }

    printSomething()
    {
        console.log("print something to test multiple files");
    }

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



}

