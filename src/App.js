import { BrowserRouter } from "react-router-dom";

import GlobalContextProvider from "./components/contexts/GlobalContext";
import CookieContextProvider from "./components/contexts/CookieContext";
import ThemeContextProvider from "./components/contexts/ThemeContext";
import Router from "./components/pages/Router";
import GlobalCSS from "./styles/GlobalCSS";

const App = () => {
  return (
    <>
      <GlobalCSS />

      <CookieContextProvider>
        <GlobalContextProvider>
          <ThemeContextProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </ThemeContextProvider>
        </GlobalContextProvider>
      </CookieContextProvider>
    </>
  );
};

export default App;
