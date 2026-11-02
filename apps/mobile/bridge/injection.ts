import { Platform } from 'react-native';

export const bridge = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
} as const;

export type Bridge = typeof bridge;

/** 네이티브가 측정한 safe area inset(px). 웹이 하단 인디케이터/상태바 영역을 피해 레이아웃을 잡을 때 사용한다. */
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

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
 * - __BRIDGE__: 플랫폼 정보 + safeAreaInsets
 * - --safe-area-inset-*: 네이티브 inset을 CSS 변수로 노출. 웹뷰는 safe area 밖(홈 인디케이터 아래)까지
 *   그려지므로, 웹이 env(safe-area-inset-*) 대신 이 값을 쓰면 iOS/Android 모두 동일하게 동작한다.
 * - __lokitBridge: 네이티브 응답을 받는 디스패처. requestId 기준으로 등록된 콜백을 호출한다.
 * - __LOKIT_DEEPLINK__: Universal Links / App Links로 진입한 경우의 URL
 *   (resolveLoginReferrer가 페이지 useEffect 시점에 읽으므로 페이지 코드 전에 set 되어야 함)
 */
export const buildBridgeInjection = (
  deeplinkUrl?: string | null,
  safeAreaInsets: SafeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 },
) => {
  const deeplinkAssign = deeplinkUrl
    ? `window.__LOKIT_DEEPLINK__ = ${JSON.stringify(deeplinkUrl)};`
    : '';
  const insets = {
    top: Math.round(safeAreaInsets.top),
    bottom: Math.round(safeAreaInsets.bottom),
    left: Math.round(safeAreaInsets.left),
    right: Math.round(safeAreaInsets.right),
  };
  const safeAreaCssVars = (Object.keys(insets) as (keyof typeof insets)[])
    .map(
      edge =>
        `document.documentElement.style.setProperty('--safe-area-inset-${edge}', '${insets[edge]}px');`,
    )
    .join('\n    ');
  return `
    window.__BRIDGE__ = ${JSON.stringify({ ...bridge, safeAreaInsets: insets })};
    ${safeAreaCssVars}
    ${dispatcherScript}
    ${deeplinkAssign}
    true;
  `;
};
