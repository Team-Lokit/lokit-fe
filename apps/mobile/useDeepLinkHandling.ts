import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import type WebView from 'react-native-webview';

export default function useDeepLinkHandling(webViewRef: React.RefObject<WebView | null>) {
  // 콜드 스타트 시점의 딥링크 (Linking.getInitialURL).
  // null = 아직 모름, undefined = 딥링크 없음(일반 실행).
  const [initialUrl, setInitialUrl] = useState<string | null | undefined>(null);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      setInitialUrl(url ?? undefined);
    });

    // 워밍 스타트(앱이 떠있을 때 새 딥링크) → WebView를 해당 URL로 이동
    const sub = Linking.addEventListener('url', ({ url }) => {
      webViewRef.current?.injectJavaScript(`
        window.__LOKIT_DEEPLINK__ = ${JSON.stringify(url)};
        window.location.href = ${JSON.stringify(url)};
        true;
      `);
    });

    return () => sub.remove();
  }, [webViewRef]);

  return { initialUrl };
}
