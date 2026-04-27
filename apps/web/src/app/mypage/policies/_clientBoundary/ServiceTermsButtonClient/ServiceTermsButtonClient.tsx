'use client';

import * as S from './ServiceTermsButtonClient.styles';

import { SERVICE_TERMS_URL } from '@/app/mypage/policies/constants';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';

export default function ServiceTermsButtonClient() {
  return (
    <S.LinkButton href={SERVICE_TERMS_URL} target="_blank" rel="noopener noreferrer">
      <S.ButtonText>로킷 서비스 이용약관</S.ButtonText>
      <S.ChevronIcon>
        <ChevronRightSmallIcon />
      </S.ChevronIcon>
    </S.LinkButton>
  );
}
