/// <reference path="./exifreader-src.d.ts" />
// dist(UMD) 대신 src(ESM)를 import한다.
// dist는 URL/파일 로더가 https/http/fs를 하드 require해 React Native(Metro) 번들에서 해석 실패한다.
// src는 해당 로더를 webpack 매직(__non_webpack_require__)으로 숨겨 정적 해석 대상에서 제외되며,
// 우리는 ArrayBuffer만 넘기므로 그 코드 경로는 실행되지 않는다. (exifreader 공식 RN 안내)
import { load } from 'exifreader/src/exif-reader.js';

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
    const tags = load(arrayBuffer, { expanded: true });
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
