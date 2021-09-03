import { useLocation, useHistory } from "react-router";
import { useCallback, useEffect } from "react";

import getSearchQueryFromObject from "../../utils/getSearchQueryFromObject";
import getObjFromSearchQuery from "../../utils/getObjFromSearchQuery";

let isRedirecting = false;

const useRouter = () => {
  const location = useLocation();
  const history = useHistory();
  const { pathname } = location;

  const pushRoute = useCallback(
    (route, params = {}) => {
      if (route.includes("?")) {
        params = getObjFromSearchQuery(route.split("?").pop());
        route = route.split("?").shift();
      }

      if (route && route !== pathname) {
        isRedirecting = route;

        history.push({
          pathname: route,
          search: getSearchQueryFromObject(params),
        });
      }
    },
    [history, pathname]
  );

  useEffect(() => {
    if (isRedirecting && isRedirecting === pathname) {
      isRedirecting = false;
    }
  }, [pathname]);

  return { pushRoute, location, history, pathname };
};

export default useRouter;
