'use client';

import * as S from './page.style';
import { PAGE_TITLE } from './constants';
import CoupleStatusSyncClient from '@/app/mypage/_clientBoundary/CoupleStatusSyncClient/CoupleStatusSyncClient';
import HeaderClient from './_clientBoundary/HeaderClient/HeaderClient';
import LogoutClient from '@/app/mypage/account/_clientBoundary/LogoutClient/LogoutClient';
import SignoutClient from '@/app/mypage/account/_clientBoundary/SignoutClient/SignoutClient';
import { useRouter } from 'next/navigation';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { ROUTES } from '@/constants';
import ProfileClient from '@/app/mypage/account/_clientBoundary/ProfileClient/ProfileClient';
import { Suspense } from 'react';
import ProfileFallback from '@/app/mypage/account/_components/ProfileFallback/ProfileFallback';

export default function PoliciesPage() {
  const router = useRouter();

  return (
    <S.Wrapper>
      <S.SrOnly>{PAGE_TITLE}</S.SrOnly>
      <CoupleStatusSyncClient />
      <HeaderClient />
      <S.ContentLayout>
        <Suspense fallback={<ProfileFallback />}>
          <ProfileClient />
        </Suspense>
        <S.ButtonWrapper>
          <S.Button type="button" onClick={() => router.push(ROUTES.DISCONNECT)}>
            <S.ButtonText>상대방과 연결 끊기</S.ButtonText>
            <S.ChevronIcon>
              <ChevronRightIcon />
            </S.ChevronIcon>
          </S.Button>
        </S.ButtonWrapper>
        <S.ButtonWrapper>
          <LogoutClient />
          <SignoutClient />
        </S.ButtonWrapper>
      </S.ContentLayout>
    </S.Wrapper>
  );
}
