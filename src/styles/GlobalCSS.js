import React from "react";
import { Normalize } from "styled-normalize";
import { createGlobalStyle } from "styled-components/macro";

const GlobalStyle = createGlobalStyle`
  html {
    overflow-y: scroll;
    overflow-x: hidden;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  * {
    scrollbar-color: #9e9e9e;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: #e6e6e6;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9e9e9e;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #9e9e9e;
    }

    .MuiTooltip-popper {
      svg {
        width: 12px;
        height: 12px;
      }
    }

    .MuiPopover-root {
      &.table-actions-menu {
        .MuiPopover-paper {
          min-width: 105px;
        }
      }
    }
  }

  input,
  .MuiInputBase-input {
    box-shadow: 0 0 0px 1000px transparent inset;
    transition: background-color 5000s ease-in-out 0s, border-color 0.3s ease;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(359deg); }
  }

  @keyframes pulsate {
    0%   { opacity: 0; }
    50%   { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes tableHighlight {
    0%   { opacity: 0; }
    50%   { opacity: 0.4; }
    100% { opacity: 0; }
  }
`;

const GlobalCSS = props => (
  <>
    <Normalize />
    <GlobalStyle {...props} />
  </>
);

export default GlobalCSS;
