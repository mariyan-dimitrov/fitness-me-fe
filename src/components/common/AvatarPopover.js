import React, { useState, useRef } from "react";
import styled from "styled-components/macro";
import {
  WbSunny as LightIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Brightness2 as DarkIcon,
  ColorLens as ColorLensIcon,
} from "@material-ui/icons";
import {
  Avatar,
  Popover,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Divider,
  RadioGroup,
} from "@material-ui/core";

import { useGlobalContext } from "../contexts/GlobalContext";
import { useCookieContext } from "../contexts/CookieContext";
import { useThemeContext } from "../contexts/ThemeContext";
import useTranslate from "../hooks/useTranslate";
import Radio from "../forms/fields/Radio";
import Switch from "../forms/fields/Switch";
import useChangeLanguage from "../hooks/useChangeLanguage";

const AvatarPopover = () => {
  const { removeCookie } = useCookieContext();
  const { user, lang } = useGlobalContext();
  const { theme, themeColor, muiTheme, availableColors, toggleTheme, setThemeColor } =
    useThemeContext();
  const [showUserPopover, setShowUserPopover] = useState(false);
  const avatarRef = useRef();
  const i18n = useTranslate();
  const togglePopover = () => setShowUserPopover(prev => !prev);
  const changeLanguage = useChangeLanguage();

  return (
    <Wrap>
      {user && (
        <AvatarWrap>
          <Tooltip title={`Permission Role: ${user.role}`} placement="left" arrow>
            <UserName>{user.email}</UserName>
          </Tooltip>
          <StyledAvatar onClick={() => setShowUserPopover(true)} ref={avatarRef}>
            {user.email.slice(0, 2).toUpperCase()}
          </StyledAvatar>
        </AvatarWrap>
      )}

      <ListItem button onClick={toggleTheme}>
        <ListItemIcon>
          {theme === "dark" ? <LightIcon color="primary" /> : <DarkIcon color="primary" />}
        </ListItemIcon>
        <ListItemText primary={i18n("MAIN_MENU.TOGGLE_THEME")} />
      </ListItem>

      <Switch
        label="Lang"
        checked={lang === "en"}
        onChange={() => changeLanguage(lang === "en" ? "bg" : "en")}
      />

      <Popover
        id={showUserPopover ? "simple-popover" : undefined}
        open={showUserPopover}
        anchorEl={avatarRef.current}
        onClose={togglePopover}
        anchorOrigin={{
          vertical: 50,
          horizontal: "right",
        }}
      >
        <PopoverContent>
          <Grid item>
            <List dense>
              <ListItem
                button
                onClick={() => {
                  togglePopover();
                }}
              >
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={i18n("MAIN_MENU.EDIT_PROFILE")} />
              </ListItem>

              <Divider />

              <ListItem button onClick={toggleTheme}>
                <ListItemIcon>
                  {theme === "dark" ? <LightIcon color="primary" /> : <DarkIcon color="primary" />}
                </ListItemIcon>
                <ListItemText primary={i18n("MAIN_MENU.TOGGLE_THEME")} />
              </ListItem>

              <Divider />

              <ListItem className="theme-colors-wrap">
                <ListItemIcon>
                  <ColorLensIcon color="primary" />
                </ListItemIcon>

                <RadioGroup
                  name="theme-color"
                  value={themeColor}
                  onChange={e => setThemeColor(e.target.value)}
                >
                  {availableColors.map(color => (
                    <Tooltip title={color} arrow placement="top" key={color}>
                      <RadioWrap themeColor={muiTheme.palette[color].primary.light}>
                        <Radio value={color} />
                      </RadioWrap>
                    </Tooltip>
                  ))}
                </RadioGroup>
              </ListItem>

              <Divider />

              <ListItem button onClick={() => removeCookie("token")}>
                <ListItemIcon>
                  <LogoutIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={i18n("MAIN_MENU.LOGOUT")} />
              </ListItem>
            </List>
          </Grid>
        </PopoverContent>
      </Popover>
    </Wrap>
  );
};

export default AvatarPopover;

const Wrap = styled.div`
  margin-left: auto;
`;

const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.div`
  cursor: default;
  margin-right: ${({ theme }) => theme.spacing(2)}px;
`;

const StyledAvatar = styled(Avatar)`
  &.MuiAvatar-root {
    cursor: pointer;
    color: ${({ theme }) => theme.palette.primary.main};
    background-color: #fff;
  }
`;

const PopoverContent = styled.div`
  .MuiListItemIcon-root {
    min-width: auto;
    margin-right: ${({ theme }) => theme.spacing(1.5)}px;
  }

  .Mui-selected {
    cursor: default;
  }

  .theme-colors-wrap {
    .MuiFormGroup-root {
      flex-direction: row;
    }

    .MuiFormControlLabel-root {
      margin: 0;
    }

    .MuiRadio-root {
      padding: 0;
    }
  }
`;

const RadioWrap = styled.div`
  margin: 0 0 0 3px;

  &:first-child {
    margin-left: 0;
  }

  .MuiRadio-root,
  .MuiIconButton-colorSecondary,
  .MuiRadio-colorSecondary.Mui-checked {
    color: ${({ themeColor }) => themeColor};
  }
`;
