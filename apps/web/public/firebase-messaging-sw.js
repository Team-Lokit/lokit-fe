// FCM 웹 푸시 백그라운드 메시지 처리용 서비스워커.
// 정적 파일이라 번들러의 env 치환이 적용되지 않아 config 값을 직접 넣는다.
// (Firebase 웹 config는 비공개 값이 아니라 클라이언트 번들에도 그대로 노출되는 값이라 안전하다)

const NOTIFICATION_ICON = '/notification-icon.png';

// 새 버전이 배포되면 열린 탭을 다 닫을 때까지 기다리지 않고 바로 교체하고, 열려 있는 탭도 즉시 제어한다.
// (fetch 핸들러가 없는 푸시 전용 서비스워커라 즉시 교체해도 페이지 동작에 영향이 없다)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// notification 필드가 있는 메시지는 Firebase SDK가 직접 OS 알림을 띄운다(우리가 또 띄우면 중복).
// 서버 payload에 icon이 없으면 로고가 빠지므로, SDK가 호출하는 showNotification에 기본 아이콘을 채운다.
const originalShowNotification = self.registration.showNotification.bind(
  self.registration,
);
self.registration.showNotification = (title, options = {}) =>
  originalShowNotification(title, { icon: NOTIFICATION_ICON, ...options });

// 알림 탭 시 사진 상세로 이동 + 읽음 처리(notifId).
// 앱(apps/mobile/pushNotification/getPushTargetPath.ts)과 같은 규칙이라 바꿀 때 같이 맞춘다.
const getPushTargetPath = (data) => {
  const { photoId, notifId } = data ?? {};
  if (typeof photoId !== 'string' || !/^\d+$/.test(photoId)) return undefined;

  const path = `/photo/${photoId}`;
  return typeof notifId === 'string' && notifId
    ? `${path}?notifId=${encodeURIComponent(notifId)}`
    : path;
};

// usePushClickNavigation(apps/web/src/hooks)의 메시지 타입과 같아야 한다
const PUSH_CLICK_NAVIGATE_MESSAGE = 'LOKIT_PUSH_CLICK_NAVIGATE';

// 알림 클릭 1회에 창 조작(focus / openWindow)은 한 번만 허용된다.
// 그래서 열린 탭이 있으면 focus만 하고 이동은 창 조작 없이 처리한다.
const openPath = async (path) => {
  const url = new URL(path, self.location.origin).href;
  const isSameOrigin = (c) => new URL(c.url).origin === self.location.origin;

  // 이 서비스워커가 제어하는 탭이면 navigate로 바로 이동
  const controlled = (await self.clients.matchAll({ type: 'window' })).find(isSameOrigin);
  if (controlled) {
    await controlled.focus();
    await controlled.navigate(url);
    return;
  }

  // 서비스워커 등록 직후처럼 제어받지 않는 탭은 navigate가 안 되므로 페이지가 직접 이동하게 한다
  const uncontrolled = (
    await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  ).find(isSameOrigin);
  if (uncontrolled) {
    await uncontrolled.focus();
    uncontrolled.postMessage({ type: PUSH_CLICK_NAVIGATE_MESSAGE, url });
    return;
  }

  await self.clients.openWindow(url);
};

// Firebase SDK의 notificationclick 핸들러보다 먼저 등록해야 우리가 먼저 처리할 수 있다(importScripts 이전).
self.addEventListener('notificationclick', (event) => {
  // SDK가 띄운 알림은 원본 payload가 data.FCM_MSG 아래에 있다
  const payload = event.notification.data?.FCM_MSG;
  const path = getPushTargetPath(payload?.data ?? event.notification.data);
  if (!path) return;

  event.stopImmediatePropagation();
  event.notification.close();
  event.waitUntil(openPath(path));
});

importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAUwRg2lkERlxAqAO1a_Qqg26L3V2UJCho',
  authDomain: 'lokit-3bb57.firebaseapp.com',
  projectId: 'lokit-3bb57',
  storageBucket: 'lokit-3bb57.firebasestorage.app',
  messagingSenderId: '377573772797',
  appId: '1:377573772797:web:17fd9f9f7933b68c405d94',
});

// 백그라운드 메시지 표시는 SDK가 처리하므로 별도 onBackgroundMessage 핸들러는 두지 않는다.
firebase.messaging();
