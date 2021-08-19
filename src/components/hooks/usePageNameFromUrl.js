import { useLocation } from "react-router-dom";

import useRoutes from "./useRoutes";

const usePageNameFromUrl = () => {
  const { pathname } = useLocation();
  const { routes } = useRoutes();

  const [path, subPath] = pathname.replace("/", "").split("/");
  const result = subPath ? routes[path][subPath] : routes[path] || routes.root;

  return result?.name;
};

export default usePageNameFromUrl;
