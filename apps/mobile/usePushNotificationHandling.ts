import { useEffect, useState } from 'react';
import type WebView from 'react-native-webview';
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
} from '@react-native-firebase/messaging';
import { getPushTargetPath } from '@repo/webview-bridge';
import {
  displayForegroundNotification,
  getInitialForegroundNotificationUrl,
  onForegroundNotificationPress,
} from './pushNotification/foregroundNotification';

/**
 * 푸시 알림 표시/탭 처리.
 * - 백그라운드/종료: FCM이 OS 알림을 자동으로 띄운다.
 * - 포그라운드: iOS는 firebase.json 설정으로 OS 배너, Android는 notifee로 로컬 알림을 띄운다.
 *   (앱에선 OS 알림만 쓰고 웹 토스트는 띄우지 않는다)
 * - 알림 탭: data.photoId가 있으면 WebView를 해당 사진 상세로 이동한다.
 */
export default function usePushNotificationHandling(
  webViewRef: React.RefObject<WebView | null>,
  baseUrl: string,
) {
  // 콜드 스타트 시 알림 탭으로 진입한 경우의 URL.
  // null = 아직 모름, undefined = 알림으로 진입하지 않음.
  const [initialPushUrl, setInitialPushUrl] = useState<string | null | undefined>(null);

  useEffect(() => {
    const messaging = getMessaging();

    Promise.all([
      getInitialNotification(messaging).then(message => getPushTargetPath(message?.data)),
      getInitialForegroundNotificationUrl(),
    ])
      .then(([remoteUrl, localUrl]) => {
        const url = remoteUrl ?? localUrl;
        setInitialPushUrl(url ? resolvePushUrl(url, baseUrl) : undefined);
      })
      .catch(() => setInitialPushUrl(undefined));

    const navigate = (url: string) => {
      const target = resolvePushUrl(url, baseUrl);
      webViewRef.current?.injectJavaScript(`
        window.location.href = ${JSON.stringify(target)};
        true;
      `);
    };

    const unsubscribeMessage = onMessage(messaging, displayForegroundNotification);
    const unsubscribeOpened = onNotificationOpenedApp(messaging, message => {
      const url = getPushTargetPath(message.data);
      if (url) navigate(url);
    });
    const unsubscribePress = onForegroundNotificationPress(navigate);

    return () => {
      unsubscribeMessage();
      unsubscribeOpened();
      unsubscribePress();
    };
  }, [webViewRef, baseUrl]);

  return { initialPushUrl };
}

// 경로('/photo/1')를 웹 origin 기준 절대 URL로 맞춘다.
// RN의 URL 폴리필은 상대 경로 resolve를 지원하지 않아 문자열로 처리한다.
function resolvePushUrl(url: string, baseUrl: string) {
  if (/^https?:\/\//i.test(url)) return url;
  const origin = baseUrl.match(/^https?:\/\/[^/?#]+/i)?.[0] ?? baseUrl;
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}
