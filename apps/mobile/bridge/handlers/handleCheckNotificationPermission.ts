import type { RefObject } from 'react';
import { checkNotifications } from 'react-native-permissions';
import type WebView from 'react-native-webview';
import {
  BRIDGE_MESSAGE_TYPES,
  type CheckNotificationPermissionRequest,
} from '@repo/webview-bridge';
import { sendResponse } from '../sendResponse';

export async function handleCheckNotificationPermission(
  webViewRef: RefObject<WebView | null>,
  request: CheckNotificationPermissionRequest,
) {
  const { requestId } = request;
  try {
    const { status } = await checkNotifications();
    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.CHECK_NOTIFICATION_PERMISSION_RESULT,
      requestId,
      status: 'success',
      permissionStatus: status,
    });
  } catch (e) {
    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.CHECK_NOTIFICATION_PERMISSION_RESULT,
      requestId,
      status: 'error',
      error: e instanceof Error ? e.message : 'unknown error',
    });
  }
}
