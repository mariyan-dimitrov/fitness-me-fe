import { useMemo } from "react";

import useTranslate from "./useTranslate";
import useRouter from "./useRouter";

const useRoutes = () => {
  const { location } = useRouter();
  const i18n = useTranslate();
  const { pathname } = location;

  const routes = {
    homepage: {
      url: "/",
      name: i18n("PAGE_NAMES.HOMEPAGE"),
    },
    login: {
      url: "/login",
      name: i18n("PAGE_NAMES.LOGIN"),
      singularName: i18n("PAGE_NAMES.LOGIN"),
    },
    register: {
      url: "/register",
      name: i18n("PAGE_NAMES.REGISTER"),
      singularName: i18n("PAGE_NAMES.REGISTER"),
    },
  };

  const stringifiedRoutes = JSON.stringify(routes);
  const memoizedRoutes = useMemo(() => JSON.parse(stringifiedRoutes), [stringifiedRoutes]);

  return {
    routes: memoizedRoutes,
    currentRoute: memoizedRoutes[pathname === "/" ? "root" : pathname.replace("/", "")],
  };
};

export default useRoutes;
