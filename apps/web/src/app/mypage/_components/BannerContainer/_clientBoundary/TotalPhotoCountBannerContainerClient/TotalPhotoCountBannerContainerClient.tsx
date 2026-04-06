'use client';

import TotalPhotoCountBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/TotalPhotoCountBannerContainerClient/TotalPhotoCountBannerClient';
import TotalPhotoCountEmptyBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/TotalPhotoCountBannerContainerClient/TotalPhotoCountEmptyBannerClient';
import { useGetMyPageSuspense } from '@repo/api-client';

export default function TotalPhotoCountBannerContainerClient() {
  const { data } = useGetMyPageSuspense();

  const hasPhotoCount = (data.couplePhotoCount ?? 0) > 0;

  return hasPhotoCount ? (
    <TotalPhotoCountBannerClient />
  ) : (
    <TotalPhotoCountEmptyBannerClient />
  );
}
