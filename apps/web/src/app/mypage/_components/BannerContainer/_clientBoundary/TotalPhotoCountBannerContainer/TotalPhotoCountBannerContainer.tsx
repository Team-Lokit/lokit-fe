'use client';

import TotalPhotoCountBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/TotalPhotoCountBannerContainer/TotalPhotoCountBannerClient';
import TotalPhotoCountEmptyBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/TotalPhotoCountBannerContainer/TotalPhotoCountEmptyBannerClient';
import { useGetMyPageSuspense } from '@repo/api-client';

export default function TotalPhotoCountBannerContainer() {
  const { data } = useGetMyPageSuspense();

  const hasPhotoCount = (data.couplePhotoCount ?? 0) > 0;

  return hasPhotoCount ? (
    <TotalPhotoCountBannerClient />
  ) : (
    <TotalPhotoCountEmptyBannerClient />
  );
}
