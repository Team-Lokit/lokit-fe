import type { RefObject } from 'react';
import type WebView from 'react-native-webview';
import { BRIDGE_MESSAGE_TYPES, type BridgeRequest } from '@repo/webview-bridge';
import { handlePickImage } from './handlePickImage';
import { handleCheckNotificationPermission } from './handleCheckNotificationPermission';
import { handleRequestNotificationPermission } from './handleRequestNotificationPermission';
import { handleOpenNotificationSettings } from './handleOpenNotificationSettings';

/**
 * 메시지 타입 -> 핸들러 매핑.
 * - 매핑 타입으로 정의해서 BRIDGE_MESSAGE_TYPES에 새 타입이 생기면 여기 항목 추가가 TS로 강제됨
 * - 핸들러 시그니처: request는 해당 타입으로 좁혀진 채 전달됨
 */
export type BridgeHandlerMap = {
  [K in BridgeRequest['type']]: (
    webViewRef: RefObject<WebView | null>,
    request: Extract<BridgeRequest, { type: K }>,
  ) => void | Promise<void>;
};

export const bridgeHandlers: BridgeHandlerMap = {
  [BRIDGE_MESSAGE_TYPES.PICK_IMAGE]: handlePickImage,
  [BRIDGE_MESSAGE_TYPES.CHECK_NOTIFICATION_PERMISSION]: handleCheckNotificationPermission,
  [BRIDGE_MESSAGE_TYPES.REQUEST_NOTIFICATION_PERMISSION]:
    handleRequestNotificationPermission,
  [BRIDGE_MESSAGE_TYPES.OPEN_NOTIFICATION_SETTINGS]: handleOpenNotificationSettings,
};
