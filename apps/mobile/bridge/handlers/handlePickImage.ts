import type { RefObject } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import type { PhotoQuality } from 'react-native-image-picker';
import type WebView from 'react-native-webview';
import {
  BRIDGE_MESSAGE_TYPES,
  type PickedAsset,
  type PickImageRequest,
} from '@repo/webview-bridge';
import { sendResponse } from '../sendResponse';

const DEFAULT_MAX_DIMENSION = 2400;
const DEFAULT_QUALITY: PhotoQuality = 0.8;

export async function handlePickImage(
  webViewRef: RefObject<WebView | null>,
  request: PickImageRequest,
) {
  const { requestId, options } = request;
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: options?.selectionLimit ?? 1,
      maxWidth: options?.maxWidth ?? DEFAULT_MAX_DIMENSION,
      maxHeight: options?.maxHeight ?? DEFAULT_MAX_DIMENSION,
      quality: (options?.quality as PhotoQuality | undefined) ?? DEFAULT_QUALITY,
      includeBase64: true,
      // EXIF는 웹에서 추출하므로 네이티브에서는 굳이 안 다룸
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

    const assets: PickedAsset[] = (result.assets ?? [])
      .filter(asset => asset.base64 && asset.type)
      .map(asset => ({
        uri: `data:${asset.type};base64,${asset.base64}`,
        fileName: asset.fileName ?? `photo-${Date.now()}.jpg`,
        type: asset.type ?? 'image/jpeg',
        fileSize: asset.fileSize,
        width: asset.width,
        height: asset.height,
      }));

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
