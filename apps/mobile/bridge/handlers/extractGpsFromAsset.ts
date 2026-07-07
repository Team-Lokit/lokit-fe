import type { Asset } from 'react-native-image-picker';
import { parseGpsFromExif, type GpsCoordinates } from '@repo/webview-bridge';

/**
 * 원본 파일에서 GPS 좌표를 추출하는 함수
 *
 * react-native-image-picker는 maxWidth/maxHeight/quality로 리사이즈하면서
 * EXIF GPS를 버리고(orientation만 보존), JS로도 위치를 노출하지 않는다.
 * 따라서 리사이즈 전 원본(originalPath, 없으면 uri) 바이트를 직접 읽어 파싱한다.
 */
export const extractGpsFromAsset = async (
  asset: Asset,
): Promise<GpsCoordinates | null> => {
  const path = asset.originalPath ?? asset.uri;
  if (!path) {
    return null;
  }

  try {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    return parseGpsFromExif(arrayBuffer);
  } catch {
    return null;
  }
};
