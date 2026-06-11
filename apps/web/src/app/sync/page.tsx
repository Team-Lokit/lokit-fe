'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveCoupleStatusCookie } from '@repo/api-client';
import { ROUTES } from '@/constants/routes';
import { COUPLE_STATUS_COOKIE } from '@/constants/cookie';
import { COUPLE_STATUS } from '@/constants/coupleStatus';
import { track, identify } from '@/lib/analytics';
import type { LoginMethod } from '@/lib/analytics/events';

const LOGIN_PENDING_KEY = 'lokit:loginPending';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const target = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return target ? decodeURIComponent(target.slice(name.length + 1)) : null;
}

function consumeLoginPending(): LoginMethod | null {
  try {
    const value = sessionStorage.getItem(LOGIN_PENDING_KEY);
    if (value === 'kakao' || value === 'apple') {
      sessionStorage.removeItem(LOGIN_PENDING_KEY);
      return value;
    }
  } catch {
    // ignore
  }
  return null;
}

function SyncContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sync = async () => {
      try {
        await saveCoupleStatusCookie();
      } catch {
        router.replace(ROUTES.ONBOARDING.START);
        return;
      }

      const loginMethod = consumeLoginPending();
      if (loginMethod) {
        const userId = searchParams.get('user_id');
        if (userId) identify(userId);

        // is_new_user는 백엔드가 redirect로 내려준 값을 우선 사용하고,
        // (미배포 등) 없을 때만 coupleStatus 기반 근사치로 폴백한다.
        const isNewUserParam = searchParams.get('is_new_user');
        const isNewUser =
          isNewUserParam !== null
            ? isNewUserParam === 'true'
            : readCookie(COUPLE_STATUS_COOKIE) === COUPLE_STATUS.NOT_COUPLED;

        track('login_success', {
          is_new_user: isNewUser,
          login_method: loginMethod,
        });
      }

      const redirect = searchParams.get('redirect') || ROUTES.HOME;
      router.replace(redirect);
    };

    void sync();
  }, [router, searchParams]);

  return null;
}

export default function SyncPage() {
  return (
    <Suspense>
      <SyncContent />
    </Suspense>
  );
}
