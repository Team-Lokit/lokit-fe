'use client';

import { useRouter } from 'next/navigation';
import * as S from './TotalPhotoCountBannerClient.styles';
import pin3dPng from '@/assets/images/pin_3d.png';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { ROUTES } from '@/constants';
import Image from 'next/image';

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
      <S.BackgroundIcon>
        <Image src={pin3dPng} alt="" width={151} height={132} aria-hidden />
      </S.BackgroundIcon>

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
