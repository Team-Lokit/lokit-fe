import { Platform } from 'react-native';

export const bridge = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
} as const;

export type Bridge = typeof bridge;

export const buildBridgeInjection = () => `
  window.__BRIDGE__ = ${JSON.stringify(bridge)};
  true;
`;
