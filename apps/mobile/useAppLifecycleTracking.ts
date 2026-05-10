import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RefObject } from 'react';
import type WebView from 'react-native-webview';

const STORAGE_KEY = 'lokit:appOpenMeta';
const DAY_MS = 24 * 60 * 60 * 1000;

type AppOpenMeta = {
  hasOpenedBefore: boolean;
  lastOpenedAt: number;
};

async function readMeta(): Promise<AppOpenMeta | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppOpenMeta) : null;
  } catch {
    return null;
  }
}

async function writeMeta(meta: AppOpenMeta): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  } catch {
    // 저장 실패 시 다음 실행에 다시 시도
  }
}

function injectTrack(
  webViewRef: RefObject<WebView | null>,
  event: string,
  params: Record<string, unknown>,
) {
  webViewRef.current?.injectJavaScript(`
    window.lokitTrack && window.lokitTrack(${JSON.stringify(event)}, ${JSON.stringify(params)});
    true;
  `);
}

export default function useAppLifecycleTracking(
  webViewRef: RefObject<WebView | null>,
) {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const sessionStartedAt = useRef<number | null>(null);
  const isWebViewReady = useRef(false);
  const pending = useRef<Array<() => void>>([]);

  // WebView가 로드되기 전에 발생한 이벤트는 큐에 쌓아두고, 로드 완료 시 flush.
  // window.lokitTrack 은 AnalyticsProvider 마운트 후에만 정의되기 때문.
  const runOrQueue = useCallback((task: () => void) => {
    if (isWebViewReady.current) {
      task();
    } else {
      pending.current.push(task);
    }
  }, []);

  const onWebViewLoad = useCallback(() => {
    isWebViewReady.current = true;
    const queued = pending.current;
    pending.current = [];
    queued.forEach((task) => task());
  }, []);

  useEffect(() => {
    const fireAppOpen = async () => {
      const meta = await readMeta();
      const now = Date.now();

      const isFirstOpen = !meta?.hasOpenedBefore;
      const daysSinceLastOpen = meta?.lastOpenedAt
        ? Math.floor((now - meta.lastOpenedAt) / DAY_MS)
        : 0;

      runOrQueue(() => {
        injectTrack(webViewRef, 'app_open', {
          is_first_open: isFirstOpen,
          days_since_last_open: daysSinceLastOpen,
        });
      });

      sessionStartedAt.current = now;
      await writeMeta({ hasOpenedBefore: true, lastOpenedAt: now });
    };

    const fireAppBackground = () => {
      const startedAt = sessionStartedAt.current;
      const sessionDurationMs = startedAt ? Date.now() - startedAt : 0;
      sessionStartedAt.current = null;

      runOrQueue(() => {
        injectTrack(webViewRef, 'app_background', {
          session_duration_ms: sessionDurationMs,
          screens_viewed: 0,
          photos_uploaded: 0,
        });
      });
    };

    const handleChange = (next: AppStateStatus) => {
      const prev = appState.current;
      if (prev.match(/inactive|background/) && next === 'active') {
        fireAppOpen();
      } else if (prev === 'active' && next.match(/inactive|background/)) {
        fireAppBackground();
      }
      appState.current = next;
    };

    const subscription = AppState.addEventListener('change', handleChange);

    fireAppOpen();

    return () => subscription.remove();
  }, [runOrQueue, webViewRef]);

  return { onWebViewLoad };
}
