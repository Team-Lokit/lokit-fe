/**
 * @format
 */
import { BRIDGE_MESSAGE_TYPES } from '@repo/webview-bridge';
import { launchImageLibrary } from 'react-native-image-picker';
import { handlePickImage } from '../bridge/handlers/handlePickImage';
import { extractGpsFromAsset } from '../bridge/handlers/extractGpsFromAsset';
import { resizeToJpegDataUrl } from '../bridge/handlers/resizeToJpegDataUrl';
import { sendResponse } from '../bridge/sendResponse';

// @repo/webview-bridge가 transitively 끌어오는 exifreader(ESM src)는 jest가 변환하지
// 못하므로 목킹한다. (Metro 번들에서는 정상 동작, extractGpsFromAsset도 목킹되어 미사용)
jest.mock('exifreader/src/exif-reader.js', () => ({ load: jest.fn() }));
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));
jest.mock('../bridge/sendResponse', () => ({ sendResponse: jest.fn() }));
jest.mock('../bridge/handlers/extractGpsFromAsset', () => ({
  extractGpsFromAsset: jest.fn(),
}));
jest.mock('../bridge/handlers/resizeToJpegDataUrl', () => ({
  resizeToJpegDataUrl: jest.fn(),
}));

const mockLaunchLibrary = launchImageLibrary as jest.Mock;
const mockExtractGps = extractGpsFromAsset as jest.Mock;
const mockResize = resizeToJpegDataUrl as jest.Mock;
const mockSendResponse = sendResponse as jest.Mock;

const GYEONGJU = { latitude: 35.8562, longitude: 129.2247 };
const TAKEN_AT = '2026-07-04T23:22:50.586+0900';
const RESIZED = { dataUrl: 'data:image/jpeg;base64,ZZZ', width: 50, height: 40 };

const webViewRef = { current: null } as never;
const baseRequest = {
  type: BRIDGE_MESSAGE_TYPES.PICK_IMAGE,
  requestId: 'req-1',
  options: { source: 'library' },
} as never;

// 원본(리사이즈 안 함). HEIC일 수도 있고 timestamp(촬영일)를 갖는다.
const pickedAsset = {
  type: 'image/heic',
  fileName: 'photo.heic',
  uri: 'file:///original.heic',
  timestamp: TAKEN_AT,
  width: 4000,
  height: 3000,
};

const getSentResponse = () => mockSendResponse.mock.calls.at(-1)?.[1];

describe('handlePickImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLaunchLibrary.mockResolvedValue({ assets: [pickedAsset] });
    mockResize.mockResolvedValue(RESIZED);
    mockExtractGps.mockResolvedValue(null);
  });

  it('원본에서 추출한 GPS를 PickedAsset.location으로 전달한다', async () => {
    mockExtractGps.mockResolvedValue(GYEONGJU);

    await handlePickImage(webViewRef, baseRequest);

    const response = getSentResponse();
    expect(response.status).toBe('success');
    expect(response.assets[0].location).toEqual(GYEONGJU);
  });

  it('원본에 GPS가 없으면 location은 undefined', async () => {
    mockExtractGps.mockResolvedValue(null);

    await handlePickImage(webViewRef, baseRequest);

    expect(getSentResponse().assets[0].location).toBeUndefined();
  });

  it('전송 이미지는 축소된 JPEG data URL이고, 촬영일(takenAt)을 함께 싣는다', async () => {
    await handlePickImage(webViewRef, baseRequest);

    const asset = getSentResponse().assets[0];
    expect(asset.uri).toBe(RESIZED.dataUrl);
    expect(asset.type).toBe('image/jpeg');
    expect(asset.width).toBe(RESIZED.width);
    expect(asset.takenAt).toBe(TAKEN_AT);
  });
});
