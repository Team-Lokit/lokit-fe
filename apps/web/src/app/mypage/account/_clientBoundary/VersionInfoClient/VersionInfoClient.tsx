'use client';

import * as S from './VersionInfoClient.style';

// TODO: 버전 정보 api 연결 필요
export default function VersionInfoClient() {
  return (
    <S.Row>
      <S.RowTitle>나의 버전 정보</S.RowTitle>
      <S.RowValue>1.0.0</S.RowValue>
    </S.Row>
  );
}
