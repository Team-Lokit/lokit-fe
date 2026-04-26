'use client';

import * as S from './AccountPageClient.style';
import { PAGE_TITLE } from './constants';
import CoupleStatusSyncClient from '@/app/mypage/_clientBoundary/CoupleStatusSyncClient/CoupleStatusSyncClient';
import LogoutClient from '@/app/mypage/account/_clientBoundary/LogoutClient/LogoutClient';
import SignoutClient from '@/app/mypage/account/_clientBoundary/SignoutClient/SignoutClient';
import { useRouter } from 'next/navigation';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { ROUTES } from '@/constants';
import ProfileClient from '@/app/mypage/account/_clientBoundary/ProfileClient/ProfileClient';
import HeaderClient from '../HeaderClient/HeaderClient';

export default function AccountPageClient() {
  const router = useRouter();

  return (
    <S.Wrapper>
      <S.SrOnly>{PAGE_TITLE}</S.SrOnly>
      <CoupleStatusSyncClient />
      <HeaderClient />
      <S.ContentLayout>
        <ProfileClient />
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
