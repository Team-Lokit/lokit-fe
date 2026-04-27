'use client';

import * as S from './PolicyButtonClient.styles';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { PRIVACY_POLICY_URL, SERVICE_TERMS_URL } from '../../constants';

export default function PolicyButtonClient() {
  return (
    <S.ContentLayout>
      <S.ButtonWrapper>
        <S.LinkButton href={SERVICE_TERMS_URL} target="_blank" rel="noopener noreferrer">
          <S.ButtonText>로킷 서비스 이용약관</S.ButtonText>
          <S.ChevronIcon>
            <ChevronRightIcon />
          </S.ChevronIcon>
        </S.LinkButton>
        <S.LinkButton href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">
          <S.ButtonText>개인정보 처리방침</S.ButtonText>
          <S.ChevronIcon>
            <ChevronRightIcon />
          </S.ChevronIcon>
        </S.LinkButton>
      </S.ButtonWrapper>
    </S.ContentLayout>
  );
}
