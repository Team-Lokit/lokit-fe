import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import type WebView from 'react-native-webview';

/**
 * 키보드가 올라오면 홈 인디케이터가 가려지므로 웹의 --safe-area-inset-bottom을 0으로,
 * 내려가면 원래 inset으로 되돌린다.
 *
 * Android는 edge-to-edge(edgeToEdgeEnabled=true)라 adjustResize가 윈도우를 줄여주지 않아
 * 키보드가 WebView를 덮는다. 그래서 키보드가 차지하는 높이를 반환해 WebView 컨테이너의
 * paddingBottom으로 쓰게 한다. (iOS는 WKWebView가 자체적으로 처리하므로 항상 0)
 */
export default function useKeyboardSafeArea(
  webViewRef: React.RefObject<WebView | null>,
  bottomInset: number,
) {
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  useEffect(() => {
    const setBottomInset = (px: number) => {
      webViewRef.current?.injectJavaScript(`
        document.documentElement &&
          document.documentElement.style.setProperty('--safe-area-inset-bottom', '${Math.round(
            px,
          )}px');
        true;
      `);
    };

    // iOS는 Will 이벤트로 키보드 애니메이션 전에 반영할 수 있고, Android는 Did만 지원한다
    const isIOS = Platform.OS === 'ios';
    const showEvent = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIOS ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setBottomInset(0);
      if (!isIOS) {
        setKeyboardPadding(e.endCoordinates.height + bottomInset);
      }
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setBottomInset(bottomInset);
      setKeyboardPadding(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [webViewRef, bottomInset]);

  return { keyboardPadding };
}
