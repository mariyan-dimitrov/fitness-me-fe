import { useCallback } from "react";
import axios from "axios";

import { useCookieContext } from "../contexts/CookieContext";
import { useGlobalContext } from "../contexts/GlobalContext";
import hostURL from "../../_constants/serverApiUrl";
import useRouter from "./useRouter";
import useRoutes from "./useRoutes";

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
          const { email } = payload;

          updateGlobalState({
            user: {
              email,
            },
          });

          setCookie("userToken", data);
          pushRoute(routes.homepage.url);
        })
        .catch(console.error),
    [pushRoute, routes.homepage.url, setCookie, updateGlobalState]
  );

  return login;
};

export default useLogin;
