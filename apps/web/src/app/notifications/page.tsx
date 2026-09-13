export const dynamic = 'force-dynamic';

import { getGetNotificationsQueryKey, getNotificationsServer } from '@repo/api-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import styles from './page.module.css';
import HeaderClient from './_clientBoundary/HeaderClient/HeaderClient';
import NotificationListContainer from './_components/NotificationListContainer/NotificationListContainer';
import { PAGE_TITLE, NOTIFICATION_LIST_PARAMS } from './constants';

export default async function NotificationsPage() {
  const queryClient = new QueryClient();
  await queryClient
    .prefetchQuery({
      queryKey: getGetNotificationsQueryKey(NOTIFICATION_LIST_PARAMS),
      queryFn: () => getNotificationsServer(NOTIFICATION_LIST_PARAMS),
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
