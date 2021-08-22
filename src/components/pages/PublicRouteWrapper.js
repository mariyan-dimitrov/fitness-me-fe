import { Switch, Route } from "react-router-dom";
import styled from "styled-components/macro";

import useRoutes from "../hooks/useRoutes";
import Register from "./Register";
import Login from "./Login";

const PublicRouteWrapper = () => {
  const { routes } = useRoutes();

  return (
    <PageWrap>
      <Switch>
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
  background-image: url("https://d18zdz9g6n5za7.cloudfront.net/home/home-masthead-20201031-1340.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 100% 0;
`;
