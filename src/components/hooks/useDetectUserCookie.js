import { useEffect } from "react";
import jwt_decode from "jwt-decode";

import { useGlobalContext } from "../contexts/GlobalContext";
import { useCookieContext } from "../contexts/CookieContext";
import session_storage from "../../utils/session_storage";
import useLogout from "./useLogout";

const useDetectUserCookie = () => {
  const { cookies } = useCookieContext();
  const { user } = useGlobalContext();
  const logout = useLogout();

  const token = session_storage.get("userToken") || cookies.userToken;

  useEffect(() => {
    if (token) {
      const { exp } = jwt_decode(token);
      const today = Date.now();
      const expiryDateToken = exp * 1000;

      today > expiryDateToken && logout();
    }
  }, [token, logout]);

  useEffect(() => {
    !token && user && logout();
  }, [token, user, logout]);
};

export default useDetectUserCookie;
