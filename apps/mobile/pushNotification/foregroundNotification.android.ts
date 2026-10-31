import notifee, { AndroidImportance, EventType, type Event } from '@notifee/react-native';
import type { RemoteMessage } from '@react-native-firebase/messaging';
import { getPushTargetPath } from '@repo/webview-bridge';

/**
 * Android는 앱이 포그라운드일 때 온 FCM notification 메시지를 OS가 띄워주지 않아서
 * notifee로 로컬 알림을 직접 띄운다. 백그라운드/종료 상태는 FCM이 자동으로 띄운다.
 */

// MainApplication에서 생성하는 IMPORTANCE_HIGH 채널과 같은 id (strings.xml default_notification_channel_id)
const CHANNEL_ID = 'default';

const pressListeners = new Set<(url: string) => void>();
// onForegroundEvent / onBackgroundEvent / getInitialNotification이 같은 탭을 중복으로 줄 수 있어 1회만 처리
let lastHandledNotificationId: string | undefined;

const handlePress = ({ type, detail }: Event) => {
  if (type !== EventType.PRESS) return;
  const { notification } = detail;
  if (!notification?.id || notification.id === lastHandledNotificationId) return;
  lastHandledNotificationId = notification.id;

  const url = getPushTargetPath(notification.data);
  if (url) pressListeners.forEach(listener => listener(url));
};

export const displayForegroundNotification = async (message: RemoteMessage) => {
  const { title, body } = message.notification ?? {};
  if (!title && !body) return;

  await notifee.createChannel({
    id: CHANNEL_ID,
    name: '기본 알림',
    importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    id: message.messageId,
    title,
    body,
    data: message.data,
    android: {
      channelId: CHANNEL_ID,
      smallIcon: 'ic_notification',
      color: '#6EEAE4',
      pressAction: { id: 'default' },
    },
  });
};

export const onForegroundNotificationPress = (listener: (url: string) => void) => {
  pressListeners.add(listener);
  const unsubscribe = notifee.onForegroundEvent(handlePress);
  return () => {
    pressListeners.delete(listener);
    unsubscribe();
  };
};

/** 포그라운드에서 띄운 알림을 앱 종료 후 탭해서 콜드 스타트된 경우 */
export const getInitialForegroundNotificationUrl = async () => {
  const initial = await notifee.getInitialNotification();
  const id = initial?.notification.id;
  if (!id || id === lastHandledNotificationId) return undefined;
  lastHandledNotificationId = id;
  return getPushTargetPath(initial.notification.data);
};

/** index.js에서 AppRegistry 등록 전에 호출 (앱이 백그라운드일 때 탭 이벤트 수신) */
export const registerBackgroundNotificationHandler = () => {
  notifee.onBackgroundEvent(async event => handlePress(event));
};
