export const dynamic = 'force-dynamic';

import { PAGE_TITLE } from '@/app/mypage/notification/constants';
import {
  getGetNotificationSettingsQueryKey,
  getNotificationSettingsServer,
} from '@repo/api-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import styles from './page.module.css';
import HeaderClient from '@/app/mypage/notification/_clientBoundary/HeaderClient/HeaderClient';
import NotificationSettingsContainer from '@/app/mypage/notification/_components/NotificationSettingsContainer/NotificationSettingsContainer';

export default async function NotificationPage() {
  const queryClient = new QueryClient();
  await queryClient
    .prefetchQuery({
      queryKey: getGetNotificationSettingsQueryKey(),
      queryFn: () => getNotificationSettingsServer(),
      staleTime: 0,
    })
    .catch((error) => {
      console.error('[NotificationSettings] prefetch failed:', error);
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.wrapper}>
        <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>
        <HeaderClient />
        <div className={styles.sectionContainer}>
          <NotificationSettingsContainer />
        </div>
      </main>
    </HydrationBoundary>
  );
}
