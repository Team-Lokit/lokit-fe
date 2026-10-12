import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const getFirebaseApp = () =>
  getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * 포그라운드(탭이 열려있고 focus된 상태)에서 온 FCM 메시지를 구독한다.
 * 백그라운드는 서비스워커의 onBackgroundMessage가 처리하지만, 포그라운드는 Firebase가
 * 페이지 쪽으로 포워딩만 해줄 뿐 UI 표시는 직접 해야 해서 이 콜백에서 처리한다(예: 토스트).
 * 반환값은 unsubscribe 함수 — 호출부(useEffect)에서 cleanup 시 반드시 호출해야 리스너가 중복 등록되지 않는다.
 */
export const listenToForegroundMessages = async (
  onForegroundMessage: (payload: MessagePayload) => void,
): Promise<(() => void) | undefined> => {
  if (typeof window === 'undefined') return undefined;

  const supported = await isSupported().catch(() => false);
  if (!supported) return undefined;

  const messaging = getMessaging(getFirebaseApp());
  return onMessage(messaging, onForegroundMessage);
};

/**
 * 순수 웹(브라우저)에서 FCM 웹 푸시 토큰을 발급받는다.
 * - 브라우저가 푸시/서비스워커를 지원하지 않거나, 알림 권한을 거부하거나, 발급에 실패하면 null.
 * - 서비스워커(`/firebase-messaging-sw.js`)에는 이 config와 동일한 값을 하드코딩해뒀다
 *   (서비스워커는 정적 파일이라 번들러의 env 치환이 적용되지 않는다. Firebase config 값은
 *   비공개 값이 아니라 클라이언트 번들에 그대로 노출되는 값이라 하드코딩해도 안전하다).
 */
export const getWebDeviceToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
    );
    const messaging = getMessaging(getFirebaseApp());
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token || null;
  } catch {
    return null;
  }
};
