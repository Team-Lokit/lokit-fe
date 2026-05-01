export const dynamic = 'force-dynamic';

import { PAGE_TITLE } from '@/app/mypage/account/constants';
import { getGetMyPageQueryKey, getMyPageServer } from '@repo/api-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import styles from './page.module.css';
import CoupleStatusSyncClient from '@/app/mypage/_clientBoundary/CoupleStatusSyncClient/CoupleStatusSyncClient';
import HeaderClient from '@/app/mypage/account/_clientBoundary/HeaderClient/HeaderClient';
import ProfileContainer from '@/app/mypage/account/_components/ProfileContainer/ProfileContainer';
import ConnectActionContainer from '@/app/mypage/account/_components/ConenctActionContainer/ConnectActionContainer';
import AccountActionContainer from '@/app/mypage/account/_components/AccountActionContainer/AccountActionContainer';

export default async function AccountPage() {
  const queryClient = new QueryClient();
  await queryClient
    .prefetchQuery({
      queryKey: getGetMyPageQueryKey(),
      queryFn: () => getMyPageServer(),
      staleTime: 0,
    })
    .catch((error) => {
      console.error('[MyPage] prefetch failed:', error);
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.wrapper}>
        <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>
        <CoupleStatusSyncClient />
        <HeaderClient />
        <div className={styles.sectionContainer}>
          <ProfileContainer />
          <ConnectActionContainer />
          <AccountActionContainer />
        </div>
      </main>
    </HydrationBoundary>
  );
}
