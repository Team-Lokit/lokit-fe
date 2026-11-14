'use client';

import { useRouter } from 'next/navigation';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';
import HeartGradientIcon from '@/assets/images/heartGradient.svg';
import * as S from '../DdayBannerContainerClient/DdayBannerClient.styles';

interface CoupleConnectBannerClientProps {
  href: string;
}

export default function CoupleConnectBannerClient({
  href,
}: CoupleConnectBannerClientProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <S.Wrapper
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <S.ContentContainer>
        <S.IconContainer>
          <HeartGradientIcon />
        </S.IconContainer>
        <S.TextContainer>
          <S.Title>함께할 사람과 연결하기</S.Title>
          <S.Description>추억을 같이 모아보세요</S.Description>
        </S.TextContainer>
      </S.ContentContainer>
      <S.ChevronIcon>
        <ChevronRightSmallIcon />
      </S.ChevronIcon>
    </S.Wrapper>
  );
}
