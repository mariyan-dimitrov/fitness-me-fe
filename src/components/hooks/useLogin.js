import { useCallback } from "react";
import axios from "axios";

import { useCookieContext } from "../contexts/CookieContext";
import { useGlobalContext } from "../contexts/GlobalContext";
import hostURL from "../../_constants/serverApiUrl";
import useRouter from "./useRouter";
import useRoutes from "./useRoutes";
import session_storage from "../../utils/session_storage";

const useLogin = () => {
  const { updateGlobalState } = useGlobalContext();
  const { setCookie } = useCookieContext();
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

          rememberMe && setCookie("userToken", data);
          !rememberMe && session_storage.set("userToken", data);

          updateGlobalState({
            user: {
              email,
            },
          });
          pushRoute(routes.homepage.url);
        })
        .catch(console.error),
    [pushRoute, routes.homepage.url, setCookie, updateGlobalState]
  );

  return login;
};

export default useLogin;
