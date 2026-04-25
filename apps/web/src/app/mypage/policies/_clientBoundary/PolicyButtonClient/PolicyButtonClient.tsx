'use client';

import { useRouter } from 'next/navigation';
import * as S from './PolicyButtonClient.style';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { PRIVACY_POLICY_URL, SERVICE_TERMS_URL } from '../../constants';

export default function PolicyButtonClient() {
  const router = useRouter();

  return (
    <S.ContentLayout>
      <S.ButtonWrapper>
        <S.Button onClick={() => router.push(SERVICE_TERMS_URL)}>
          <S.ButtonText>로킷 서비스 이용약관</S.ButtonText>
          <S.ChevronIcon>
            <ChevronRightIcon />
          </S.ChevronIcon>
        </S.Button>
        <S.Button onClick={() => router.push(PRIVACY_POLICY_URL)}>
          <S.ButtonText>개인정보 처리방침</S.ButtonText>
          <S.ChevronIcon>
            <ChevronRightIcon />
          </S.ChevronIcon>
        </S.Button>
      </S.ButtonWrapper>
    </S.ContentLayout>
  );
}
