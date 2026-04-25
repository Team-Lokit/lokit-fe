'use client';

import * as S from './CustomerSupportSection.styles';
import HeadsetIcon from '@/assets/images/headset.svg';
import InfoLineIcon from '@/assets/images/info-line.svg';
import InstaIcon from '@/assets/images/insta.svg';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { INQUIRE_URL, SNS_URL } from '@/app/mypage/policies/constants';

export default function CustomerSupportSection() {
  const router = useRouter();

  return (
    <S.Wrapper>
      <S.SectionTitle>고객지원</S.SectionTitle>
      <S.ButtonContainer>
        <S.LinkButton href={INQUIRE_URL} target="_blank" rel="noopener noreferrer">
          <S.Icon>
            <HeadsetIcon />
          </S.Icon>
          <S.ButtonText>문의하기</S.ButtonText>
          <S.ChevronIcon>
            <ChevronRightIcon />
          </S.ChevronIcon>
        </S.LinkButton>
        <S.Button onClick={() => router.push(ROUTES.POLICIES)}>
          <S.Icon>
            <InfoLineIcon />
          </S.Icon>
          <S.ButtonText>약관 및 정책</S.ButtonText>
          <S.ChevronIcon>
            <ChevronRightIcon />
          </S.ChevronIcon>
        </S.Button>
        <S.LinkButton href={SNS_URL} target="_blank" rel="noopener noreferrer">
          <S.Icon>
            <InstaIcon />
          </S.Icon>
          <S.ButtonText>SNS 놀러가기</S.ButtonText>
          <S.ChevronIcon>
            <ChevronRightIcon />
          </S.ChevronIcon>
        </S.LinkButton>
      </S.ButtonContainer>
    </S.Wrapper>
  );
}
