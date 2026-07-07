import type { PhotoLocation, SelectedPhoto } from '../_types/photo';
import { compressImage } from './compressImage';
import { extractGpsFromFile } from './extractGpsFromFile';

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
      createdAt: new Date(file.lastModified).toISOString(),
      width: compressed.width,
      height: compressed.height,
      location: location ?? gps ?? undefined,
    };
  } catch {
    return null;
  }
};
