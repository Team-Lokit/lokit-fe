'use client';

import DdayBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainerClient/DdayBannerClient';
import DdayEmptyBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainerClient/DdayEmptyBannerClient';
import { useGetMyPageSuspense } from '@repo/api-client';

export default function DdayBannerContainerClient() {
  const { data } = useGetMyPageSuspense();

  return data.coupledDay ? <DdayBannerClient /> : <DdayEmptyBannerClient />;
}
