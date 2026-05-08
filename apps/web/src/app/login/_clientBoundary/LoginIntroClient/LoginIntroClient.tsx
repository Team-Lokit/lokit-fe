'use client';

import * as S from './LoginIntroClient.styles';
import ScreenIcon from '@/assets/images/screen.svg';

export default function LoginIntroClient() {
  return (
    <S.Wrapper>
      <S.Title>
        <S.MainText>둘만의 커플지도</S.MainText>를 <br /> 지금 바로 만들어보세요
      </S.Title>
      <ScreenIcon />
    </S.Wrapper>
  );
}
