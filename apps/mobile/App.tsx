import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import BootSplash from 'react-native-bootsplash';
import { buildBridgeInjection } from './bridge';

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
  const webAppUrl = getWebAppUrl();

  return (
    <View style={styles.content}>
      <WebView
        source={{ uri: webAppUrl }}
        style={styles.webView}
        injectedJavaScriptBeforeContentLoaded={buildBridgeInjection()}
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
