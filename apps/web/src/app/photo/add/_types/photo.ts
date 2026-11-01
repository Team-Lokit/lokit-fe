import type { GpsCoordinates } from '@repo/webview-bridge';

/** 위치 정보 (위도, 경도) — EXIF 파서의 GpsCoordinates와 동일 shape을 재사용 */
export type PhotoLocation = GpsCoordinates;

/** 로컬에서 선택한 사진 정보 */
export interface SelectedPhoto {
  /** 임시 ID */
  id: string;
  /** 사진 data URL */
  uri: string;
  /** 파일명 */
  filename: string;
  /** 생성 날짜 (ISO 8601) */
  createdAt: string;
  /** 너비 */
  width: number;
  /** 높이 */
  height: number;
  /** 위치 정보 */
  location?: PhotoLocation;
}
