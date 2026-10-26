import type { RemoteMessage } from '@react-native-firebase/messaging';

/**
 * iOS용 구현 (Android는 foregroundNotification.android.ts를 Metro가 대신 사용).
 * iOS는 firebase.json의 messaging_ios_foreground_presentation_options로 OS가 포그라운드
 * 배너를 직접 띄우고, 탭은 RNFB onNotificationOpenedApp으로 들어오므로 여기선 할 일이 없다.
 */
export const displayForegroundNotification = async (_message: RemoteMessage) => {};

export const onForegroundNotificationPress =
  (_listener: (url: string) => void) => () => {};

export const getInitialForegroundNotificationUrl = async (): Promise<
  string | undefined
> => undefined;

export const registerBackgroundNotificationHandler = () => {};
