/**
 * FCM data payload로 알림 탭 시 이동할 웹 경로를 만든다.
 * data: { notifId, notifType, photoId, groupCount, targetAddress? } — 값은 모두 문자열
 * - photoId: 알림함 조회 API의 targetPhotoId와 같은 값이라, 알림함과 같은 사진 상세로 보낸다
 * - notifId: 사진 상세(useMarkPushNotificationAsRead)에서 읽음 처리에 쓴다
 * (웹 서비스워커 firebase-messaging-sw.js는 이 패키지를 import할 수 없어 같은 규칙을 따로 두고 있으니
 *  바꿀 때 같이 맞춘다)
 */
export const getPushTargetPath = (data?: Record<string, unknown>) => {
  const { photoId, notifId } = data ?? {};
  if (typeof photoId !== 'string' || !/^\d+$/.test(photoId)) return undefined;

  const path = `/photo/${photoId}`;
  return typeof notifId === 'string' && notifId
    ? `${path}?notifId=${encodeURIComponent(notifId)}`
    : path;
};
