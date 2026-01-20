export const ICON_SIZE = 22;
export const PROFILE_ICON_SIZE = 20;
export const PROFILE_IMAGE_SIZE = 36;

export const HEADER_TYPE = {
  DEFAULT: 'default',
  EXPLORE: 'explore',
  MENU: 'menu',
} as const;

export type HeaderType = (typeof HEADER_TYPE)[keyof typeof HEADER_TYPE];
