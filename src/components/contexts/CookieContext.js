import React, { useState, useContext, createContext } from "react";
import Cookies from "js-cookie";

const CookieContext = createContext(Cookies.get());

export const useCookieContext = () => useContext(CookieContext);

const CookieContextProvider = ({ children }) => {
  const [cookies, setCookies] = useState(Cookies.get());

  const setCookie = (name, value, options) => {
    Cookies.set(name, value, options);
    setCookies(Cookies.get());
  };

  const removeCookie = name => {
    Cookies.remove(name);
    setCookies(Cookies.get());
  };

  return (
    <CookieContext.Provider value={{ cookies, setCookie, removeCookie }}>
      {children}
    </CookieContext.Provider>
  );
};

export default CookieContextProvider;
