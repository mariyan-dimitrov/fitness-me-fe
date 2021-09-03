import { toast } from "react-toastify";
import { useCallback } from "react";
import axios from "axios";

import { useCookieContext } from "../contexts/CookieContext";
import { useGlobalContext } from "../contexts/GlobalContext";
import session_storage from "../../utils/session_storage";
import useHandleHttpError from "./useHandleHttpError";
import hostURL from "../../_constants/serverApiUrl";

const useLogout = () => {
  const { updateGlobalState } = useGlobalContext();
  const { removeCookie } = useCookieContext();
  const handleHttpError = useHandleHttpError();

  const logout = useCallback(
    callback => {
      updateGlobalState({ user: false });
      removeCookie("userToken");
      session_storage.remove("userToken");

      axios({
        method: "post",
        url: `${hostURL}/logout`,
      })
        .then(() => {
          toast.success("Goodbye!");
          callback && callback();
        })
        .catch(handleHttpError);
    },
    [removeCookie, handleHttpError, updateGlobalState]
  );

  return logout;
};

export default useLogout;
