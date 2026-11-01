import { useSyncExternalStore } from 'react';
import { checkIsDevHost } from '@/utils/environment';

const subscribe = () => () => {};
const getServerSnapshot = () => false;

export const useIsDevHost = () =>
  useSyncExternalStore(subscribe, checkIsDevHost, getServerSnapshot);
