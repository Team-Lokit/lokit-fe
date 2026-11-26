export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { COUPLE_STATUS_COOKIE } from '@/constants/cookie';
import { COUPLE_STATUS } from '@/constants/coupleStatus';
import { PAGE_TITLE } from '@/app/mypage/account/constants';
import { getGetMyPageQueryKey, getMyPageServer } from '@repo/api-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createStreamingQueryClient } from '@/lib/reactQuery/createStreamingQueryClient';
import QueryRetryBoundary from '@/components/common/queryRetryBoundary/QueryRetryBoundary';
import styles from './page.module.css';
import CoupleStatusSyncClient from '@/app/mypage/_clientBoundary/CoupleStatusSyncClient/CoupleStatusSyncClient';
import HeaderClient from '@/app/mypage/account/_clientBoundary/HeaderClient/HeaderClient';
import ProfileContainer from '@/app/mypage/account/_components/ProfileContainer/ProfileContainer';
import ConnectActionContainer from '@/app/mypage/account/_components/ConenctActionContainer/ConnectActionContainer';
import AccountActionContainer from '@/app/mypage/account/_components/AccountActionContainer/AccountActionContainer';

export default async function AccountPage() {
  const cookieStore = await cookies();
  const coupleStatusCookie = cookieStore.get(COUPLE_STATUS_COOKIE)?.value;
  const isCoupled = coupleStatusCookie === COUPLE_STATUS.COUPLED;

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
          <CoupleStatusSyncClient renderedCoupleStatus={coupleStatusCookie} />
          <HeaderClient />
          <div className={styles.sectionContainer}>
            <ProfileContainer />
            <ConnectActionContainer isCoupled={isCoupled} />
            <AccountActionContainer />
          </div>
        </main>
      </QueryRetryBoundary>
    </HydrationBoundary>
  );
}
