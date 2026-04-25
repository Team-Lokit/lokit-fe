interface WebViewBridge {
  isIOS: boolean;
  isAndroid: boolean;
}

declare global {
  interface Window {
    __BRIDGE__?: WebViewBridge;
  }
}

export {};
