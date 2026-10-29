import { isDevUrl } from '@repo/webview-bridge';

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

/**
 * 현재 접속한 호스트가 개발 환경(develop/local)인지 판별한다.
 * - 빌드 env(NEXT_PUBLIC_APP_ENV)와 무관하게 실제 접속 도메인 기준으로 판단
 * - 서버 렌더링 시에는 false (컴포넌트에서는 useIsDevHost 훅 사용)
 */
export const checkIsDevHost = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isDevUrl(window.location.href);
};
