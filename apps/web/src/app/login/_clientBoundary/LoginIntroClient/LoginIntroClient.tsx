'use client';

import * as S from './LoginIntroClient.styles';
import ScreenImage from '@/assets/images/screen.png';
import Image from 'next/image';

export default function LoginIntroClient() {
  return (
    <S.Wrapper>
      <S.Title>
        <S.MainText>둘만의 커플지도</S.MainText>를 <br /> 지금 바로 만들어보세요
      </S.Title>

      <S.ImageWrapper>
        <Image src={ScreenImage} alt="커플지도 화면 미리보기" priority width={154} />
      </S.ImageWrapper>
    </S.Wrapper>
  );
}
