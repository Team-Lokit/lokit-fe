import type { LoginReferrer } from '@/lib/analytics/events';

declare global {
  interface Window {
    /**
     * RN 웹뷰가 콜드/웜 스타트 시 Universal Links / App Links로 진입한 경우
     * 그 URL을 주입한다. 존재 = 딥링크 진입.
     */
    __LOKIT_DEEPLINK__?: string;
  }
}

/**
 * 로그인 페이지 진입 경로를 추정.
 * 1순위: RN bridge가 주입한 __LOKIT_DEEPLINK__ — Universal Links / App Links로 진입한 경우 'deeplink'
 * 2순위: document.referrer 호스트 비교 — 외부 도메인이면 'deeplink', 같은 도메인/부재면 'organic'
 */
export function resolveLoginReferrer(): LoginReferrer {
  if (typeof window === 'undefined') return 'organic';

  // 딥링크 진입 → /login으로 도달한 경우(딥링크 타겟이 /login이거나 인증 리다이렉트로 /login에 안착)
  // 만 'deeplink'로 인정. SPA 내비로 다른 페이지에서 /login에 들어오는 경우와 구분하기 위해 pathname 비교.
  // 1회용으로 소비.
  const deeplinkUrl = window.__LOKIT_DEEPLINK__;
  if (deeplinkUrl) {
    try {
      const target = new URL(deeplinkUrl);
      if (target.pathname === window.location.pathname) {
        delete window.__LOKIT_DEEPLINK__;
        return 'deeplink';
      }
    } catch {
      // URL 파싱 실패 시 무시하고 referrer 폴백으로
    }
  }

  const referrer = document.referrer;
  if (!referrer) return 'organic';
  try {
    const referrerHost = new URL(referrer).host;
    return referrerHost && referrerHost !== window.location.host ? 'deeplink' : 'organic';
  } catch {
    return 'organic';
  }
}
