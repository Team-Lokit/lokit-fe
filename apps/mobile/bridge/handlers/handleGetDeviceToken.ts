import type { RefObject } from 'react';
import { Platform } from 'react-native';
import type WebView from 'react-native-webview';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';
import {
  BRIDGE_MESSAGE_TYPES,
  type GetDeviceTokenRequest,
  type DeviceTokenPlatform,
} from '@repo/webview-bridge';
import { sendResponse } from '../sendResponse';

export async function handleGetDeviceToken(
  webViewRef: RefObject<WebView | null>,
  request: GetDeviceTokenRequest,
) {
  const { requestId } = request;
  try {
    const messaging = getMessaging(getApp());
    // iOS는 APNs 등록이 먼저 돼야 FCM 토큰을 받을 수 있다. 이미 등록돼 있으면 no-op.
    await registerDeviceForRemoteMessages(messaging);
    const token = await getToken(messaging);
    const platform: DeviceTokenPlatform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';

    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.GET_DEVICE_TOKEN_RESULT,
      requestId,
      status: 'success',
      token,
      platform,
    });
  } catch (e) {
    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.GET_DEVICE_TOKEN_RESULT,
      requestId,
      status: 'error',
      error: e instanceof Error ? e.message : 'unknown error',
    });
  }
}
