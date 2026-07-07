/**
 * WebView <-> Native 메시지 프로토콜 공유 정의.
 * - 웹/네이티브 양쪽이 동일한 타입과 상수를 참조해 드리프트를 방지한다.
 * - 새 메시지 타입 추가 시 BRIDGE_MESSAGE_TYPES와 해당 Request/Response 인터페이스를 함께 추가.
 */

import type { GpsCoordinates } from './utils/parseGpsFromExif';

export const BRIDGE_MESSAGE_TYPES = {
  PICK_IMAGE: 'PICK_IMAGE',
  PICK_IMAGE_RESULT: 'PICK_IMAGE_RESULT',
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
}

export interface PickImageResponse {
  type: typeof BRIDGE_MESSAGE_TYPES.PICK_IMAGE_RESULT;
  requestId: string;
  status: BridgeStatus;
  assets?: PickedAsset[];
  error?: string;
}

export type BridgeRequest = PickImageRequest;
export type BridgeResponse = PickImageResponse;

export { parseGpsFromExif, type GpsCoordinates } from './utils/parseGpsFromExif';
