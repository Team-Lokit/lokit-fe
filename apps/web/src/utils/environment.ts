/**
 * 현재 클라이언트가 네이티브 앱 WebView 안에서 실행 중인지 판별한다.
 * - 브리지가 주입되어 있으면 WebView로 간주
 * - WebView가 아니면(브라우저) `<input type="file">` 경로를 쓰므로
 *   OS가 자체적으로 카메라/갤러리 선택지를 제공함 → 별도 액션시트 불필요
 */
export const checkIsInWebView = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!window.__lokitBridge && !!window.ReactNativeWebView;
};
