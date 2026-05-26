import { useCallback, useEffect, useState } from 'react';
import { useIsWebView } from '@/hooks/useIsWebView';
import { getCurrentPosition } from '@/utils/getCurrentPosition';

export const useLocationPermissionModal = () => {
  const isWebView = useIsWebView();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 모바일 앱은 네이티브 권한 플로우를 사용하므로 web 안내 모달을 띄우지 않는다.
    if (isWebView) return;

    (async () => {
      const position = await getCurrentPosition();
      if (!position) {
        setIsOpen(true);
      }
    })();
  }, [isWebView]);

  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, close };
};
