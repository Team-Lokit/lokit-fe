import { Platform } from 'react-native';

export const bridge = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
} as const;

export type Bridge = typeof bridge;

/**
 * requestId -> 콜백 매핑을 보관하고, 네이티브 응답을 매칭된 콜백으로 라우팅한다.
 * - register: 웹이 요청 전에 콜백 등록
 * - onResponse: 네이티브가 injectJavaScript로 호출
 */
const dispatcherScript = `
  (() => {
    const handlers = new Map();
    window.__lokitBridge = {
      register: (requestId, cb) => { handlers.set(requestId, cb); },
      onResponse: (response) => {
        if (!response || !response.requestId) return;
        const cb = handlers.get(response.requestId);
        if (!cb) return;
        handlers.delete(response.requestId);
        cb(response);
      },
    };
  })();
`;

/**
 * WebView 로드 전 주입할 스니펫.
 * - __BRIDGE__: 플랫폼 정보
 * - __lokitBridge: 네이티브 응답을 받는 디스패처. requestId 기준으로 등록된 콜백을 호출한다.
 * - __LOKIT_DEEPLINK__: Universal Links / App Links로 진입한 경우의 URL
 *   (resolveLoginReferrer가 페이지 useEffect 시점에 읽으므로 페이지 코드 전에 set 되어야 함)
 */
export const buildBridgeInjection = (deeplinkUrl?: string | null) => {
  const deeplinkAssign = deeplinkUrl
    ? `window.__LOKIT_DEEPLINK__ = ${JSON.stringify(deeplinkUrl)};`
    : '';
  return `
    window.__BRIDGE__ = ${JSON.stringify(bridge)};
    ${dispatcherScript}
    ${deeplinkAssign}
    true;
  `;
};
