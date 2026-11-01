import { useEffect } from 'react';
import { checkNotificationPermissionFromBridge } from '@/utils/bridge/checkNotificationPermissionFromBridge';
import { requestNotificationPermissionFromBridge } from '@/utils/bridge/requestNotificationPermissionFromBridge';

/**
 * 홈 화면 진입 시 디바이스 알림 권한을 동기화한다.
 * - 아직 한 번도 물어본 적 없는 경우(denied)에만 실제 요청을 트리거한다.
 * - 이미 응답한 적 있으면(granted/blocked 등) requestNotifications는 재프롬프트 없이
 *   즉시 현재 상태만 반환하므로, 매 세션 호출해도 안전하다.
 * - 기존에 이미 커플 연결된 유저도 홈에 올 때마다 이 훅을 거치므로 자연스럽게 백필된다.
 */
export const useNotificationPermissionSync = () => {
  useEffect(() => {
    (async () => {
      const status = await checkNotificationPermissionFromBridge();
      if (status === 'denied') {
        await requestNotificationPermissionFromBridge();
      }
    })();
  }, []);
};
