'use client';

import { ReactNode } from 'react';
import * as S from './ProfileRowClient.styles';

interface ProfileRowClientProps {
  title: string;
  children: ReactNode;
}

export default function ProfileRowClient({ title, children }: ProfileRowClientProps) {
  return (
    <S.Row>
      <S.RowTitle>{title}</S.RowTitle>
      <S.RowValue>{children}</S.RowValue>
    </S.Row>
  );
}
