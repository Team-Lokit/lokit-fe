'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveCoupleStatusCookie } from '@repo/api-client';
import { ROUTES } from '@/constants/routes';

export default function SyncPage() {
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

      const redirect = searchParams.get('redirect') || ROUTES.HOME;
      router.replace(redirect);
    };

    void sync();
  }, [router, searchParams]);

  return null;
}
