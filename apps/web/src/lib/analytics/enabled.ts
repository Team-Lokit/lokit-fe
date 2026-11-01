import { checkIsDevHost } from '@/utils/environment';

/** 프로덕션 빌드의 브라우저이고 프로덕션 도메인일 때만 수집 (develop/local/localhost 제외) */
export const isAnalyticsEnabled = (): boolean =>
  process.env.NODE_ENV === 'production' &&
  typeof window !== 'undefined' &&
  !checkIsDevHost();
