import React, { useState, useRef } from "react";
import styled from "styled-components/macro";
import {
  Language as LanguageIcon,
  ColorLens as ColorLensIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Brightness2 as DarkIcon,
  WbSunny as LightIcon,
} from "@material-ui/icons";

import {
  ListItemText,
  ListItemIcon,
  RadioGroup,
  ListItem,
  Popover,
  Divider,
  Tooltip,
  Avatar,
  List,
  Grid,
} from "@material-ui/core";

import { useGlobalContext } from "../contexts/GlobalContext";
import { useThemeContext } from "../contexts/ThemeContext";
import useChangeLanguage from "../hooks/useChangeLanguage";
import useTranslate from "../hooks/useTranslate";
import useLogout from "../hooks/useLogout";
import Switch from "../forms/fields/Switch";
import Radio from "../forms/fields/Radio";

const AvatarPopover = () => {
  const { user, lang } = useGlobalContext();
  const { theme, themeColor, muiTheme, availableColors, toggleTheme, setThemeColor } =
    useThemeContext();
  const [showUserPopover, setShowUserPopover] = useState(true);
  const i18n = useTranslate();
  const logout = useLogout();
  const avatarRef = useRef();
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
            <SettingsIcon />
          </StyledAvatar>
        </AvatarWrap>
      )}

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

              <ListItem className="theme-colors-wrap">
                <ListItemIcon>
                  <LanguageIcon color="primary" />
                </ListItemIcon>

                <SwitchWrap>
                  <div>{i18n("LANGUAGES.BG")}</div>
                  <Switch
                    checked={lang === "en"}
                    onChange={() => changeLanguage(lang === "en" ? "bg" : "en")}
                  />
                  <div>{i18n("LANGUAGES.EN")}</div>
                </SwitchWrap>
              </ListItem>

              <Divider />

              <ListItem button onClick={() => logout()}>
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

const SwitchWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
