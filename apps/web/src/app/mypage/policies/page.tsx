'use client';

import * as S from './page.style';
import { PAGE_TITLE } from './constants';
import CoupleStatusSyncClient from '@/app/mypage/_clientBoundary/CoupleStatusSyncClient/CoupleStatusSyncClient';
import HeaderClient from '@/app/mypage/policies/HeaderClient/HeaderClient';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';

export default function PoliciesPage() {
  return (
    <S.Wrapper>
      <S.SrOnly>{PAGE_TITLE}</S.SrOnly>
      <CoupleStatusSyncClient />
      <HeaderClient />
      <S.ContentLayout>
        <S.ButtonWrapper>
          <S.Button>
            <S.ButtonText>로킷 서비스 이용약관</S.ButtonText>
            <S.ChevronIcon>
              <ChevronRightIcon />
            </S.ChevronIcon>
          </S.Button>
          <S.Button>
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
