import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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
      android: 'http://10.0.2.2:3000',
      default: 'https://develop.lokit.co.kr',
    }) ?? 'https://develop.lokit.co.kr'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default App;
