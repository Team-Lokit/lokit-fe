import type { RegisterDeviceTokenRequestPlatform } from '@repo/api-client';
import { getWebDeviceToken } from '@/lib/firebase/messaging';
import { getDeviceTokenFromBridge } from '@/utils/bridge/getDeviceTokenFromBridge';
import { checkIsInWebView } from '@/utils/environment';

export interface DeviceToken {
  token: string;
  platform: RegisterDeviceTokenRequestPlatform;
}

interface GetDeviceTokenOptions {
  /** 순수 웹에서 알림 권한이 아직 없을 때 권한 팝업을 띄울지 여부 (기본 true) */
  requestPermission?: boolean;
}

/**
 * 현재 기기의 FCM 디바이스 토큰을 조회한다.
 * - 네이티브 앱(webview)이면 브릿지로, 순수 웹이면 Firebase JS SDK로 토큰을 받는다.
 * - 토큰을 못 받으면(권한 거부, 미지원 브라우저, 발급 실패 등) null을 반환한다.
 */
export const getDeviceToken = async ({
  requestPermission = true,
}: GetDeviceTokenOptions = {}): Promise<DeviceToken | null> => {
  if (checkIsInWebView()) {
    return getDeviceTokenFromBridge();
  }

  const token = await getWebDeviceToken({ requestPermission });
  if (!token) return null;
  return { token, platform: 'WEB' };
};
