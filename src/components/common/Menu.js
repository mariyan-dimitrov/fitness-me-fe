import { Fastfood as FastFoodIcon } from "@material-ui/icons";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import KitchenIcon from "@material-ui/icons/Kitchen";
import { useEffect, useState, useRef } from "react";
import ListItem from "@material-ui/core/ListItem";
import styled from "styled-components/macro";
import cn from "classnames";

import { useGlobalContext } from "../contexts/GlobalContext";
import usePageNameFromUrl from "../hooks/usePageNameFromUrl";
import useRoutes from "../hooks/useRoutes";
import useRouter from "../hooks/useRouter";
import hexToRgb from "../../utils/hexToRgb";

const menuItems = [
  {
    pageName: "weight",
    Icon: AccessibilityIcon,
  },
  {
    pageName: "meal",
    Icon: FastFoodIcon,
  },
  {
    pageName: "foods",
    Icon: KitchenIcon,
  },
];

const Menu = () => {
  const { isMenuOpened } = useGlobalContext();
  const [skipAnimation, setSkipAnimation] = useState(true);
  const currentPageName = usePageNameFromUrl();
  const { pushRoute } = useRouter();
  const { routes } = useRoutes();
  const lastMenuOpenState = useRef(isMenuOpened);

  useEffect(() => {
    skipAnimation && lastMenuOpenState.current !== isMenuOpened && setSkipAnimation(false);
  }, [skipAnimation, isMenuOpened]);

  return (
    <Wrap
      className={cn({
        "skip-animation": skipAnimation,
        "is-menu-opened": isMenuOpened,
        "is-menu-closed": !isMenuOpened,
      })}
    >
      {menuItems.map(({ pageName, Icon }) => (
        <StyledListItem
          button
          onClick={() => pushRoute(routes[pageName].url)}
          className={cn({ "is-active": routes[pageName].name === currentPageName })}
          key={pageName}
        >
          <ListItemIcon>
            <IconWrap className="icon-wrap">
              <Icon />
            </IconWrap>
          </ListItemIcon>
          <ListItemText primary={routes[pageName].name} />
        </StyledListItem>
      ))}
    </Wrap>
  );
};

export default Menu;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadows[8]};
  overflow: hidden;
  height: 100%;
  width: 62px;

  &.is-menu-opened {
    width: 250px;
    animation: 0.5s open-menu ease;
  }

  &.is-menu-closed {
    animation: 0.5s close-menu ease;
    width: 62px;
  }

  &.skip-animation {
    animation: none !important;
  }

  @keyframes open-menu {
    0% {
      width: 62px;
    }

    100% {
      width: 250px;
    }
  }

  @keyframes close-menu {
    0% {
      width: 250px;
    }

    100% {
      width: 62px;
    }
  }
`;

const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(2.5)}px
    ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(1.5)}px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }

  &.is-active {
    background-color: ${({ theme }) => hexToRgb(theme.palette.primary.light, 0.3)};

    &:hover {
      background-color: ${({ theme }) => hexToRgb(theme.palette.primary.light, 0.42)};
    }

    .icon-wrap {
      background-color: ${({ theme }) => theme.palette.primary.light};
      color: ${({ theme }) => theme.palette.background.paper};
    }
  }
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing(2.5)}px;
  padding: ${({ theme }) => theme.spacing(1)}px;
  border-radius: 100px;
  color: ${({ theme }) => theme.palette.primary.light};
  box-shadow: ${({ theme }) => theme.shadows[5]};

  /* TODO: Remove from here */
  top: ${({ theme }) => console.log(theme)};
`;
