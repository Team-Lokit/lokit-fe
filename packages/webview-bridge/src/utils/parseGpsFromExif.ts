import ExifReader from 'exifreader';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * 이미지 EXIF 메타데이터에서 GPS 좌표를 파싱하는 함수
 * - exifreader로 JPEG/HEIC/HEIF/WebP/PNG/TIFF를 모두 처리한다.
 */
export const parseGpsFromExif = (arrayBuffer: ArrayBuffer): GpsCoordinates | null => {
  try {
    const tags = ExifReader.load(arrayBuffer, { expanded: true });
    if (!tags.gps) {
      return null;
    }

    const latitude = tags.gps.Latitude;
    const longitude = tags.gps.Longitude;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return null;
    }

    return { latitude, longitude };
  } catch {
    return null;
  }
};
