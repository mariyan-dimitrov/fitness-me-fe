import { Switch, Route } from "react-router-dom";
import styled from "styled-components/macro";
// import { useHistory } from "react-router";
// import { useEffect } from "react";

// import { useGlobalContext } from "../contexts/GlobalContext";
import useRoutes from "../hooks/useRoutes";
import Header from "../common/Header";
import NotFound from "./NotFound";
import Homepage from "./Homepage";
import Menu from "../common/Menu";
import Weight from "./Weight";
import Foods from "./Foods";
import Meal from "./Meal";

const PrivateRouteWrapper = () => {
  // const { user } = useGlobalContext();
  const { routes } = useRoutes();
  // const history = useHistory();

  // useEffect(() => {
  //   !user && history.replace(routes.login.url);
  // }, [history, user, routes]);

  // if (!user) {
  //   return null;
  // }

  return (
    <PageWrap>
      <Header />
      <Menu />

      <InnerPageWrap>
        <Switch>
          <Route exact path={routes.homepage.url}>
            <Homepage />
          </Route>

          <Route exact path={routes.foods.url}>
            <Foods />
          </Route>

          <Route exact path={routes.meal.url}>
            <Meal />
          </Route>

          <Route exact path={routes.weight.url}>
            <Weight />
          </Route>

          <Route>
            <NotFound />
          </Route>
        </Switch>
      </InnerPageWrap>
    </PageWrap>
  );
};

export default PrivateRouteWrapper;

const PageWrap = styled.div`
  display: flex;
  padding-top: 64px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const InnerPageWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`;
