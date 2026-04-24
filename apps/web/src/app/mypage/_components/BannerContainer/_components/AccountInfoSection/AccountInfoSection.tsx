'use client';

import * as S from './AccountInfoSection.styles';
import SettingIcon from '@/assets/images/setting.svg';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
export default function AccountInfoSection() {
  const router = useRouter();

  return (
    <S.Wrapper>
      <S.SectionTitle>계정</S.SectionTitle>
      <S.Button onClick={() => router.push(ROUTES.ACCOUNT)}>
        <S.Icon>
          <SettingIcon />
        </S.Icon>
        <S.ButtonText>계정 정보 관리</S.ButtonText>
        <S.ChevronIcon>
          <ChevronRightIcon />
        </S.ChevronIcon>
      </S.Button>
    </S.Wrapper>
  );
}
