import { useCallback } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

import { useGlobalContext } from "../contexts/GlobalContext";
import { useCookieContext } from "../contexts/CookieContext";
import hostURL from "../../_constants/serverApiUrl";
import useRoutes from "./useRoutes";
import useRouter from "./useRouter";

const useRegister = () => {
  const { updateGlobalState } = useGlobalContext();
  const { setCookie } = useCookieContext();
  const { pushRoute } = useRouter();
  const { routes } = useRoutes();

  const register = useCallback(
    payload =>
      axios({
        method: "post",
        url: `${hostURL}/register`,
        data: payload,
      })
        .then(({ data }) => {
          const { role } = jwt_decode(data);

          updateGlobalState({
            user: {
              email: payload.email,
              role,
            },
          });

          setCookie("userToken", data);
          pushRoute(routes.homepage.url);
        })
        .catch(console.error),
    [pushRoute, routes.homepage.url, setCookie, updateGlobalState]
  );

  return register;
};

export default useRegister;
