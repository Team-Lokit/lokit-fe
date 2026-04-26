'use client';

import { useGetMyPageSuspense } from '@repo/api-client';
import * as S from './ProfileNameClient.style';

export default function ProfileNameClient() {
  const { data } = useGetMyPageSuspense();

  return (
    <S.Row>
      <S.RowTitle>이름</S.RowTitle>
      <S.RowValue>{data.myName}</S.RowValue>
    </S.Row>
  );
}
