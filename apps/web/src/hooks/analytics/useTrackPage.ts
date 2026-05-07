'use client';

import type { EventName, EventParams } from '@/lib/analytics';
import { track } from '@/lib/analytics';
import { useEffect } from 'react';

/**
 * 페이지 진입 시 1회 트래킹.
 *
 * - key를 넘기면 key가 바뀔 때마다 재발송 (앨범·사진 상세처럼 ID별 트래킹)
 */
export function useTrackPage<E extends EventName>(
  event: E,
  params: EventParams<E> | null,
  key?: unknown,
): void {
  useEffect(() => {
    track(event, params);
  }, [event, params, key]);
}
