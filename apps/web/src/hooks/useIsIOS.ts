import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => window.__BRIDGE__?.isIOS === true;
const getServerSnapshot = () => false;

export const useIsIOS = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
