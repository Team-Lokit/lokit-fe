import { css, Theme } from '@emotion/react';

export const globalStyles = (theme: Theme) => css`
  :root {
    --safe-area-inset-top: env(safe-area-inset-top, 0px);
    --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
    --safe-area-inset-left: env(safe-area-inset-left, 0px);
    --safe-area-inset-right: env(safe-area-inset-right, 0px);
  }

  body {
    background-color: ${theme.colors.grayScale[0]};
    color: ${theme.colors.text};
    font-family:
      var(--font-pretendard),
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      sans-serif;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    color-scheme: light;
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
    &:disabled {
      cursor: default;
    }
  }
`;
