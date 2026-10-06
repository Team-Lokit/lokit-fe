import { useEffect, useRef } from 'react';
import { Alert, Linking, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import BootSplash from 'react-native-bootsplash';
import { buildBridgeInjection } from './bridge/injection';
import useBridgeHandler from './bridge/useBridgeHandler';
import useAppLifecycleTracking from './useAppLifecycleTracking';
import useDeepLinkHandling from './useDeepLinkHandling';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';

/** 개발 환경에서 디버깅 콘솔 추가 */
const erudaScript = `
    (function () {
      var script = document.createElement('script');
      script.src = '//cdn.jsdelivr.net/npm/eruda';
      document.body.appendChild(script);
      script.onload = function () { 
        eruda.init(); 
      }
    })();
    true;
  `;

function App() {
  useEffect(() => {
    const hideSplash = async () => {
      await BootSplash.hide({ fade: true });
    };

    hideSplash();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <AppContent />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const defaultUrl = getWebAppUrl();
  const webViewRef = useRef<WebView>(null);
  const { onWebViewLoad } = useAppLifecycleTracking(webViewRef);
  const { initialUrl } = useDeepLinkHandling(webViewRef);
  const onBridgeMessage = useBridgeHandler(webViewRef);

  useEffect(() => {
    const messagingInstance = getMessaging();

    // 포그라운드 알림 수신
    const unsubscribe = onMessage(messagingInstance, async remoteMessage => {
      if (webViewRef.current) {
        // 객체를 반드시 JSON 문자열로 변환하여 전송해야 합니다 (postMessage 표준 스펙)
        const payload = {
          type: 'FCM_FOREGROUND_NOTIFICATION',
          title: remoteMessage.notification?.title || '',
          body: remoteMessage.notification?.body || '',
          url: remoteMessage.data?.url,
        };

        webViewRef.current.postMessage(JSON.stringify(payload));
      }
    });

    return () => unsubscribe();
  }, []);

  const onShouldStartLoadWithRequest = (request: {
    url: string;
    isTopFrame?: boolean;
  }) => {
    const { url, isTopFrame } = request;
    // iframe 로드(예: SDK가 만드는 about:blank)는 웹뷰 내부에서 처리
    if (isTopFrame === false) {
      return true;
    }
    if (/^(https?|about|data|blob|javascript):/i.test(url)) {
      return true;
    }
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
        Alert.alert('카카오톡 필요', '카카오톡이 설치되어 있지 않습니다.');
      })
      .catch(e => console.log('[onShouldStartLoadWithRequest] cannot open', url, e));
    return false;
  };

  // Linking이 resolve되기 전에는 WebView를 띄우지 않음(스플래시가 가려줌).
  // 콜드 스타트 딥링크는 buildBridgeInjection에서 페이지 로드 전 주입돼야 정확하다.
  if (initialUrl === null) {
    return <View style={styles.content} />;
  }

  const webUrl = initialUrl ?? defaultUrl;
  // RN의 URL 폴리필은 hostname을 지원하지 않아 정규식으로 호스트 판별
  const isDev = /^https?:\/\/(develop|local)\.lokit\.co\.kr(?=[:/?#]|$)/.test(webUrl);

  return (
    <View style={styles.content}>
      <WebView
        ref={webViewRef}
        source={{ uri: webUrl }}
        style={styles.webView}
        // Android 전용 옵션이며 기본값이 false라, 켜주지 않으면 WebView 내 navigator.geolocation이 동작하지 않음
        geolocationEnabled
        // iOS 16.4+에서 기본값이 false라, 켜주지 않으면 Safari 개발자 도구(Develop 메뉴)에 WebView가 안 뜬다
        webviewDebuggingEnabled={__DEV__}
        injectedJavaScriptBeforeContentLoaded={buildBridgeInjection(initialUrl)}
        onLoad={onWebViewLoad}
        onMessage={onBridgeMessage}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
          ${isDev ? erudaScript : ''}
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
    return 'https://lokit.co.kr';
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
