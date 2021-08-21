import { BrowserRouter } from "react-router-dom";

import GlobalContextProvider from "./components/contexts/GlobalContext";
import CookieContextProvider from "./components/contexts/CookieContext";
import ThemeContextProvider from "./components/contexts/ThemeContext";
import Router from "./components/pages/Router";

const App = () => (
  <BrowserRouter>
    <CookieContextProvider>
      <GlobalContextProvider>
        <ThemeContextProvider>
          <Router />
        </ThemeContextProvider>
      </GlobalContextProvider>
    </CookieContextProvider>
  </BrowserRouter>
);

export default App;
