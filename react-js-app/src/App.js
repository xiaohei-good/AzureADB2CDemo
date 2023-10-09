import React, { useState } from 'react';
import './App.css';
import { Configuration } from '@azure/msal-browser';
import { b2cPolicies } from './authConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';
import TasksPage from './TasksPage';

// MSAL configuration
// 这里的Configuration类型引用自包@azure/msal-browser
const configuration = {
  auth: {
    clientId: '17024c18-bc26-494b-951d-a9f873a5a25b',
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: '/',
    postLogoutRedirectUri: '/',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage', // Configures cache location."sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};
const pca = new PublicClientApplication(configuration);
// Default to using the first account if no account is active on page load
if (!pca.getActiveAccount() && pca.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  pca.setActiveAccount(pca.getAllAccounts()[0]);
}
function App() {
  const [account, setAccount] = useState(pca.getActiveAccount());
  pca.addEventCallback((event) => {
    if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS) &&
      event.payload &&
      event.payload.account
    ) {
      pca.setActiveAccount(event.payload.account);
      setAccount(event.payload.account);
    }
  });
  return (
    // MsalProvider使我们可以在其包裹的所有组件中直接获取到相关上下文
    <MsalProvider instance={pca}>
      <TasksPage accountState={account} />
    </MsalProvider>
  );
}
export default App;
