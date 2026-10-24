export const dynamic = 'force-dynamic';

import { PAGE_TITLE } from '@/app/mypage/notification/constants';
import {
  getGetNotificationSettingsQueryKey,
  getNotificationSettingsServer,
} from '@repo/api-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createStreamingQueryClient } from '@/lib/reactQuery/createStreamingQueryClient';
import QueryRetryBoundary from '@/components/common/queryRetryBoundary/QueryRetryBoundary';
import styles from './page.module.css';
import HeaderClient from '@/app/mypage/notification/_clientBoundary/HeaderClient/HeaderClient';
import NotificationSettingsContainer from '@/app/mypage/notification/_components/NotificationSettingsContainer/NotificationSettingsContainer';
import DeviceNotificationBannerContainer from '@/app/mypage/notification/_components/DeviceNotificationBannerContainer/DeviceNotificationBannerContainer';

export default function NotificationPage() {
  const queryClient = createStreamingQueryClient();
  void queryClient.prefetchQuery({
    queryKey: getGetNotificationSettingsQueryKey(),
    queryFn: () => getNotificationSettingsServer(),
    staleTime: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryRetryBoundary>
        <main className={styles.wrapper}>
          <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>
          <HeaderClient />
          <div className={styles.sectionContainer}>
            <DeviceNotificationBannerContainer />
            <NotificationSettingsContainer />
          </div>
        </main>
      </QueryRetryBoundary>
    </HydrationBoundary>
  );
}
