import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { routes } from "../../_constants/routes";
import Homepage from "./Homepage/Homepage";
import Register from "./Register/Register";
import Login from "./Login/Login";

const PublicRouteWrapper = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={routes.homepage}>
          <Homepage />
        </Route>

        <Route exact path={routes.login}>
          <Login />
        </Route>
        <Route exact path={routes.register}>
          <Register />
        </Route>
      </Switch>
    </Router>
  );
};
export default PublicRouteWrapper;
