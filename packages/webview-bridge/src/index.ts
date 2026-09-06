/**
 * WebView <-> Native 메시지 프로토콜 공유 정의.
 * - 웹/네이티브 양쪽이 동일한 타입과 상수를 참조해 드리프트를 방지한다.
 * - 새 메시지 타입 추가 시 BRIDGE_MESSAGE_TYPES와 해당 Request/Response 인터페이스를 함께 추가.
 */

import type { GpsCoordinates } from './utils/parseGpsFromExif';

export const BRIDGE_MESSAGE_TYPES = {
  PICK_IMAGE: 'PICK_IMAGE',
  PICK_IMAGE_RESULT: 'PICK_IMAGE_RESULT',
  CHECK_NOTIFICATION_PERMISSION: 'CHECK_NOTIFICATION_PERMISSION',
  CHECK_NOTIFICATION_PERMISSION_RESULT: 'CHECK_NOTIFICATION_PERMISSION_RESULT',
  REQUEST_NOTIFICATION_PERMISSION: 'REQUEST_NOTIFICATION_PERMISSION',
  REQUEST_NOTIFICATION_PERMISSION_RESULT: 'REQUEST_NOTIFICATION_PERMISSION_RESULT',
  OPEN_NOTIFICATION_SETTINGS: 'OPEN_NOTIFICATION_SETTINGS',
  OPEN_NOTIFICATION_SETTINGS_RESULT: 'OPEN_NOTIFICATION_SETTINGS_RESULT',
} as const;

export type BridgeMessageType =
  (typeof BRIDGE_MESSAGE_TYPES)[keyof typeof BRIDGE_MESSAGE_TYPES];

export type BridgeStatus = 'success' | 'cancelled' | 'error';

export type PickImageSource = 'library' | 'camera';

export interface PickImageOptions {
  /** 'library' = 갤러리에서 선택, 'camera' = 카메라로 촬영. 기본값 'library' */
  source?: PickImageSource;
  selectionLimit?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface PickImageRequest {
  type: typeof BRIDGE_MESSAGE_TYPES.PICK_IMAGE;
  requestId: string;
  options?: PickImageOptions;
}

export interface PickedAsset {
  /** base64 data URL (e.g. "data:image/jpeg;base64,...") */
  uri: string;
  fileName: string;
  type: string;
  fileSize?: number;
  width?: number;
  height?: number;
  /**
   * 원본 사진 EXIF에서 추출한 촬영 위치
   * - 네이티브 리사이즈 시 EXIF GPS가 소실되므로, 원본에서 뽑아 실어 보낸다.
   */
  location?: GpsCoordinates;
  /**
   * 원본 사진의 촬영 일시 (ISO 8601)
   * - 리사이즈본은 촬영일 메타데이터가 없으므로, 원본에서 뽑아 실어 보낸다.
   */
  takenAt?: string;
}

export interface PickImageResponse {
  type: typeof BRIDGE_MESSAGE_TYPES.PICK_IMAGE_RESULT;
  requestId: string;
  status: BridgeStatus;
  assets?: PickedAsset[];
  error?: string;
}

/**
 * react-native-permissions의 PermissionStatus와 동일한 값셋.
 * - unavailable: 기기가 해당 권한 자체를 지원하지 않음
 * - denied: 아직 승인되지 않았지만 재요청 가능한 상태.
 *   iOS는 정말 한 번도 응답한 적 없는 최초 상태만 여기 해당하고, 응답 후엔 granted/blocked로 넘어가 다시 돌아오지 않는다.
 *   Android 13+(POST_NOTIFICATIONS)는 "한 번도 안 물어봄"과 "거부했지만 재요청 가능"을 둘 다 denied로 취급한다.
 *   Android 13 미만은 런타임 권한 자체가 없어 denied가 사실상 발생하지 않는다(기본 granted, 끄면 blocked).
 * - blocked: 사용자가 명시적으로 꺼둠 - 앱에서 재요청 불가, 기기 설정에서만 허용 가능
 * - granted / limited: 알림 수신 가능
 */
export type NotificationPermissionStatus =
  | 'unavailable'
  | 'denied'
  | 'blocked'
  | 'granted'
  | 'limited';

export interface CheckNotificationPermissionRequest {
  type: typeof BRIDGE_MESSAGE_TYPES.CHECK_NOTIFICATION_PERMISSION;
  requestId: string;
}

export interface CheckNotificationPermissionResponse {
  type: typeof BRIDGE_MESSAGE_TYPES.CHECK_NOTIFICATION_PERMISSION_RESULT;
  requestId: string;
  status: BridgeStatus;
  permissionStatus?: NotificationPermissionStatus;
  error?: string;
}

export interface RequestNotificationPermissionRequest {
  type: typeof BRIDGE_MESSAGE_TYPES.REQUEST_NOTIFICATION_PERMISSION;
  requestId: string;
}

export interface RequestNotificationPermissionResponse {
  type: typeof BRIDGE_MESSAGE_TYPES.REQUEST_NOTIFICATION_PERMISSION_RESULT;
  requestId: string;
  status: BridgeStatus;
  permissionStatus?: NotificationPermissionStatus;
  error?: string;
}

export interface OpenNotificationSettingsRequest {
  type: typeof BRIDGE_MESSAGE_TYPES.OPEN_NOTIFICATION_SETTINGS;
  requestId: string;
}

export interface OpenNotificationSettingsResponse {
  type: typeof BRIDGE_MESSAGE_TYPES.OPEN_NOTIFICATION_SETTINGS_RESULT;
  requestId: string;
  status: BridgeStatus;
  error?: string;
}

export type BridgeRequest =
  | PickImageRequest
  | CheckNotificationPermissionRequest
  | RequestNotificationPermissionRequest
  | OpenNotificationSettingsRequest;
export type BridgeResponse =
  | PickImageResponse
  | CheckNotificationPermissionResponse
  | RequestNotificationPermissionResponse
  | OpenNotificationSettingsResponse;

export { parseGpsFromExif, type GpsCoordinates } from './utils/parseGpsFromExif';
