import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!clientId) {
  // Helpful console message if the env var isn't wired up
  // (Make sure .env has REACT_APP_GOOGLE_CLIENT_ID and you restarted dev server)
  // eslint-disable-next-line no-console
  console.error(
    "[GoogleOAuthProvider] Missing REACT_APP_GOOGLE_CLIENT_ID. " +
    "Set it in your .env and restart the dev server."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || ""}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
