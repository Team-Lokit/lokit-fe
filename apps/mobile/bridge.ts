import { Platform } from 'react-native';

export const bridge = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
} as const;

export type Bridge = typeof bridge;

/**
 * WebView 로드 전 주입할 스니펫.
 * - __BRIDGE__: 플랫폼 정보
 * - __LOKIT_DEEPLINK__: Universal Links / App Links로 진입한 경우의 URL
 *   (resolveLoginReferrer가 페이지 useEffect 시점에 읽으므로 페이지 코드 전에 set 되어야 함)
 */
export const buildBridgeInjection = (deeplinkUrl?: string | null) => {
  const deeplinkAssign = deeplinkUrl
    ? `window.__LOKIT_DEEPLINK__ = ${JSON.stringify(deeplinkUrl)};`
    : '';
  return `
    window.__BRIDGE__ = ${JSON.stringify(bridge)};
    ${deeplinkAssign}
    true;
  `;
};
