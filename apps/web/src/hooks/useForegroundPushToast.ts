import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast';
import { listenToForegroundMessages } from '@/lib/firebase/messaging';
import { checkIsInWebView } from '@/utils/environment';
import { getPushTargetPath } from '@repo/webview-bridge';

// OS 알림 배너처럼 눌러서 이동할 수 있도록 기본(3초)보다 조금 길게 보여준다
const PUSH_TOAST_DURATION = 5000;

/**
 * 순수 웹에서 탭이 focus된 상태로 FCM 메시지를 받으면 토스트로 보여준다.
 * - 토스트를 누르면 앱과 같이 사진 상세로 이동한다(읽음 처리 포함).
 * - 백그라운드(탭이 닫혀있거나 focus 아님)는 서비스워커가 OS 알림으로 처리한다.
 * - 웹뷰(네이티브 앱)는 OS 레벨 푸시 배너를 그대로 쓰므로 이 훅에서는 건드리지 않는다.
 */
export const useForegroundPushToast = () => {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (checkIsInWebView()) return;

    let unsubscribe: (() => void) | undefined;

    listenToForegroundMessages((payload) => {
      const { title, body } = payload.notification ?? {};
      // title이 없으면 body를 한 줄로 보여준다
      const message = title || body;
      if (!message) return;

      const path = getPushTargetPath(payload.data);
      showToast(message, PUSH_TOAST_DURATION, undefined, undefined, {
        description: title ? body : undefined,
        onClick: path ? () => router.push(path) : undefined,
      });
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe?.();
  }, [showToast, router]);
};
