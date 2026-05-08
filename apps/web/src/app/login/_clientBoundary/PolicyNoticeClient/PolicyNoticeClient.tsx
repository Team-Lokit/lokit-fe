'use client';

import { PRIVACY_POLICY_URL, SERVICE_TERMS_URL } from '@/app/login/constants';
import * as S from './PolicyNoticeClient.styles';

export default function PolicyNoticeClient() {
  return (
    <S.InfoText>
      가입을 진행할 경우, 아래의 정책에 동의한 것으로 간주됩니다.
      <br />
      <S.LinkText href={SERVICE_TERMS_URL} target="_blank" rel="noopener noreferrer">
        서비스이용약관
      </S.LinkText>{' '}
      및{' '}
      <S.LinkText href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">
        개인정보처리방침
      </S.LinkText>
    </S.InfoText>
  );
}
