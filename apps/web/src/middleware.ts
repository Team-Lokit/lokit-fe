import { NextRequest, NextResponse } from 'next/server';

import { ROUTES } from '@/constants/routes';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  COUPLE_STATUS_COOKIE,
} from '@/constants/cookie';
import { COUPLE_STATUS } from '@/constants/coupleStatus';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const coupleStatus = request.cookies.get(COUPLE_STATUS_COOKIE)?.value;
  const isLoginPage = pathname.startsWith(ROUTES.LOGIN);
  const isSyncPage = pathname === ROUTES.SYNC;

  // refresh가 세션의 기준점이다. access 쿠키는 짧은 TTL로 먼저 만료돼 사라지지만,
  // refresh가 살아있으면 다음 API 호출(SSR/클라)에서 백엔드가 토큰을 자동 재발급(Set-Cookie)한다.
  // 따라서 access 부재만으로 로그인시키지 않고, access·refresh가 모두 없을 때만 미인증으로 본다.
  if (!accessToken && !refreshToken) {
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

  // coupleStatus 쿠키 없음 → /sync에서 쿠키 동기화 후 원래 경로로 복귀
  if (!coupleStatus) {
    if (isSyncPage) {
      return NextResponse.next();
    }
    const syncUrl = new URL(ROUTES.SYNC, request.url);
    syncUrl.searchParams.set('redirect', pathname);
    // 백엔드가 OAuth 콜백 redirect에 붙인 로그인 파라미터를 /sync까지 넘긴다.
    // 여기서 버려지면 login_success의 user_id·is_new_user를 잃는다.
    for (const key of ['user_id', 'is_new_user']) {
      const value = request.nextUrl.searchParams.get(key);
      if (value) syncUrl.searchParams.set(key, value);
    }
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
      // 신규 → 온보딩, 회원탈퇴만 허용
      const allowed = [ROUTES.ONBOARDING.START, ROUTES.SIGNOUT];
      if (!allowed.some((p) => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL(ROUTES.ONBOARDING.START, request.url));
      }
      break;

    case COUPLE_STATUS.DISCONNECTED_BY_ME: {
      // 내가 끊음 → 온보딩 connect/verify, 회원탈퇴만 허용
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
