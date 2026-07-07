/**
 * @format
 */
import { BRIDGE_MESSAGE_TYPES } from '@repo/webview-bridge';
import { launchImageLibrary } from 'react-native-image-picker';
import { handlePickImage } from '../bridge/handlers/handlePickImage';
import { extractGpsFromAsset } from '../bridge/handlers/extractGpsFromAsset';
import { sendResponse } from '../bridge/sendResponse';

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));
jest.mock('../bridge/sendResponse', () => ({ sendResponse: jest.fn() }));
jest.mock(
  '../bridge/handlers/extractGpsFromAsset',
  () => ({ extractGpsFromAsset: jest.fn() }),
  { virtual: true },
);

const mockLaunchLibrary = launchImageLibrary as jest.Mock;
const mockExtractGps = extractGpsFromAsset as jest.Mock;
const mockSendResponse = sendResponse as jest.Mock;

const GYEONGJU = { latitude: 35.8562, longitude: 129.2247 };

const webViewRef = { current: null } as never;
const baseRequest = {
  type: BRIDGE_MESSAGE_TYPES.PICK_IMAGE,
  requestId: 'req-1',
  options: { source: 'library' },
} as never;

const pickedAsset = {
  base64: 'AAAA',
  type: 'image/jpeg',
  fileName: 'photo.jpg',
  uri: 'file:///resized.jpg',
  originalPath: 'file:///original.jpg',
  width: 100,
  height: 80,
};

const getSentResponse = () => mockSendResponse.mock.calls.at(-1)?.[1];

describe('handlePickImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLaunchLibrary.mockResolvedValue({ assets: [pickedAsset] });
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

    const response = getSentResponse();
    expect(response.assets[0].location).toBeUndefined();
  });
});
