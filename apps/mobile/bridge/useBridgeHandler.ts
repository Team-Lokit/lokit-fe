import { useCallback } from 'react';
import type { RefObject } from 'react';
import type WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { BridgeRequest } from '@repo/webview-bridge';
import { bridgeHandlers } from './handlers';

/**
 * WebView onMessage 핸들러. 웹에서 보낸 BridgeRequest를 받아 등록된 네이티브 핸들러로 디스패치한다.
 * - 메시지 파싱과 디스패치만 담당. 실제 처리는 ./handlers 참조.
 */
export default function useBridgeHandler(webViewRef: RefObject<WebView | null>) {
  return useCallback(
    (event: WebViewMessageEvent) => {
      const raw = event.nativeEvent.data;
      let request: BridgeRequest;
      try {
        request = JSON.parse(raw);
      } catch {
        // 다른 곳(예: 분석 트래킹)에서 보낸 메시지일 수 있으므로 조용히 무시
        return;
      }

      if (!request || typeof request !== 'object' || !('type' in request)) {
        return;
      }

      // 디스패치 지점에서는 union 전체를 받는 시그니처로 캐스팅.
      // 호출자(request)가 union이라 개별 핸들러의 좁혀진 시그니처에 직접 매칭이 안 되기 때문.
      const handler = bridgeHandlers[request.type] as (
        webViewRef: RefObject<WebView | null>,
        request: BridgeRequest,
      ) => void | Promise<void>;
      handler?.(webViewRef, request);
    },
    [webViewRef],
  );
}
