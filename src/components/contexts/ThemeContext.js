import React, { createContext, useContext, useState, useEffect } from "react";
import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import {
  red,
  blue,
  green,
  lightGreen,
  purple,
  pink,
  cyan,
  amber,
  orange,
} from "@material-ui/core/colors";

import local_storage from "../../utils/local_storage";

const initialThemeState = local_storage.get("theme") || "light";
const initialThemeColorState = local_storage.get("theme-color") || "blue";
const ThemeContext = createContext(initialThemeState);

export const useThemeContext = () => useContext(ThemeContext);

const themeColors = {
  blue: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[800],
    },
    secondary: {
      light: cyan.A200,
      main: cyan.A400,
      dark: cyan.A700,
      contrastText: "rgba(255, 255, 255, 0.5)",
    },
  },
  orange: {
    primary: {
      light: amber[500],
      main: amber[600],
      dark: amber[900],
    },
    secondary: {
      light: orange[700],
      main: orange[900],
      dark: orange[900],
      contrastText: "rgba(0, 0, 0, 0.5)",
    },
  },
  purple: {
    primary: {
      light: purple[500],
      main: purple[600],
      dark: purple[900],
    },
    secondary: {
      light: pink[700],
      main: pink[900],
      dark: pink[900],
      contrastText: "rgba(0, 0, 0, 0.5)",
    },
  },
  green: {
    primary: {
      light: lightGreen[500],
      main: lightGreen[600],
      dark: lightGreen[900],
    },
    secondary: {
      light: amber[700],
      main: amber[900],
      dark: amber[900],
      contrastText: "rgba(0, 0, 0, 0.5)",
    },
  },
};

const commonThemeColors = {
  error: {
    light: red[300],
    main: red[500],
    dark: red[800],
  },
  success: {
    light: green[300],
    main: green[500],
    dark: green[800],
  },
  warning: {
    light: orange[300],
    main: orange[500],
    dark: orange[800],
  },
  redButtonOutline: {
    color: red[300],
    border: red[300],
    backgroundHover: red[50],
  },
};

const themes = {
  light: {},
  dark: {
    redButtonOutline: {
      color: red[300],
      border: red[300],
      backgroundHover: "rgba(0,0,0,0.1)",
    },
  },
};

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(initialThemeState);
  const [themeColor, setThemeColor] = useState(initialThemeColorState);
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));

  const muiTheme = createMuiTheme({
    typography: {
      fontSize: 13,
    },
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: "0.95em",
        },
      },
    },
    palette: {
      type: theme,
      ...themeColors,
      ...themeColors[themeColor],
      ...commonThemeColors,
      ...themes[theme],
    },
  });

  useEffect(() => {
    local_storage.set("theme", theme);
  }, [theme]);

  useEffect(() => {
    local_storage.set("theme-color", themeColor);
  }, [themeColor]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeColor,
        muiTheme,
        availableColors: Object.keys(themeColors),
        toggleTheme,
        setThemeColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
