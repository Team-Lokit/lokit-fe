import {
  getGetNotificationsQueryKey,
  type PageResultNotificationResponse,
} from '@repo/api-client';
import { NOTIFICATION_LIST_PAGE_SIZE } from '../constants';

/**
 * 알림함 무한스크롤 쿼리 키.
 * - page는 pageParam으로 관리되므로 키에 포함하지 않는다(size만 고정 파라미터).
 * - 서버(page.tsx)와 클라이언트(NotificationListClient)가 동일한 키를 써야
 *   SSR prefetch 결과가 그대로 hydrate된다.
 */
export const getNotificationsInfiniteQueryKey = () =>
  getGetNotificationsQueryKey({ size: NOTIFICATION_LIST_PAGE_SIZE });

export const getNotificationsNextPageParam = (
  lastPage: PageResultNotificationResponse,
): number | undefined => (lastPage.isLast ? undefined : (lastPage.page ?? 0) + 1);
