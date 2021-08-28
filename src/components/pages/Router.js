import { ThemeProvider as StyleComponentThemeProvider } from "styled-components/macro";
import { ThemeProvider } from "@material-ui/core/styles";
import { Switch, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";

import useDetectUserCookie from "../hooks/useDetectUserCookie";
import { useThemeContext } from "../contexts/ThemeContext";
import PrivateRouteWrapper from "./PrivateRouteWrapper";
import PublicRouteWrapper from "./PublicRouteWrapper";
import GlobalCSS from "../../styles/GlobalCSS";
import useRoutes from "../hooks/useRoutes";

const Router = () => {
  const { muiTheme } = useThemeContext();
  const { routes } = useRoutes();

  useDetectUserCookie();

  return (
    <StyleComponentThemeProvider theme={muiTheme}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <GlobalCSS />

        <Switch>
          <Route path={[routes.login.url, routes.register.url]}>
            <PublicRouteWrapper />
          </Route>

          <Route>
            <PrivateRouteWrapper />
          </Route>
        </Switch>
      </ThemeProvider>
    </StyleComponentThemeProvider>
  );
};

export default Router;
