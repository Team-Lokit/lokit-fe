import { useEffect } from 'react';
import { useRegisterDeviceToken } from '@repo/api-client';
import { getDeviceTokenFromBridge } from '@/utils/bridge/getDeviceTokenFromBridge';
import { getWebDeviceToken } from '@/lib/firebase/messaging';
import { checkIsInWebView } from '@/utils/environment';

/**
 * 홈 화면 진입 시 FCM 디바이스 토큰을 발급받아 백엔드에 등록한다.
 * - 로그인 직후와 앱 실행 시마다 호출해도 되며 멱등하다(백엔드 문서 기준).
 * - 네이티브 앱(webview)이면 브릿지로, 순수 웹이면 Firebase JS SDK로 토큰을 받는다.
 * - 어느 경로든 토큰을 못 받으면(권한 거부, 미지원 브라우저 등) 그냥 아무 동작도 하지 않는다.
 */
export const useDeviceTokenSync = () => {
  const { mutate: registerDeviceToken } = useRegisterDeviceToken();

  useEffect(() => {
    (async () => {
      if (checkIsInWebView()) {
        const device = await getDeviceTokenFromBridge();
        if (!device) return;
        registerDeviceToken({ data: { token: device.token, platform: device.platform } });
        return;
      }

      const token = await getWebDeviceToken();
      if (!token) return;
      registerDeviceToken({ data: { token, platform: 'WEB' } });
    })();
  }, [registerDeviceToken]);
};
