const COOKIE_PREFIX = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? '' : 'dev-';

export const ACCESS_TOKEN_COOKIE = `${COOKIE_PREFIX}accessToken`;
export const REFRESH_TOKEN_COOKIE = `${COOKIE_PREFIX}refreshToken`;
export const COUPLE_STATUS_COOKIE = `${COOKIE_PREFIX}coupleStatus`;
