export const dynamic = 'force-dynamic';

import AccountPageClient from '@/app/mypage/account/_clientBoundary/AccountPageClient/AccountPageClient';
import { getGetMyPageQueryKey, getMyPageServer } from '@repo/api-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

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
      <AccountPageClient />;
    </HydrationBoundary>
  );
}
