import type { RefObject } from 'react';
import { openSettings } from 'react-native-permissions';
import type WebView from 'react-native-webview';
import {
  BRIDGE_MESSAGE_TYPES,
  type OpenNotificationSettingsRequest,
} from '@repo/webview-bridge';
import { sendResponse } from '../sendResponse';

export async function handleOpenNotificationSettings(
  webViewRef: RefObject<WebView | null>,
  request: OpenNotificationSettingsRequest,
) {
  const { requestId } = request;
  try {
    await openSettings();
    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.OPEN_NOTIFICATION_SETTINGS_RESULT,
      requestId,
      status: 'success',
    });
  } catch (e) {
    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.OPEN_NOTIFICATION_SETTINGS_RESULT,
      requestId,
      status: 'error',
      error: e instanceof Error ? e.message : 'unknown error',
    });
  }
}
