import { buildUrlWithQueryParams } from '@repo/api-client/src/fetcher';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EXPLORE: '/explore',
  NOTIFICATIONS: '/notifications',
  ALBUM: {
    DETAIL: (albumId: number) => `/album/${albumId}`,
  },
  PHOTO: {
    ADD: '/photo/add',
    CAPTURE: '/photo/capture',
    NOTE: {
      ADD: '/photo/add/note',
    },
    VIEW: (
      photoId: number,
      params?: {
        albumId?: number;
        source?: string;
        /** 캘린더에서 진입 시 해당 날짜(YYYY-MM-DD) 사진만 슬라이더에 노출 */
        date?: string;
      },
    ) => buildUrlWithQueryParams(`/photo/${photoId}`, params),
    VIEW_WITH_CLUSTER: (photoId: number, clusterId: string) =>
      `/photo/${photoId}?clusterId=${clusterId}`,
  },
  ONBOARDING: {
    // TODO(#103): 미들웨어의 isOnboarding·/onboarding 리다이렉트를 정리할 때 함께 제거한다.
    START: '/onboarding',
    CONNECT: '/onboarding/connect',
    VERIFY: '/onboarding/verify',
  },
  MYPAGE: '/mypage',
  POLICIES: '/mypage/policies',
  ACCOUNT: '/mypage/account',
  NOTIFICATION: '/mypage/notification',
  RECONNECT: '/reconnect',
  DISCONNECT: '/disconnect',
  SIGNOUT: '/signout',
  SYNC: '/sync',
} as const;
