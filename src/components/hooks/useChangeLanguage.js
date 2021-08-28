import { useCallback, useEffect } from "react";
import i18next from "i18next";

import { useGlobalContext } from "../contexts/GlobalContext";

const useChangeLanguage = () => {
  const { lang, updateGlobalState } = useGlobalContext();

  const changeLangugage = useCallback(
    lang => {
      updateGlobalState({ lang });
    },
    [updateGlobalState]
  );

  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);

  return changeLangugage;
};

export default useChangeLanguage;
