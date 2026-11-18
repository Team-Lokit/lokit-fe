'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { useOnboardingContext } from './_contexts/OnboardingContext';

// TODO(#103): connect/verify가 한 페이지로 합쳐지면 이 순서 가드는 필요 없으므로 layout.tsx와 함께 제거한다.
export default function OnboardingLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { completedSteps } = useOnboardingContext();

  useEffect(() => {
    // connect 완료 전 verify 접근 금지
    if (pathname === ROUTES.ONBOARDING.VERIFY && !completedSteps.connect) {
      router.replace(ROUTES.ONBOARDING.CONNECT);
    }
  }, [pathname, completedSteps, router]);

  return <div>{children}</div>;
}
