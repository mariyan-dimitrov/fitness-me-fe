import { Switch, Route } from "react-router-dom";
import styled from "styled-components/macro";

import Homepage from "./Homepage/Homepage";
import useRoutes from "../hooks/useRoutes";
import Register from "./Register/Register";
import Login from "./Login/Login";

const PublicRouteWrapper = () => {
  const { routes } = useRoutes();

  return (
    <PageWrap>
      <Switch>
        <Route exact path={routes.homepage.url}>
          <Homepage />
        </Route>

        <Route path={routes.login.url}>
          <Login />
        </Route>

        <Route path={routes.register.url}>
          <Register />
        </Route>
      </Switch>
    </PageWrap>
  );
};
export default PublicRouteWrapper;

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 64px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
