export const dynamic = 'force-dynamic';

import { COUPLE_STATUS_COOKIE } from '@/constants/cookie';
import { COUPLE_STATUS } from '@/constants/coupleStatus';
import { getGetMyPageQueryKey, getMyPageServer } from '@repo/api-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { createStreamingQueryClient } from '@/lib/reactQuery/createStreamingQueryClient';
import QueryRetryBoundary from '@/components/common/queryRetryBoundary/QueryRetryBoundary';
import CoupleStatusSyncClient from './_clientBoundary/CoupleStatusSyncClient/CoupleStatusSyncClient';
import HeaderClient from './_clientBoundary/HeaderClient/HeaderClient';
import BannerContainer from './_components/BannerContainer/BannerContainer';
import CoupleInfoContainer from './_components/CoupleInfoContainer/CoupleInfoContainer';
import { PAGE_TITLE } from './constants';
import styles from './page.module.css';
import AccountInfoContainer from './_components/AccountInfoContainer/AccountInfoContainer';
import CustomerSupportContainer from './_components/CustomerSupportContainer/CustomerSupportContainer';

export default async function MyPage() {
  const cookieStore = await cookies();
  const isCoupled =
    cookieStore.get(COUPLE_STATUS_COOKIE)?.value === COUPLE_STATUS.COUPLED;

  const queryClient = createStreamingQueryClient();
  void queryClient.prefetchQuery({
    queryKey: getGetMyPageQueryKey(),
    queryFn: () => getMyPageServer(),
    staleTime: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryRetryBoundary>
        <main className={styles.wrapper}>
          <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>
          <CoupleStatusSyncClient />
          <HeaderClient />
          <div className={styles.coupleInfo}>
            <CoupleInfoContainer isCoupled={isCoupled} />
          </div>
          <div className={styles.sectionContainer}>
            <BannerContainer />
            <AccountInfoContainer />
            <CustomerSupportContainer />
          </div>
        </main>
      </QueryRetryBoundary>
    </HydrationBoundary>
  );
}
