import type { RefObject } from 'react';
import { requestNotifications } from 'react-native-permissions';
import type WebView from 'react-native-webview';
import {
  BRIDGE_MESSAGE_TYPES,
  type RequestNotificationPermissionRequest,
} from '@repo/webview-bridge';
import { sendResponse } from '../sendResponse';

export async function handleRequestNotificationPermission(
  webViewRef: RefObject<WebView | null>,
  request: RequestNotificationPermissionRequest,
) {
  const { requestId } = request;
  try {
    const { status } = await requestNotifications(['alert', 'sound', 'badge']);
    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.REQUEST_NOTIFICATION_PERMISSION_RESULT,
      requestId,
      status: 'success',
      permissionStatus: status,
    });
  } catch (e) {
    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.REQUEST_NOTIFICATION_PERMISSION_RESULT,
      requestId,
      status: 'error',
      error: e instanceof Error ? e.message : 'unknown error',
    });
  }
}
