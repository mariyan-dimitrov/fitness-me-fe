import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import GlobalContextProvider from "./components/contexts/GlobalContext";
import CookieContextProvider from "./components/contexts/CookieContext";
import ThemeContextProvider from "./components/contexts/ThemeContext";
import Router from "./components/pages/Router";

import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <BrowserRouter>
    <CookieContextProvider>
      <GlobalContextProvider>
        <ThemeContextProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
          />

          <Router />
        </ThemeContextProvider>
      </GlobalContextProvider>
    </CookieContextProvider>
  </BrowserRouter>
);

export default App;
