export default {
  auth: {
    clientId: "24112e46-462c-4ea7-9fb9-dfe0779d96f5",
    authority: "https://login.microsoftonline.com/common/",
    redirectUri: "http://localhost:8080",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
}