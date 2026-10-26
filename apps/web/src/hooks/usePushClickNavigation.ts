import { useEffect } from 'react';

/** 서비스워커(firebase-messaging-sw.js)가 보내는 메시지 타입과 같아야 한다 */
export const PUSH_CLICK_NAVIGATE_MESSAGE = 'LOKIT_PUSH_CLICK_NAVIGATE';

/**
 * 브라우저 푸시 알림 클릭 시 서비스워커가 보낸 경로로 이동한다.
 * 서비스워커 등록 직후처럼 페이지가 아직 서비스워커의 제어를 받지 않으면 client.navigate()를
 * 쓸 수 없어서, 서비스워커가 postMessage로 경로를 넘기고 페이지가 직접 이동한다.
 */
export const usePushClickNavigation = () => {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== PUSH_CLICK_NAVIGATE_MESSAGE) return;
      const { url } = event.data as { url?: string };
      if (typeof url !== 'string') return;

      const target = new URL(url, window.location.origin);
      if (target.origin !== window.location.origin) return;
      window.location.assign(target.href);
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, []);
};
