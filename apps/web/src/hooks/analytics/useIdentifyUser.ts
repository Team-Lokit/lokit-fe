'use client';

import { useEffect, useRef } from 'react';
import { identify } from '@/lib/analytics';

/**
 * 세션 시작 시 유저를 Mixpanel에 재식별한다.
 * - 로그인 직후 1회 identify는 /sync에서 처리되지만, Mixpanel 익명 ID가
 *   WebView 스토리지 eviction 등으로 초기화될 수 있어, 항상 호출되는
 *   데이터(/map/me)의 userId로 매 세션 다시 식별한다.
 * - 같은 userId로의 중복 호출은 ref로 막는다.
 */
export function useIdentifyUser(userId?: number | null) {
  const lastIdentified = useRef<number | null>(null);

  useEffect(() => {
    if (userId == null || lastIdentified.current === userId) return;
    lastIdentified.current = userId;
    identify(String(userId));
  }, [userId]);
}
