import { Suspense } from 'react';
import { COUPLE_STATUS, type CoupleStatus } from '@/constants/coupleStatus';
import { ROUTES } from '@/constants/routes';
import BannerFallback from './_components/BannerFallback/BannerFallback';
import DdayBannerContainerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/DdayBannerContainerClient/DdayBannerContainerClient';
import CoupleConnectBannerClient from '@/app/mypage/_components/BannerContainer/_clientBoundary/CoupleConnectBannerClient/CoupleConnectBannerClient';

interface BannerContainerProps {
  coupleStatus?: CoupleStatus;
}

// 상대가 끊었거나 기간이 만료된 경우는 기존 커플로 재연결하는 흐름을 탄다.
const RECONNECT_STATUSES: CoupleStatus[] = [
  COUPLE_STATUS.DISCONNECTED_BY_PARTNER,
  COUPLE_STATUS.DISCONNECTED_EXPIRED,
];

export default function BannerContainer({ coupleStatus }: BannerContainerProps) {
  if (coupleStatus !== COUPLE_STATUS.COUPLED) {
    const href =
      coupleStatus && RECONNECT_STATUSES.includes(coupleStatus)
        ? ROUTES.RECONNECT
        : // TODO(#103): 새 파트너 연결 페이지 경로로 교체한다.
          ROUTES.ONBOARDING.CONNECT;

    return (
      <section>
        <CoupleConnectBannerClient href={href} />
      </section>
    );
  }

  return (
    <section>
      <Suspense fallback={<BannerFallback />}>
        <DdayBannerContainerClient />
      </Suspense>
    </section>
  );
}
