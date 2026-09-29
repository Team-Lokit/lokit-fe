import { useEffect } from 'react';
import { useToast } from '@/components/toast';
import { listenToForegroundMessages } from '@/lib/firebase/messaging';
import { checkIsInWebView } from '@/utils/environment';

/**
 * 순수 웹에서 탭이 focus된 상태로 FCM 메시지를 받으면 토스트로 보여준다.
 * - 백그라운드(탭이 닫혀있거나 focus 아님)는 서비스워커의 onBackgroundMessage가 OS 알림으로 처리한다.
 * - 웹뷰(네이티브 앱)는 OS 레벨 푸시 배너를 그대로 쓰므로 이 훅에서는 건드리지 않는다.
 */
export const useForegroundPushToast = () => {
  const { showToast } = useToast();

  useEffect(() => {
    if (checkIsInWebView()) return;

    let unsubscribe: (() => void) | undefined;

    listenToForegroundMessages((payload) => {
      const message = payload.notification?.title ?? payload.notification?.body;
      if (!message) return;
      showToast(message);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe?.();
  }, [showToast]);
};
