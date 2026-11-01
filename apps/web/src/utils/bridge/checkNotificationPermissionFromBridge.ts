import {
  BRIDGE_MESSAGE_TYPES,
  type CheckNotificationPermissionResponse,
  type NotificationPermissionStatus,
} from '@repo/webview-bridge';
import { callBridge } from './callBridge';

/**
 * 네이티브 브리지를 통해 디바이스 알림 권한 상태를 조회한다.
 * - 브리지가 없는 환경(순수 웹)에서는 확인 자체가 불가하므로 null을 반환한다.
 *   호출 측에서 null은 "권한 켜짐"과 동일하게(배너 숨김) 취급해야 한다.
 */
export const checkNotificationPermissionFromBridge =
  async (): Promise<NotificationPermissionStatus | null> => {
    try {
      const response = await callBridge<CheckNotificationPermissionResponse>({
        type: BRIDGE_MESSAGE_TYPES.CHECK_NOTIFICATION_PERMISSION,
      });
      return response?.permissionStatus ?? null;
    } catch {
      return null;
    }
  };
