import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

/**
 * 뒤로 갈 history가 없으면(앱 종료 상태에서 푸시 알림으로 바로 진입한 경우 등) 홈으로 이동한다.
 * history에 현재 화면을 남기지 않도록 replace한다.
 */
export const useGoBackOrHome = () => {
  const router = useRouter();

  return useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace(ROUTES.HOME);
  }, [router]);
};
