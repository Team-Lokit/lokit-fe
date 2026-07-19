import { parseGpsFromExif, type GpsCoordinates } from '@repo/webview-bridge';

/**
 * File의 EXIF 데이터에서 GPS 좌표 추출
 *
 * 파싱 로직은 웹/네이티브 공용(@repo/webview-bridge)이며, 여기서는 File을
 * ArrayBuffer로 읽어 넘기는 얇은 래퍼만 담당한다.
 */
export const extractGpsFromFile = async (file: File): Promise<GpsCoordinates | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    return parseGpsFromExif(arrayBuffer);
  } catch {
    return null;
  }
};
