'use client';

import * as S from './ConnectedAccountClient.style';
import KakaoIcon from '@/assets/images/kakao.svg';

// TODO: 연결된 계정 api 연결 필요
export default function ConnectedAccountClient() {
  return (
    <S.Row>
      <S.RowTitle>연결된 계정</S.RowTitle>
      <S.RowValue>
        <S.KakaoIconContainer>
          <KakaoIcon width={10} height={10} />
        </S.KakaoIconContainer>
        카카오
      </S.RowValue>
    </S.Row>
  );
}

ConnectedAccountClient;
