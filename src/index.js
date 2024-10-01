import { createRoot } from "react-dom/client";

// third party
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "authConfig";

// project imports
import * as serviceWorker from "serviceWorker";
import App from "App";
import { store, persistor } from "store";

// style + assets
import "assets/scss/style.scss";
import config from "./config";

// ==============================|| REACT DOM RENDER  ||============================== //

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript

// MSAL instantiated outside the component to prevent it from begin re-instantiated on re-render
const msalInstance = new PublicClientApplication(msalConfig);

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents();

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    console.log(event);
    msalInstance.setActiveAccount(event.payload.account);
  }
});

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter basename={config.basename}>
      <App msalInstance={msalInstance} />
    </BrowserRouter>
    </PersistGate>
  </Provider>
);

// If you want your app to wor k offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
