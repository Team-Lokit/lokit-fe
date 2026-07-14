'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { ONBOARDING_START_REDIRECT_DELAY } from '@/constants/onboarding';
import * as S from './page.styles';
import { useGetMyPage } from '@repo/api-client/src/generated';

export default function OnboardingPage() {
  const router = useRouter();

  const { data: myPageData, isLoading } = useGetMyPage();
  const nickname = myPageData?.myName;

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (nickname) {
        router.push(ROUTES.ONBOARDING.CONNECT);
      } else {
        router.push(ROUTES.ONBOARDING.PROFILE);
      }
    }, ONBOARDING_START_REDIRECT_DELAY);

    return () => clearTimeout(timer);
  }, [isLoading, nickname, router]);

  return (
    <S.Wrapper>
      <S.Content>
        <S.Title>만나서 반가워요!</S.Title>
      </S.Content>
    </S.Wrapper>
  );
}
