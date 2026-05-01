import { NextRequest, NextResponse } from 'next/server';

import { ROUTES } from '@/constants/routes';
import { ACCESS_TOKEN_COOKIE, COUPLE_STATUS_COOKIE } from '@/constants/cookie';
import { COUPLE_STATUS } from '@/constants/coupleStatus';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const coupleStatus = request.cookies.get(COUPLE_STATUS_COOKIE)?.value;
  const isLoginPage = pathname.startsWith(ROUTES.LOGIN);

  // 미인증 → 로그인만 허용
  if (!accessToken) {
    if (isLoginPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  // 인증됨 → 로그인 접근 불가
  if (isLoginPage) {
    return NextResponse.redirect(new URL(ROUTES.ONBOARDING.START, request.url));
  }

  const isOnboarding = pathname.startsWith(ROUTES.ONBOARDING.START);
  const isSyncPage = pathname === ROUTES.SYNC;

  // coupleStatus 쿠키 없음 → /sync에서 쿠키 동기화 후 원래 경로로 복귀
  if (!coupleStatus) {
    if (isSyncPage) {
      return NextResponse.next();
    }
    const syncUrl = new URL(ROUTES.SYNC, request.url);
    syncUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(syncUrl);
  }

  switch (coupleStatus) {
    case COUPLE_STATUS.COUPLED:
      // 커플 → 온보딩 접근 불가
      if (isOnboarding) {
        return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
      }
      break;

    case COUPLE_STATUS.NOT_COUPLED:
      // 신규 → 온보딩만 허용
      if (!isOnboarding) {
        return NextResponse.redirect(new URL(ROUTES.ONBOARDING.START, request.url));
      }
      break;

    case COUPLE_STATUS.DISCONNECTED_BY_ME: {
      // 내가 끊음 → 온보딩 connect/verify, signout만 허용
      const allowed = [
        ROUTES.ONBOARDING.START,
        ROUTES.ONBOARDING.PROFILE,
        ROUTES.ONBOARDING.CONNECT,
        ROUTES.ONBOARDING.VERIFY,
        ROUTES.SIGNOUT,
      ];
      if (!allowed.some((p) => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL(ROUTES.ONBOARDING.START, request.url));
      }
      break;
    }

    case COUPLE_STATUS.DISCONNECTED_BY_PARTNER:
      // 상대가 끊음 → 온보딩만 접근 불가
      if (isOnboarding) {
        return NextResponse.redirect(new URL(ROUTES.MYPAGE, request.url));
      }
      break;

    default:
      // /sync에서 쿠키 동기화 실패 시 fallback → NOT_COUPLED로 간주
      if (!isOnboarding) {
        return NextResponse.redirect(new URL(ROUTES.ONBOARDING.START, request.url));
      }
      break;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 경로에 적용
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     */
    '/((?!_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)',
  ],
};
