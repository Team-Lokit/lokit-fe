import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () =>
  window.__BRIDGE__?.isIOS === true || window.__BRIDGE__?.isAndroid === true;
const getServerSnapshot = () => false;

export const useIsWebView = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
