import { AppBar, Toolbar, Button, IconButton, Typography } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import styled from "styled-components/macro";
import cn from "classnames";

import { useGlobalContext } from "../contexts/GlobalContext";
import usePageNameFromUrl from "../hooks/usePageNameFromUrl";
import AvatarPopover from "./AvatarPopover";
import useRouter from "../hooks/useRouter";
import useRoutes from "../hooks/useRoutes";

const Header = () => {
  const { isMenuOpened, isHeaderButtonActionDisabled, updateGlobalState } = useGlobalContext();
  const { location, pushRoute, updateQuery } = useRouter();
  const { routes } = useRoutes();
  const { pathname } = location;
  const routeData = routes[pathname.replace("/", "")];
  const hasCreateButton = routeData?.create;

  return (
    <CustomAppBar position="fixed">
      <CustomToolbar>
        <MenuButtonWrap>
          <IconButton
            title={isMenuOpened ? "Close menu" : "Open menu"}
            color="inherit"
            aria-label="open drawer"
            onClick={() => updateGlobalState({ isMenuOpened: !isMenuOpened })}
            edge="start"
          >
            <MenuIcon
              className={cn("menu-icon", { opened: isMenuOpened, closed: !isMenuOpened })}
            />
          </IconButton>
        </MenuButtonWrap>
        <PageName className={cn({ "with-button": hasCreateButton, expanded: isMenuOpened })}>
          <Typography variant="h6" noWrap>
            {usePageNameFromUrl()}
          </Typography>
        </PageName>

        {hasCreateButton && (
          <CreateButtonWrap>
            <Button
              color="primary"
              variant="contained"
              className="bo-create-asset"
              disabled={isHeaderButtonActionDisabled}
              onClick={() => {
                hasCreateButton.query
                  ? updateQuery(hasCreateButton.query)
                  : pushRoute(hasCreateButton.url);
              }}
            >
              {hasCreateButton.name}
            </Button>
            {routeData.description && <Description>{routeData.description}</Description>}
          </CreateButtonWrap>
        )}

        <AvatarPopover />
      </CustomToolbar>
    </CustomAppBar>
  );
};

export default Header;

const CustomAppBar = styled(AppBar)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1} !important;
  transition: ${({ theme }) => theme.transitions.create(["width", "margin"])};
  padding-left: 0;
`;

const CustomToolbar = styled(Toolbar)`
  padding-left: 0 !important;
`;

const PageName = styled.div`
  margin-left: ${({ theme }) => theme.spacing(2)}px;

  &.expanded {
    min-width: 168px;
  }

  &.with-button {
    padding-right: ${({ theme }) => theme.spacing(2.5)}px;
    border-right: ${({ theme }) => `1px solid ${theme.palette.primary.light}`};
  }
`;

const MenuButtonWrap = styled.div`
  padding-left: ${({ theme }) => theme.spacing(2.5)}px;

  .menu-icon {
    transition: transform 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;

    &.opened {
      transform: rotate(180deg);
    }
    &.closed {
      transform: rotate(0deg);
    }
  }
`;

const CreateButtonWrap = styled.div`
  margin-left: ${({ theme }) => theme.spacing(3)}px;

  .MuiButton-containedPrimary {
    color: ${({ theme }) => theme.palette.primary.main};
    background-color: #fff;

    .MuiButton-label {
      transition: ${({ theme }) => `color 250ms ${theme.transitions.easing.easeInOut}`};
    }

    &:hover {
      color: ${({ theme }) => theme.palette.primary.contrastText};
    }
  }
`;

const Description = styled.div`
  display: inline-block;
  margin: ${({ theme }) => `0px 0px 0px ${theme.spacing(2)}px}`};
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;
