import ImageResizer from '@bam.tech/react-native-image-resizer';
import { readFile } from '@dr.pogodin/react-native-fs';

interface ResizedImage {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * 원본 이미지를 리사이즈된 JPEG data URL로 변환한다.
 *
 * - 리사이즈(재인코딩)로 원본 EXIF(GPS 등)는 제거되지만, 위치/날짜는 원본에서 별도
 *   추출하므로 문제없다. (HEIC 원본도 JPEG로 변환되어 크로스플랫폼 표시 가능)
 * - WebView는 네이티브 file:// 를 로드할 수 없으므로 base64 data URL로 넘긴다.
 * - 리사이즈 결과 파일은 RNFS로 읽는다. (Android RN의 fetch는 file:// 를 못 읽음)
 */
export const resizeToJpegDataUrl = async (
  uri: string,
  maxDimension: number,
  quality: number,
): Promise<ResizedImage> => {
  const resized = await ImageResizer.createResizedImage(
    uri,
    maxDimension,
    maxDimension,
    'JPEG',
    quality, // 0-100
    0,
    undefined,
    false,
    { mode: 'contain', onlyScaleDown: true },
  );

  const filePath = resized.path || resized.uri.replace(/^file:\/\//, '');
  const base64 = await readFile(filePath, 'base64');

  return {
    dataUrl: `data:image/jpeg;base64,${base64}`,
    width: resized.width,
    height: resized.height,
  };
};
