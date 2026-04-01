import { Suspense } from 'react';
import TotalPhotoCountBannerClient from './_clientBoundary/TotalPhotoCountBannerClient/TotalPhotoCountBannerClient';
import BannerFallback from './_components/BannerFallback/BannerFallback';
import styles from './BannerContainer.module.css';
import DdayBannerContainer from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainer/DdayBannerContainer';

export default function BannerContainer() {
  return (
    <section className={styles.wrapper}>
      <Suspense fallback={<BannerFallback />}>
        <DdayBannerContainer />
      </Suspense>
      <Suspense fallback={<BannerFallback />}>
        <TotalPhotoCountBannerClient />
      </Suspense>
    </section>
  );
}
