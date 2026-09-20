export const dynamic = 'force-dynamic';

import { getNotificationsServer } from '@repo/api-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import styles from './page.module.css';
import HeaderClient from './_clientBoundary/HeaderClient/HeaderClient';
import NotificationListContainer from './_components/NotificationListContainer/NotificationListContainer';
import { PAGE_TITLE, NOTIFICATION_LIST_PAGE_SIZE } from './constants';
import {
  getNotificationsInfiniteQueryKey,
  getNotificationsNextPageParam,
} from './_utils/notificationsQuery';

export default async function NotificationsPage() {
  const queryClient = new QueryClient();
  await queryClient
    .prefetchInfiniteQuery({
      queryKey: getNotificationsInfiniteQueryKey(),
      queryFn: ({ pageParam }) =>
        getNotificationsServer({ page: pageParam, size: NOTIFICATION_LIST_PAGE_SIZE }),
      initialPageParam: 0,
      getNextPageParam: getNotificationsNextPageParam,
      staleTime: 0,
    })
    .catch((error) => {
      console.error('[Notifications] prefetch failed:', error);
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.wrapper}>
        <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>
        <HeaderClient />
        <div className={styles.sectionContainer}>
          <NotificationListContainer />
        </div>
      </main>
    </HydrationBoundary>
  );
}
