import { useCallback, useContext, useState, createContext, useEffect } from "react";
import local_storage from "../../utils/local_storage";

const initialState = {
  isMenuOpened: true,
  user: false,
  lang: "en",
  ...(local_storage.get("globalContext") || {}),
};

const GlobalContext = createContext(initialState);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalContextProvider = ({ children }) => {
  const [globalState, setState] = useState(initialState);

  const updateGlobalState = useCallback(
    nextState => setState(prevState => ({ ...prevState, ...nextState })),
    []
  );

  useEffect(() => {
    local_storage.set("globalContext", globalState);
  }, [globalState]);

  return (
    <GlobalContext.Provider value={{ ...globalState, updateGlobalState }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
