import type { PhotoLocation, SelectedPhoto } from '../_types/photo';
import { compressImage } from './compressImage';
import { extractGpsFromFile } from './extractGpsFromFile';

/**
 * 촬영일 문자열을 표준 ISO 8601(UTC, ...Z)로 정규화한다.
 *
 * 네이티브 피커의 timestamp는 "2026-07-04T23:22:50.586+0900"처럼 콜론 없는
 * 오프셋으로 오는데, 서버(OffsetDateTime 등)가 이를 거부해 업로드가 실패한다.
 * 콜론을 보정한 뒤 toISOString()으로 통일한다. 파싱 실패 시 undefined.
 */
const toIsoString = (value?: string): string | undefined => {
  if (!value) return undefined;
  const normalized = value.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

/**
 * File 객체에서 SelectedPhoto 생성
 *
 * 1. 이미지를 리사이즈 + JPEG 압축
 * 2. 위치 결정: 브리지가 넘긴 위치(원본 EXIF 기반)를 우선, 없으면 File EXIF에서 추출
 * 3. SelectedPhoto 형태로 조합
 *
 * @param location 네이티브 브리지가 원본 EXIF에서 뽑아 넘긴 위치
 * - 앱 경로에서는 네이티브 리사이즈로 File 자체의 EXIF가 소실되므로 이 값을 우선 사용한다.
 */
export const fileToSelectedPhoto = async (
  file: File,
  location?: PhotoLocation,
  takenAt?: string,
): Promise<SelectedPhoto | null> => {
  try {
    // 브리지 위치가 있으면 File EXIF 재파싱은 생략한다.
    const [compressed, gps] = await Promise.all([
      compressImage(file),
      location ? Promise.resolve(null) : extractGpsFromFile(file),
    ]);

    return {
      id: crypto.randomUUID(),
      uri: compressed.dataUrl,
      filename: file.name,
      // 브리지가 넘긴 원본 촬영일 우선. 없으면(웹 경로) 파일 수정시각으로 폴백.
      createdAt: toIsoString(takenAt) ?? new Date(file.lastModified).toISOString(),
      width: compressed.width,
      height: compressed.height,
      location: location ?? gps ?? undefined,
    };
  } catch {
    return null;
  }
};
