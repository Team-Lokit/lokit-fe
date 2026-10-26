/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundNotificationHandler } from './pushNotification/foregroundNotification';

// Android: 앱이 백그라운드일 때 notifee 알림 탭 이벤트를 받으려면 앱 등록 전에 핸들러가 있어야 한다
registerBackgroundNotificationHandler();

AppRegistry.registerComponent(appName, () => App);
