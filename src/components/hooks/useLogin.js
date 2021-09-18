import { toast } from "react-toastify";
import { useCallback } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

import { useCookieContext } from "../contexts/CookieContext";
import { useGlobalContext } from "../contexts/GlobalContext";
import session_storage from "../../utils/session_storage";
import useHandleHttpError from "./useHandleHttpError";
import hostURL from "../../_constants/serverApiUrl";
import useRouter from "./useRouter";
import useRoutes from "./useRoutes";

const useLogin = () => {
  const { updateGlobalState } = useGlobalContext();
  const { setCookie } = useCookieContext();
  const handleHttpError = useHandleHttpError();
  const { pushRoute } = useRouter();
  const { routes } = useRoutes();

  const login = useCallback(
    payload =>
      axios({
        method: "post",
        url: `${hostURL}/login`,
        data: payload,
      })
        .then(({ data }) => {
          const { email, rememberMe } = payload;
          const { role } = jwt_decode(data);

          rememberMe && setCookie("userToken", data);
          !rememberMe && session_storage.set("userToken", data);

          updateGlobalState({
            user: {
              email,
              role,
            },
          });
          pushRoute(routes.homepage.url);
          toast.success(`Welcome!`);
        })
        .catch(handleHttpError),
    [pushRoute, handleHttpError, routes.homepage.url, setCookie, updateGlobalState]
  );

  return login;
};

export default useLogin;
