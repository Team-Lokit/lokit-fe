'use client';

import * as S from './AccountInfoClient.styles';
import SettingIcon from '@/assets/images/setting.svg';
import BellIcon from '@/assets/images/bell.svg';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';

export default function AccountInfoClient() {
  const router = useRouter();

  return (
    <S.Wrapper>
      <S.SectionTitle>계정</S.SectionTitle>
      <S.Button onClick={() => router.push(ROUTES.NOTIFICATION)}>
        <S.Icon>
          <BellIcon />
        </S.Icon>
        <S.ButtonText>알림 설정</S.ButtonText>
        <S.ChevronIcon>
          <ChevronRightSmallIcon />
        </S.ChevronIcon>
      </S.Button>
      <S.Button onClick={() => router.push(ROUTES.ACCOUNT)}>
        <S.Icon>
          <SettingIcon />
        </S.Icon>
        <S.ButtonText>계정 정보 관리</S.ButtonText>
        <S.ChevronIcon>
          <ChevronRightSmallIcon />
        </S.ChevronIcon>
      </S.Button>
    </S.Wrapper>
  );
}
