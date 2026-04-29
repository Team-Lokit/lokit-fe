'use client';

import AppleIcon from '@/assets/images/apple.svg';
import KakaoIcon from '@/assets/images/kakao.svg';
import { API_URL } from '@/constants/apiUrl';
import { useIsIOS } from '@/hooks/useIsIOS';
import * as S from './page.styles';
import OnboardingCarousel from './_components/loginCarousel/OnboardingCarousel';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
  const isIOS = useIsIOS();

  const handleKakaoLogin = () => {
    window.location.href = `${apiBaseUrl}${API_URL.AUTH.KAKAO}`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${apiBaseUrl}${API_URL.AUTH.APPLE}`;
  };

  return (
    <S.Wrapper>
      <OnboardingCarousel />
      <S.ButtonWrapper>
        <S.KakaoButton onClick={handleKakaoLogin}>
          <KakaoIcon width={16} height={16} />
          <span>카카오로 계속하기</span>
        </S.KakaoButton>
        {isIOS && (
          <S.AppleButton onClick={handleAppleLogin}>
            <AppleIcon width={16} height={16} />
            <span>Apple로 계속하기</span>
          </S.AppleButton>
        )}
      </S.ButtonWrapper>
    </S.Wrapper>
  );
}
