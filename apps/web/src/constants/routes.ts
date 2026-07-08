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
    ) => {
      const searchParams = new URLSearchParams();

      if (params?.albumId) {
        searchParams.set('albumId', String(params.albumId));
      }

      if (params?.source) {
        searchParams.set('source', params.source);
      }

      const query = searchParams.toString();

      return query ? `/photo/${photoId}?${query}` : `/photo/${photoId}`;
    },
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
  RECONNECT: '/reconnect',
  DISCONNECT: '/disconnect',
  SIGNOUT: '/signout',
  SYNC: '/sync',
} as const;
