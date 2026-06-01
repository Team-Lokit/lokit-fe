import type { RefObject } from 'react';
import type WebView from 'react-native-webview';
import type { BridgeResponse } from '@repo/webview-bridge';

/**
 * 네이티브 -> 웹 응답 전송.
 * postMessage가 아닌 디스패처 직접 호출로 보내야 다른 message 리스너와 충돌 없음.
 */
export function sendResponse(
  webViewRef: RefObject<WebView | null>,
  response: BridgeResponse,
) {
  const payload = JSON.stringify(response);
  webViewRef.current?.injectJavaScript(`
    window.__lokitBridge && window.__lokitBridge.onResponse && window.__lokitBridge.onResponse(${payload});
    true;
  `);
}
