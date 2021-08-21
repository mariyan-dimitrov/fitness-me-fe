import { useHistory } from "react-router";
import { useEffect } from "react";

import { useGlobalContext } from "../contexts/GlobalContext";
import { routes } from "../../_constants/routes";

const PrivateRouteWrapper = () => {
  const { user } = useGlobalContext();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.replace(routes.login);
    }
  }, [history, user]);

  return null;
};

export default PrivateRouteWrapper;
