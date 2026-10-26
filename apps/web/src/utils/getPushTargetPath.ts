/**
 * FCM data payload로 알림 탭 시 이동할 경로를 만든다.
 * data: { notifId, notifType, photoId, groupCount, targetAddress? } — 값은 모두 문자열
 * - photoId: 알림함 조회 API의 targetPhotoId와 같은 값이라, 알림함과 같은 사진 상세로 보낸다
 * - notifId: 사진 상세(useMarkPushNotificationAsRead)에서 읽음 처리에 쓴다
 * (앱 apps/mobile/pushNotification/getPushTargetPath.ts, 서비스워커 firebase-messaging-sw.js와
 *  같은 규칙이라 바꿀 때 같이 맞춘다)
 */
export const getPushTargetPath = (data?: Record<string, string>) => {
  const { photoId, notifId } = data ?? {};
  if (!photoId || !/^\d+$/.test(photoId)) return undefined;

  const path = `/photo/${photoId}`;
  return notifId ? `${path}?notifId=${encodeURIComponent(notifId)}` : path;
};
