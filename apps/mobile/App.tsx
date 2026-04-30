import { useEffect, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import BootSplash from 'react-native-bootsplash';
import { buildBridgeInjection } from './bridge';
import useAppLifecycleTracking from './useAppLifecycleTracking';

function App() {
  useEffect(() => {
    const hideSplash = async () => {
      await BootSplash.hide({ fade: true });
    };

    hideSplash();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <AppContent />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const defaultUrl = getWebAppUrl();
  const webViewRef = useRef<WebView>(null);
  const { onWebViewLoad } = useAppLifecycleTracking(webViewRef);

  // 콜드 스타트 시점의 딥링크 (Linking.getInitialURL).
  // null = 아직 모름, undefined = 딥링크 없음(일반 실행).
  const [initialUrl, setInitialUrl] = useState<string | null | undefined>(null);
  const initialUrlRef = useRef<string | null>(null);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      initialUrlRef.current = url;
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
  }, []);

  // Linking이 resolve되기 전에는 WebView를 띄우지 않음(스플래시가 가려줌).
  // 콜드 스타트 딥링크는 buildBridgeInjection에서 페이지 로드 전 주입돼야 정확하다.
  if (initialUrl === null) {
    return <View style={styles.content} />;
  }

  return (
    <View style={styles.content}>
      <WebView
        ref={webViewRef}
        source={{ uri: initialUrl ?? defaultUrl }}
        style={styles.webView}
        injectedJavaScriptBeforeContentLoaded={buildBridgeInjection(initialUrl)}
        onLoad={onWebViewLoad}
        // dvh 단위가 모바일 웹뷰에서 제대로 작동하지 않는 문제를 해결
        injectedJavaScript={`
          (function() {
            var s = document.createElement('style');
            s.textContent = 'html, body, #__next { height: 100vh !important; min-height: 100vh !important; }';
            document.head.appendChild(s);
            document.querySelectorAll('[style]').forEach(function(el) {
              var st = el.getAttribute('style');
              if (st && st.indexOf('dvh') > -1) {
                el.setAttribute('style', st.replace(/\\d+dvh/g, function(m) { return m.replace('dvh', 'vh'); }));
              }
            });
            document.querySelectorAll('style').forEach(function(el) {
              if (el.textContent.indexOf('dvh') > -1) {
                el.textContent = el.textContent.replace(/\\d+dvh/g, function(m) { return m.replace('dvh', 'vh'); });
              }
            });
          })();
          true;
        `}
        onError={e => {
          console.log('WebView error', e.nativeEvent);
        }}
        onHttpError={e => {
          console.log('WebView http error', e.nativeEvent);
        }}
      />
    </View>
  );
}

function getWebAppUrl() {
  if (!__DEV__) {
    return 'https://develop.lokit.co.kr';
  }

  return (
    Platform.select({
      ios: 'https://local.lokit.co.kr:3000/',
      android: 'https://local.lokit.co.kr:3000',
      default: 'https://develop.lokit.co.kr',
    }) ?? 'https://develop.lokit.co.kr'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1014',
  },
  content: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default App;
