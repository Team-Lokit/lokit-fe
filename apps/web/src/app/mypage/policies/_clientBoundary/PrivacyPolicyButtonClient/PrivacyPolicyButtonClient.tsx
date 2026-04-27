'use client';

import * as S from './PrivacyPolicyButtonClient.styles';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';
import { PRIVACY_POLICY_URL } from '../../constants';

export default function PrivacyPolicyButtonClient() {
  return (
    <S.LinkButton href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">
      <S.ButtonText>개인정보 처리방침</S.ButtonText>
      <S.ChevronIcon>
        <ChevronRightSmallIcon />
      </S.ChevronIcon>
    </S.LinkButton>
  );
}
