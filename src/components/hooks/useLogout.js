import { useCallback } from "react";
import axios from "axios";

import { useCookieContext } from "../contexts/CookieContext";
import { useGlobalContext } from "../contexts/GlobalContext";
import hostURL from "../../_constants/serverApiUrl";

const useLogout = () => {
  const { updateGlobalState } = useGlobalContext();
  const { removeCookie } = useCookieContext();

  const logout = useCallback(
    callback => {
      updateGlobalState({ user: false });
      removeCookie("userToken");

      axios({
        method: "post",
        url: `${hostURL}/logout`,
      }).then(() => callback && callback());
    },
    [removeCookie, updateGlobalState]
  );

  return logout;
};

export default useLogout;
