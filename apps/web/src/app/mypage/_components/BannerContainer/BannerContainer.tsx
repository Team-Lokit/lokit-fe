import { Suspense } from 'react';
import { COUPLE_STATUS, type CoupleStatus } from '@/constants/coupleStatus';
import BannerFallback from './_components/BannerFallback/BannerFallback';
import DdayBannerContainerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainerClient/DdayBannerContainerClient';
import CoupleConnectBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/CoupleConnectBannerClient/CoupleConnectBannerClient';

interface BannerContainerProps {
  coupleStatus?: CoupleStatus;
}

export default function BannerContainer({ coupleStatus }: BannerContainerProps) {
  return (
    <section>
      <Suspense fallback={<BannerFallback />}>
        {coupleStatus === COUPLE_STATUS.COUPLED ? (
          <DdayBannerContainerClient />
        ) : (
          <CoupleConnectBannerClient />
        )}
      </Suspense>
    </section>
  );
}
