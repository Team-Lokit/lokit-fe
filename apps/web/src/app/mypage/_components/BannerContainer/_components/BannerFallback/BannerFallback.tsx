import Skeleton from '@/components/common/skeleton/Skeleton';

export default function BannerFallback() {
  // 배너(DdayBannerClient.styles의 Wrapper)와 크기를 맞춰 로딩 후 레이아웃 시프트를 막는다.
  return <Skeleton width="100%" height={82} borderRadius={16} />;
}
