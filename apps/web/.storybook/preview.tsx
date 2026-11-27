import type { Decorator, Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import GlobalStyles from "../src/theme/globalStyles";
import { theme } from '../src/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { handlers } from '../src/mocks/handlers';
import './fonts.css';

initialize({ onUnhandledRequest: 'bypass' });


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const withGlobalStyle: Decorator = (Story) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <QueryClientProvider client={queryClient}>
    <Story />
    {/* PopupRoot(Modal 등)가 portal로 렌더링할 대상. 앱에서는 app/layout.tsx에 있음 */}
    <div id="modal-root" />
    </QueryClientProvider>
  </ThemeProvider>
);

const preview: Preview = {
  decorators: [withGlobalStyle],
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;
