import type { Asset } from 'react-native-image-picker';
import { parseGpsFromExif, type GpsCoordinates } from '@repo/webview-bridge';

/**
 * 선택된 사진의 원본 EXIF에서 GPS 좌표를 추출한다.
 *
 * 피커가 준 base64(원본, 리사이즈 안 함)에서 바로 파싱한다.
 * - 네이티브 리사이즈는 EXIF GPS를 제거하므로 반드시 리사이즈 전 원본에서 뽑아야 한다.
 * - 로컬 파일을 fetch로 읽는 방식은 Android RN에서 실패하므로 base64를 직접 디코드한다.
 * - 실패/부재 시 null → 현재 위치/수동 선택 폴백으로 degrade한다.
 *
 * TODO(android-geotag): Android는 이 방식으로 GPS를 얻을 수 없다.
 *   Android 13+ 시스템 Photo Picker(com.android.providers.media.photopicker)가
 *   프라이버시로 위치 EXIF를 제거한 사본만 넘겨주기 때문에, base64/원본 파일 모두
 *   GPS가 0으로 비어 있다(= parseGpsFromExif가 null 반환 → 현재 위치 폴백).
 *   iOS는 원본 EXIF가 보존되어 정상 동작한다.
 *   Android에서 사진 촬영 위치가 필요해지면 시스템 Photo Picker 대신
 *   MediaStore 직접 접근(ACCESS_MEDIA_LOCATION + MediaStore.setRequireOriginal),
 *   또는 @react-native-camera-roll/camera-roll 기반 자체 갤러리로 교체해야 한다.
 */
export const extractGpsFromAsset = async (asset: Asset): Promise<GpsCoordinates | null> => {
  if (!asset.base64) {
    return null;
  }

  try {
    return parseGpsFromExif(base64ToArrayBuffer(asset.base64));
  } catch {
    return null;
  }
};

/* eslint-disable no-bitwise -- base64 디코딩은 비트연산이 본질적으로 필요하다 */
const BASE64_LOOKUP = (() => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const table = new Uint8Array(256).fill(255);
  for (let i = 0; i < chars.length; i++) {
    table[chars.charCodeAt(i)] = i;
  }
  return table;
})();

/** base64 문자열을 ArrayBuffer로 디코드 (atob 의존 없이 순수 구현). */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  let length = base64.length;
  while (length > 0 && base64[length - 1] === '=') {
    length--;
  }

  const bytes = new Uint8Array((length * 3) >> 2);
  let byteIndex = 0;
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < length; i++) {
    const value = BASE64_LOOKUP[base64.charCodeAt(i)];
    if (value === 255) continue; // 공백 등 비-base64 문자 건너뜀
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes[byteIndex++] = (buffer >> bits) & 0xff;
    }
  }

  return bytes.buffer;
};
/* eslint-enable no-bitwise */
