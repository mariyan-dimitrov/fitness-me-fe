import { ThemeProvider as StyleComponentThemeProvider } from "styled-components/macro";
import { ThemeProvider } from "@material-ui/core/styles";
import { Switch, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";

import { useThemeContext } from "../contexts/ThemeContext";
import PublicRouteWrapper from "./PublicRouteWrapper";
import NotFound from "./NotFound/NotFound";
import useRoutes from "../hooks/useRoutes";
import Header from "../common/Header";

const Router = () => {
  const { muiTheme } = useThemeContext();
  const routes = useRoutes();

  return (
    <StyleComponentThemeProvider theme={muiTheme}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />

        <Header />

        <Switch>
          <Route exact path={[routes.homepage, routes.login, routes.register]}>
            <PublicRouteWrapper />
          </Route>

          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </ThemeProvider>
    </StyleComponentThemeProvider>
  );
};

export default Router;
