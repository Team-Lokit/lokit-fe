'use client';

import { useEffect } from 'react';
import { initMixpanel, track } from '@/lib/analytics';
import type { EventName, EventParams } from '@/lib/analytics';

declare global {
  interface Window {
    /**
     * RN 웹뷰에서 호출하는 진입점.
     * 네이티브 라이프사이클(앱 실행/백그라운드)을 RN이 감지해
     * 이 함수로 매개변수를 채워 넘긴다.
     *
     * @example (RN side)
     *   webview.injectJavaScript(
     *     `window.lokitTrack && window.lokitTrack('app_open', { is_first_open: false, days_since_last_open: 1 });`
     *   );
     */
    lokitTrack?: <E extends EventName>(event: E, params: EventParams<E>) => void;
  }
}

export function useInitAnalytics() {
  useEffect(() => {
    initMixpanel();
    window.lokitTrack = track;
    return () => {
      delete window.lokitTrack;
    };
  }, []);
}
