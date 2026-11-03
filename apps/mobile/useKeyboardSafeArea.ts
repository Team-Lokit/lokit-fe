import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import type WebView from 'react-native-webview';

/**
 * 키보드가 올라오면 홈 인디케이터가 가려지므로 웹의 --safe-area-inset-bottom을 0으로,
 * 내려가면 원래 inset으로 되돌린다.
 */
export default function useKeyboardSafeArea(
  webViewRef: React.RefObject<WebView | null>,
  bottomInset: number,
) {
  useEffect(() => {
    const setBottomInset = (px: number) => {
      webViewRef.current?.injectJavaScript(`
        document.documentElement &&
          document.documentElement.style.setProperty('--safe-area-inset-bottom', '${Math.round(px)}px');
        true;
      `);
    };

    // iOS는 Will 이벤트로 키보드 애니메이션 전에 반영할 수 있고, Android는 Did만 지원한다
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setBottomInset(0));
    const hideSub = Keyboard.addListener(hideEvent, () => setBottomInset(bottomInset));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [webViewRef, bottomInset]);
}
