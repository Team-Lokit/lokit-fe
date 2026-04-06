import { Suspense } from 'react';
import BannerFallback from './_components/BannerFallback/BannerFallback';
import styles from './BannerContainer.module.css';
import DdayBannerContainerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainerClient/DdayBannerContainerClient';
import TotalPhotoCountBannerContainerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/TotalPhotoCountBannerContainerClient/TotalPhotoCountBannerContainerClient';

export default function BannerContainer() {
  return (
    <section className={styles.wrapper}>
      <Suspense fallback={<BannerFallback />}>
        <DdayBannerContainerClient />
      </Suspense>
      <Suspense fallback={<BannerFallback />}>
        <TotalPhotoCountBannerContainerClient />
      </Suspense>
    </section>
  );
}
