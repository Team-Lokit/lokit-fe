import {
  BRIDGE_MESSAGE_TYPES,
  type RequestNotificationPermissionResponse,
  type NotificationPermissionStatus,
} from '@repo/webview-bridge';
import { callBridge } from './callBridge';

/**
 * 네이티브 브리지를 통해 디바이스 알림 권한을 실제로 요청한다(OS 시스템 프롬프트 트리거).
 * - iOS는 이 호출이 최소 한 번 있어야 기기 설정 > 알림 목록에 앱이 노출된다.
 * - 브리지가 없는 환경(순수 웹)에서는 아무 동작도 하지 않고 null을 반환한다.
 */
export const requestNotificationPermissionFromBridge =
  async (): Promise<NotificationPermissionStatus | null> => {
    try {
      const response = await callBridge<RequestNotificationPermissionResponse>({
        type: BRIDGE_MESSAGE_TYPES.REQUEST_NOTIFICATION_PERMISSION,
      });
      return response?.permissionStatus ?? null;
    } catch {
      return null;
    }
  };
