import { useCallback, useEffect } from "react";
import { useLocation, useHistory } from "react-router";

import getSearchQueryFromObject from "../../utils/getSearchQueryFromObject";
import getObjFromSearchQuery from "../../utils/getObjFromSearchQuery";

let isRedirecting = false;

const useRouter = () => {
  const location = useLocation();
  const history = useHistory();
  const { pathname, search } = location;

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

  const replaceRoute = useCallback(
    (route, params = {}) => {
      if (route.includes("?")) {
        params = getObjFromSearchQuery(route.split("?").pop());
        route = route.split("?").shift();
      }

      if (route && route !== pathname) {
        isRedirecting = route;

        history.replace({
          pathname: route,
          search: getSearchQueryFromObject(params),
        });
      }
    },
    [history, pathname]
  );

  const updateQuery = useCallback(
    (params = {}) => {
      const queryObj = { ...getObjFromSearchQuery(search) };
      let queryString = "";

      for (let key in params) {
        let value = params[key];

        if (value === Object(value)) {
          value = JSON.stringify(value);
        }

        queryObj[key] = value;
      }

      queryString = getSearchQueryFromObject(queryObj);

      if (queryString !== search && !isRedirecting) {
        history.push({
          pathname,
          search: queryString,
        });
      }
    },
    [history, pathname, search]
  );

  useEffect(() => {
    if (isRedirecting && isRedirecting === pathname) {
      isRedirecting = false;
    }
  }, [pathname]);

  return { updateQuery, replaceRoute, pushRoute, location, history, pathname };
};

export default useRouter;
