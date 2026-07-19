import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./callBridge', () => ({ callBridge: vi.fn() }));

import { callBridge } from './callBridge';
import { requestImageFromBridge } from './requestImageFromBridge';

const mockCallBridge = vi.mocked(callBridge);

const GYEONGJU = { latitude: 35.8562, longitude: 129.2247 };

beforeEach(() => {
  vi.clearAllMocks();
  // assetToFile 내부의 fetch(data URL) → blob 변환을 결정론적으로 대체
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      blob: async () => new Blob(['x'], { type: 'image/jpeg' }),
    }),
  );
});

describe('requestImageFromBridge', () => {
  it('PickedAsset.location을 BridgePickedFile.location으로 전달한다', async () => {
    mockCallBridge.mockResolvedValue({
      type: 'PICK_IMAGE_RESULT',
      requestId: 'r1',
      status: 'success',
      assets: [
        {
          uri: 'data:image/jpeg;base64,AAAA',
          fileName: 'a.jpg',
          type: 'image/jpeg',
          width: 100,
          height: 80,
          location: GYEONGJU,
          takenAt: '2026-07-04T23:22:50.586+09:00',
        },
      ],
    });

    const result = await requestImageFromBridge();

    expect(result).toHaveLength(1);
    expect(result?.[0].file).toBeInstanceOf(File);
    expect(result?.[0].location).toEqual(GYEONGJU);
    expect(result?.[0].takenAt).toBe('2026-07-04T23:22:50.586+09:00');
  });

  it('location이 없는 에셋은 location이 undefined다', async () => {
    mockCallBridge.mockResolvedValue({
      type: 'PICK_IMAGE_RESULT',
      requestId: 'r1',
      status: 'success',
      assets: [
        { uri: 'data:image/jpeg;base64,AAAA', fileName: 'a.jpg', type: 'image/jpeg' },
      ],
    });

    const result = await requestImageFromBridge();

    expect(result?.[0].location).toBeUndefined();
  });
});
