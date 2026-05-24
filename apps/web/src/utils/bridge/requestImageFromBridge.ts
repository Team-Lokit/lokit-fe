import {
  BRIDGE_MESSAGE_TYPES,
  type PickedAsset,
  type PickImageOptions,
  type PickImageResponse,
} from '@repo/webview-bridge';
import { callBridge } from './callBridge';

export interface BridgePickedFile {
  file: File;
  width?: number;
  height?: number;
}

const assetToFile = async (asset: PickedAsset): Promise<BridgePickedFile> => {
  const blob = await fetch(asset.uri).then((r) => r.blob());
  const file = new File([blob], asset.fileName, { type: asset.type });
  return { file, width: asset.width, height: asset.height };
};

/**
 * 네이티브 브리지를 통해 사진을 선택한다.
 * - 결과 base64 data URL을 File 객체로 변환해 돌려준다.
 * - 사용자가 취소하면 null 반환, 에러 발생 시 reject.
 */
export const requestImageFromBridge = async (
  options?: PickImageOptions,
): Promise<BridgePickedFile[] | null> => {
  const response = await callBridge<PickImageResponse>({
    type: BRIDGE_MESSAGE_TYPES.PICK_IMAGE,
    options,
  });
  if (!response) return null;
  return Promise.all((response.assets ?? []).map(assetToFile));
};
