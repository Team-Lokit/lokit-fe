'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveCoupleStatusCookie } from '@repo/api-client';
import { COUPLE_STATUS_COOKIE } from '@/constants/cookie';

function getCookieValue(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

interface CoupleStatusSyncClientProps {
  /** 서버가 화면을 렌더링할 때 읽은 coupleStatus 쿠키 값 */
  renderedCoupleStatus: string | undefined;
}

/**
 * - coupleStatus 쿠키를 서버와 동기화하고, 화면을 그릴 때 쓴 값과 달라졌으면 다시 렌더링한다.
 * - 뒤로가기로 돌아오면 Next가 캐시된 예전 화면을 보여주므로(예: 연결 화면에서 연결 성공 후 복귀), 동기화 전후가 아니라 렌더링 당시 값과 비교한다.
 */
export default function CoupleStatusSyncClient({
  renderedCoupleStatus,
}: CoupleStatusSyncClientProps) {
  const router = useRouter();

  useEffect(() => {
    const syncCookie = async () => {
      try {
        await saveCoupleStatusCookie();
      } catch (error) {
        console.error('[CoupleStatusSyncClient] sync failed:', error);
        return;
      }

      if (getCookieValue(COUPLE_STATUS_COOKIE) !== renderedCoupleStatus) {
        router.refresh();
      }
    };

    void syncCookie();
  }, [router, renderedCoupleStatus]);

  return null;
}
