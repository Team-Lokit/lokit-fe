// FCM 웹 푸시 백그라운드 메시지 처리용 서비스워커.
// 정적 파일이라 번들러의 env 치환이 적용되지 않아 config 값을 직접 넣는다.
// (Firebase 웹 config는 비공개 값이 아니라 클라이언트 번들에도 그대로 노출되는 값이라 안전하다)
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

const messaging = firebase.messaging();

// 앱이 백그라운드/닫힘 상태일 때 온 메시지 처리.
// data-only 메시지는 별도 notification 표시 로직이 필요할 수 있음 - 필요 시 여기서 추가.
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  if (!title) return;
  self.registration.showNotification(title, { body });
});
