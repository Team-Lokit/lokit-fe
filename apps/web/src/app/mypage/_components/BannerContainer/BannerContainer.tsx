import { Suspense } from 'react';
import BannerFallback from './_components/BannerFallback/BannerFallback';
import DdayBannerContainerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainerClient/DdayBannerContainerClient';

export default function BannerContainer() {
  return (
    <section>
      <Suspense fallback={<BannerFallback />}>
        <DdayBannerContainerClient />
      </Suspense>
    </section>
  );
}
