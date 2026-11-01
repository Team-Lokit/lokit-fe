import {
  BRIDGE_MESSAGE_TYPES,
  type OpenNotificationSettingsResponse,
} from '@repo/webview-bridge';
import { callBridge } from './callBridge';

/**
 * 네이티브 브리지를 통해 기기의 알림 설정 화면을 연다.
 * - 브리지가 없는 환경(순수 웹)에서는 아무 동작도 하지 않는다.
 */
export const openNotificationSettingsFromBridge = async (): Promise<void> => {
  try {
    await callBridge<OpenNotificationSettingsResponse>({
      type: BRIDGE_MESSAGE_TYPES.OPEN_NOTIFICATION_SETTINGS,
    });
  } catch {
    // 브리지 미가용(순수 웹) - 무시
  }
};
