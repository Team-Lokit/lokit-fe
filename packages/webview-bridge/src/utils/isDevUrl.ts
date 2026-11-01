// RN의 URL 폴리필은 hostname을 지원하지 않아 정규식으로 호스트 판별
const DEV_URL_REGEX =
  /^https?:\/\/(develop\.lokit\.co\.kr|local\.lokit\.co\.kr|localhost)(?=[:/?#]|$)/;

/**
 * URL이 개발 환경(develop/local) 웹을 가리키는지 판별한다.
 * - 웹: window.location.href, 네이티브: WebView에 띄울 URL을 넘긴다.
 */
export const isDevUrl = (url: string): boolean => DEV_URL_REGEX.test(url);
