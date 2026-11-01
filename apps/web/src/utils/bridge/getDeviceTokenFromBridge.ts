import {
  BRIDGE_MESSAGE_TYPES,
  type GetDeviceTokenResponse,
  type DeviceTokenPlatform,
} from '@repo/webview-bridge';
import { callBridge } from './callBridge';

export interface DeviceToken {
  token: string;
  platform: DeviceTokenPlatform;
}

/**
 * 네이티브 브리지를 통해 FCM 디바이스 토큰을 조회한다.
 * - 브리지가 없는 환경(순수 웹)이거나 발급 실패 시 null을 반환한다.
 */
export const getDeviceTokenFromBridge = async (): Promise<DeviceToken | null> => {
  try {
    const response = await callBridge<GetDeviceTokenResponse>({
      type: BRIDGE_MESSAGE_TYPES.GET_DEVICE_TOKEN,
    });
    if (!response?.token || !response.platform) return null;
    return { token: response.token, platform: response.platform };
  } catch {
    return null;
  }
};
