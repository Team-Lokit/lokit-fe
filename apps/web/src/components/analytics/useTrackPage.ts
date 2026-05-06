'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import type { EventName, EventParams } from '@/lib/analytics';

const UNTRACKED = Symbol('untracked');

/**
 * 페이지 진입 시 1회 트래킹.
 *
 * - params가 null이면 데이터 미준비로 간주하고 발송을 보류함
 * - key를 넘기면 key가 바뀔 때마다 재발송 (앨범·사진 상세처럼 ID별 트래킹)
 */
export function useTrackPage<E extends EventName>(
  event: E,
  params: EventParams<E> | null,
  key?: unknown,
): void {
  const trackedKeyRef = useRef<unknown>(UNTRACKED);

  useEffect(() => {
    if (params === null) return;
    if (trackedKeyRef.current === key) return;
    trackedKeyRef.current = key;
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
}
