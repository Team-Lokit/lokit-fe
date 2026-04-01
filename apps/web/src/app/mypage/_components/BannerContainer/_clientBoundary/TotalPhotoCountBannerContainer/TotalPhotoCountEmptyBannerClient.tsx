'use client';

import { useRouter } from 'next/navigation';
import * as S from './TotalPhotoCountBannerClient.styles';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { ROUTES } from '@/constants';

export default function TotalPhotoCountEmptyBannerClient() {
  const router = useRouter();

  const handleBannerClick = () => {
    router.push(ROUTES.HOME);
  };

  return (
    <S.Wrapper
      role="button"
      tabIndex={0}
      onClick={handleBannerClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBannerClick();
        }
      }}
    >
      <S.Content>
        <S.EmptyCaption>아직 추억이 없어요</S.EmptyCaption>
        <S.EmptyText>사진을 추가해볼까요?</S.EmptyText>
      </S.Content>
      <S.ChevronIcon>
        <ChevronRightIcon width={22} height={22} />
      </S.ChevronIcon>
    </S.Wrapper>
  );
}
