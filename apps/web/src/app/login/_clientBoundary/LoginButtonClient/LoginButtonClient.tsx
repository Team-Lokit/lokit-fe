'use client';

import * as S from './LoginButtonClient.styles';
import AppleIcon from '@/assets/images/apple.svg';
import KakaoIcon from '@/assets/images/kakao.svg';
import { API_URL } from '@/constants/apiUrl';
import { useIsIOS } from '@/hooks/useIsIOS';
import type { LoginMethod } from '@/lib/analytics/events';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const LOGIN_PENDING_KEY = 'lokit:loginPending';

function markLoginPending(method: LoginMethod) {
  try {
    sessionStorage.setItem(LOGIN_PENDING_KEY, method);
  } catch {
    // ignore
  }
}

export default function LoginButtonClient() {
  const isIOS = useIsIOS();

  const handleKakaoLogin = () => {
    markLoginPending('kakao');
    window.location.href = `${apiBaseUrl}${API_URL.AUTH.KAKAO}`;
  };

  const handleAppleLogin = () => {
    markLoginPending('apple');
    window.location.href = `${apiBaseUrl}${API_URL.AUTH.APPLE}`;
  };

  return (
    <S.Wrapper>
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
    </S.Wrapper>
  );
}
