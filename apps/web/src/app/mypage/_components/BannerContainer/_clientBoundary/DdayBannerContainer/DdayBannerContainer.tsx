'use client';

import DdayBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainer/DdayBannerClient';
import DdayEmptyBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainer/DdayEmptyBannerClient';
import { useGetMyPageSuspense } from '@repo/api-client';

export default function DdayBannerContainer() {
  const { data } = useGetMyPageSuspense();

  return data.coupledDay ? <DdayBannerClient /> : <DdayEmptyBannerClient />;
}
