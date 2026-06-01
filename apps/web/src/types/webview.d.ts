import type { BridgeResponse } from '@repo/webview-bridge';

interface WebViewBridge {
  isIOS: boolean;
  isAndroid: boolean;
}

interface LokitBridge {
  register: (requestId: string, cb: (response: BridgeResponse) => void) => void;
  onResponse: (response: BridgeResponse) => void;
}

interface ReactNativeWebView {
  postMessage: (message: string) => void;
}

declare global {
  interface Window {
    /**
     * 네이티브 -> 웹 (정적 환경 정보)
     * - WebView 콘텐츠 로드 직전에 injectedJavaScriptBeforeContentLoaded로 주입
     * - 페이지 새로고침/외부 URL 이동 시 재주입됨
     */
    __BRIDGE__?: WebViewBridge;
    /**
     * 웹 -> 네이티브
     * - react-native-webview 라이브러리가 자동 주입하는 채널
     * - postMessage 호출 시 네이티브의 <WebView onMessage> 핸들러로 전달됨
     */
    ReactNativeWebView?: ReactNativeWebView;
    /**
     * 네이티브 -> 웹 (비동기 응답 디스패처)
     * - register(requestId, cb): 웹이 응답 콜백을 등록
     * - onResponse(response): 네이티브가 webView.injectJavaScript로 호출해 등록된 콜백을 트리거
     * - requestId로 다중 요청 매칭
     */
    __lokitBridge?: LokitBridge;
  }
}

export {};
