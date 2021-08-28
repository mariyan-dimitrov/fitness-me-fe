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
  background-image: url("https://i.pinimg.com/originals/61/2b/13/612b13db13eeb7bcd42e24631aa9cd61.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 100% 0;
`;
