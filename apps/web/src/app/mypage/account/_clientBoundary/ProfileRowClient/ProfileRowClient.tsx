'use client';

import { ReactNode } from 'react';
import * as S from './ProfileRowClient.styles';

type ProfileRowType = 'name' | 'connectedAccount' | 'versionInfo';

interface ProfileRowClientProps {
  type: ProfileRowType;
  children: ReactNode;
}

const PROFILE_ROW_TITLE: Record<ProfileRowType, string> = {
  name: '이름',
  connectedAccount: '연결된 계정',
  versionInfo: '나의 버전 정보',
};

export default function ProfileRowClient({ type, children }: ProfileRowClientProps) {
  return (
    <S.Row>
      <S.RowTitle>{PROFILE_ROW_TITLE[type]}</S.RowTitle>
      <S.RowValue>{children}</S.RowValue>
    </S.Row>
  );
}
