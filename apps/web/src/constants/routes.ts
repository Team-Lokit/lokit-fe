import { buildUrlWithQueryParams } from '@repo/api-client/src/fetcher';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EXPLORE: '/explore',
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
      },
    ) => buildUrlWithQueryParams(`/photo/${photoId}`, params),
    VIEW_WITH_CLUSTER: (photoId: number, clusterId: string) =>
      `/photo/${photoId}?clusterId=${clusterId}`,
  },
  ONBOARDING: {
    START: '/onboarding',
    PROFILE: '/onboarding/profile',
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
