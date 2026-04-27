'use client';

import * as S from './ConnectedAccountValueClient.styles';
import KakaoIcon from '@/assets/images/kakao.svg';

// TODO: 연결된 계정 api 연결 필요
export default function ConnectedAccountValueClient() {
  return (
    <>
      <S.KakaoIconContainer>
        <KakaoIcon width={10} height={10} />
      </S.KakaoIconContainer>
      카카오
    </>
  );
}
