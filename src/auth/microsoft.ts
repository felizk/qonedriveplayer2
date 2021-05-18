import msalconfig from './msalconfig'
import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser'
import { Client } from '@microsoft/microsoft-graph-client'

export class Microsoft
{
    constructor() {
        this.msal = new PublicClientApplication(msalconfig);
        this.graph = Client.initWithMiddleware({ authProvider: this.authProvider });
    }

    public readonly msal : PublicClientApplication;
    public readonly graph : Client;

    public logOut()
    {
        return this.msal.logoutPopup({account: this.msal.getActiveAccount()});
    }

    get isLoggedIn() {
        return !!this.msal.getActiveAccount();
     };

    private authProvider = 
    {
        getAccessToken: async () => {
            // Call getToken in auth.js
            return await (await this.msal.acquireTokenSilent({scopes: ["user.read"]})).accessToken;
        }
    };

    public static getInstance() {
        return this.instance;
    }

    private static instance = new Microsoft();
}