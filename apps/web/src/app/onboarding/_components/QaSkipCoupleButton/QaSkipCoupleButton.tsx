'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCouplePartner } from '@repo/api-client';
import { useToast } from '@/components/toast';
import { ROUTES } from '@/constants/routes';
import { useIsDevHost } from '@/hooks/useIsDevHost';
import { useOnboardingContext } from '../../_contexts/OnboardingContext';
import * as S from './QaSkipCoupleButton.styles';

/**
 * QA용: 테스트 파트너와 커플을 연결하고 바로 홈으로 이동하는 버튼 (개발 환경 호스트에서만 노출)
 * - 파트너 생성 API가 커플 연결과 coupleStatus 쿠키 설정까지 처리한다
 */
const QaSkipCoupleButton = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const isDevHost = useIsDevHost();
  const { markStepCompleted } = useOnboardingContext();
  const [isSkipping, setIsSkipping] = useState(false);

  const handleClick = useCallback(async () => {
    if (isSkipping) return;
    setIsSkipping(true);
    try {
      await createCouplePartner();
      showToast('QA 파트너와 연결됐어요', 3000, 'success');
      markStepCompleted('connect');
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error('QA 커플 연결 실패:', error);
      showToast('QA 커플 연결에 실패했어요', 3000, 'warn');
      setIsSkipping(false);
    }
  }, [isSkipping, markStepCompleted, router, showToast]);

  if (!isDevHost) return null;

  return (
    <S.Button onClick={handleClick} disabled={isSkipping}>
      QA: 커플 연결 건너뛰기
    </S.Button>
  );
};

export default QaSkipCoupleButton;
