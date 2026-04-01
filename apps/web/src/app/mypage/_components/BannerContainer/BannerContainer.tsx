import { Suspense } from 'react';
import BannerFallback from './_components/BannerFallback/BannerFallback';
import styles from './BannerContainer.module.css';
import DdayBannerContainer from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainer/DdayBannerContainer';
import TotalPhotoCountBannerContainer from '@/app/mypage/_components/BannerContainer/_clientBoundary/TotalPhotoCountBannerContainer/TotalPhotoCountBannerContainer';

export default function BannerContainer() {
  return (
    <section className={styles.wrapper}>
      <Suspense fallback={<BannerFallback />}>
        <DdayBannerContainer />
      </Suspense>
      <Suspense fallback={<BannerFallback />}>
        <TotalPhotoCountBannerContainer />
      </Suspense>
    </section>
  );
}
