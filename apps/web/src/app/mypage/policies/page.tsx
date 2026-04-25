'use client';

import * as S from './page.style';
import { PAGE_TITLE, PRIVACY_POLICY_URL, SERVICE_TERMS_URL } from './constants';
import HeaderClient from '@/app/mypage/policies/HeaderClient/HeaderClient';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { useRouter } from 'next/navigation';

export default function PoliciesPage() {
  const router = useRouter();

  return (
    <S.Wrapper>
      <S.SrOnly>{PAGE_TITLE}</S.SrOnly>
      <HeaderClient />
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
    </S.Wrapper>
  );
}
