'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { useTrackPage } from '@/hooks/analytics/useTrackPage';
import { resolveLoginReferrer } from '@/utils/resolveLoginReferrer';

export default function LoginTrackerClient() {
  useTrackPage('screen_view_login', { referrer: resolveLoginReferrer() });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('error');

    if (errorCode) {
      track('login_fail', {
        error_code: errorCode,
        error_message: params.get('error_message') ?? '',
      });
    }
  }, []);

  return null;
}
