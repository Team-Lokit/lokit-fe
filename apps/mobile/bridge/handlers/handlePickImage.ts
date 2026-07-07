import type { RefObject } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type WebView from 'react-native-webview';
import {
  BRIDGE_MESSAGE_TYPES,
  type PickedAsset,
  type PickImageRequest,
} from '@repo/webview-bridge';
import { sendResponse } from '../sendResponse';
import { extractGpsFromAsset } from './extractGpsFromAsset';
import { resizeToJpegDataUrl } from './resizeToJpegDataUrl';

const DEFAULT_MAX_DIMENSION = 2400;
const DEFAULT_QUALITY = 80; // ImageResizer 품질은 0-100

export async function handlePickImage(
  webViewRef: RefObject<WebView | null>,
  request: PickImageRequest,
) {
  const { requestId, options } = request;
  try {
    // 피커에서는 리사이즈하지 않는다.
    // - react-native-image-picker의 리사이즈는 원본 EXIF(GPS/촬영일)를 제거한다.
    // - 대신 원본에서 위치/날짜를 뽑고, 전송용 축소 JPEG은 ImageResizer로 따로 만든다.
    const commonOptions = {
      mediaType: 'photo' as const,
      includeBase64: true, // 원본 base64 → GPS 추출용 (전송은 축소본만)
      includeExtra: true, // timestamp(촬영일) 포함
    };

    const result =
      options?.source === 'camera'
        ? await launchCamera({
            ...commonOptions,
            saveToPhotos: true,
            cameraType: 'back',
          })
        : await launchImageLibrary({
            ...commonOptions,
            selectionLimit: options?.selectionLimit ?? 1,
          });

    if (result.didCancel) {
      sendResponse(webViewRef, {
        type: BRIDGE_MESSAGE_TYPES.PICK_IMAGE_RESULT,
        requestId,
        status: 'cancelled',
      });
      return;
    }

    if (result.errorCode) {
      sendResponse(webViewRef, {
        type: BRIDGE_MESSAGE_TYPES.PICK_IMAGE_RESULT,
        requestId,
        status: 'error',
        error: result.errorMessage ?? result.errorCode,
      });
      return;
    }

    const maxDimension = options?.maxWidth ?? DEFAULT_MAX_DIMENSION;

    const assets: PickedAsset[] = await Promise.all(
      (result.assets ?? [])
        .filter((asset): asset is typeof asset & { uri: string } => !!asset.uri)
        .map(async asset => {
          // 위치는 원본 EXIF에서, 전송 이미지는 원본을 축소한 JPEG로.
          const [location, resized] = await Promise.all([
            extractGpsFromAsset(asset),
            resizeToJpegDataUrl(asset.uri, maxDimension, DEFAULT_QUALITY),
          ]);

          return {
            uri: resized.dataUrl,
            fileName: asset.fileName ?? `photo-${Date.now()}.jpg`,
            type: 'image/jpeg',
            width: resized.width,
            height: resized.height,
            location: location ?? undefined,
            takenAt: asset.timestamp ?? undefined,
          };
        }),
    );

    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.PICK_IMAGE_RESULT,
      requestId,
      status: 'success',
      assets,
    });
  } catch (e) {
    sendResponse(webViewRef, {
      type: BRIDGE_MESSAGE_TYPES.PICK_IMAGE_RESULT,
      requestId,
      status: 'error',
      error: e instanceof Error ? e.message : 'unknown error',
    });
  }
}
