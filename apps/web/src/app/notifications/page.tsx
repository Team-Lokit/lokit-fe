export const dynamic = 'force-dynamic';

import { getNotificationsServer } from '@repo/api-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createStreamingQueryClient } from '@/lib/reactQuery/createStreamingQueryClient';
import QueryRetryBoundary from '@/components/common/queryRetryBoundary/QueryRetryBoundary';
import styles from './page.module.css';
import HeaderClient from './_clientBoundary/HeaderClient/HeaderClient';
import NotificationListContainer from './_components/NotificationListContainer/NotificationListContainer';
import { PAGE_TITLE, NOTIFICATION_LIST_PAGE_SIZE } from './constants';
import {
  getNotificationsInfiniteQueryKey,
  getNotificationsNextPageParam,
} from './_utils/notificationsQuery';

export default function NotificationsPage() {
  const queryClient = createStreamingQueryClient();
  void queryClient.prefetchInfiniteQuery({
    queryKey: getNotificationsInfiniteQueryKey(),
    queryFn: ({ pageParam }) =>
      getNotificationsServer({ page: pageParam, size: NOTIFICATION_LIST_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: getNotificationsNextPageParam,
    staleTime: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryRetryBoundary>
        <main className={styles.wrapper}>
          <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>
          <HeaderClient />
          <div className={styles.sectionContainer}>
            <NotificationListContainer />
          </div>
        </main>
      </QueryRetryBoundary>
    </HydrationBoundary>
  );
}
