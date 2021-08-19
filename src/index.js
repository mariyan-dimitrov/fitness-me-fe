import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import i18next from "i18next";

import App from "./App";

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: false,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      crossDomain: true,
      loadPath: `${window.location.origin}/locales/{{lng}}/translation.json`,
    },
  });

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
