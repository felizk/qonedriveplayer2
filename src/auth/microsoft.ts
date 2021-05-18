import msalconfig from './msalconfig';

import {
  PublicClientApplication,
  AuthenticationResult
} from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { InjectionKey } from '@vue/composition-api';
import { injectStrict } from 'src/compositionHelpers';

export class Microsoft {
  constructor() {
    this.msal = new PublicClientApplication(msalconfig);
    this.graph = Client.initWithMiddleware({ authProvider: this.authProvider });
  }

  public readonly msal: PublicClientApplication;
  public readonly graph: Client;

  public trySilentLogin(): boolean {
    const savedUserName = sessionStorage['msalUser'] as string | undefined;
    if (!savedUserName) {
      return false;
    }

    const account = this.msal.getAccountByUsername(savedUserName);
    if (!account) {
      return false;
    }

    this.msal.setActiveAccount(account);
    return true;
  }

  public async loginPopup() {
    return this.msal
      .loginPopup({ scopes: msalconfig.scopes })
      .then(resp => this.handleResponse(resp));
  }

  public async tryGetToken(): Promise<string> {
    return (
      await this.msal.acquireTokenSilent({
        scopes: msalconfig.scopes
      })
    ).accessToken;
  }

  public logOut() {
    return this.msal.logoutPopup({ account: this.msal.getActiveAccount() });
  }

  get isLoggedIn() {
    return !!this.msal.getActiveAccount() || this.trySilentLogin();
  }

  private authProvider = {
    getAccessToken: () => this.tryGetToken()
  };

  private handleResponse(resp: AuthenticationResult) {
    sessionStorage.setItem('msalUser', resp.account?.username ?? '');
    this.msal.setActiveAccount(resp.account);
  }
}

export const MicrosoftKey: InjectionKey<Microsoft> = Symbol('Microsoft');
export function injectMicrosoft() {
  return injectStrict(MicrosoftKey);
}
