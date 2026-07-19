import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./compressImage', () => ({ compressImage: vi.fn() }));
vi.mock('./extractGpsFromFile', () => ({ extractGpsFromFile: vi.fn() }));

import { compressImage } from './compressImage';
import { extractGpsFromFile } from './extractGpsFromFile';
import { fileToSelectedPhoto } from './fileToSelectedPhoto';

const mockCompress = vi.mocked(compressImage);
const mockExtract = vi.mocked(extractGpsFromFile);

const GYEONGJU = { latitude: 35.8562, longitude: 129.2247 };
const SONGDO = { latitude: 37.3894, longitude: 126.6412 };

const makeFile = () =>
  new File(['x'], 'photo.jpg', { type: 'image/jpeg', lastModified: 0 });

describe('fileToSelectedPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCompress.mockResolvedValue({
      dataUrl: 'data:image/jpeg;base64,AAAA',
      width: 100,
      height: 80,
    });
  });

  it('브리지에서 전달된 위치가 있으면 EXIF가 없어도 그 위치를 사용한다 (앱 경로)', async () => {
    // 앱 경로: 네이티브 리사이즈로 파일 EXIF는 소실된 상태를 재현
    mockExtract.mockResolvedValue(null);

    const result = await fileToSelectedPhoto(makeFile(), GYEONGJU);

    expect(result?.location).toEqual(GYEONGJU);
  });

  it('브리지 위치가 파일 EXIF와 다르면 브리지 위치를 우선한다', async () => {
    mockExtract.mockResolvedValue(SONGDO);

    const result = await fileToSelectedPhoto(makeFile(), GYEONGJU);

    expect(result?.location).toEqual(GYEONGJU);
  });

  it('브리지 위치가 없으면 파일 EXIF에서 추출한다 (웹 경로)', async () => {
    mockExtract.mockResolvedValue(GYEONGJU);

    const result = await fileToSelectedPhoto(makeFile());

    expect(result?.location).toEqual(GYEONGJU);
  });

  it('브리지 위치도 EXIF도 없으면 location은 undefined', async () => {
    mockExtract.mockResolvedValue(null);

    const result = await fileToSelectedPhoto(makeFile());

    expect(result?.location).toBeUndefined();
  });

  it('브리지 촬영일(콜론 없는 오프셋)을 표준 ISO(UTC)로 정규화해 createdAt에 넣는다', async () => {
    mockExtract.mockResolvedValue(null);
    // 네이티브 피커 timestamp 형식: 콜론 없는 오프셋 → 서버가 거부하던 값
    const takenAt = '2026-07-04T23:22:50.586+0900';

    const result = await fileToSelectedPhoto(makeFile(), GYEONGJU, takenAt);

    expect(result?.createdAt).toBe(
      new Date('2026-07-04T23:22:50.586+09:00').toISOString(),
    );
  });

  it('takenAt이 없으면 파일 수정시각으로 폴백한다 (웹 경로)', async () => {
    mockExtract.mockResolvedValue(null);

    const result = await fileToSelectedPhoto(makeFile());

    // makeFile()은 lastModified: 0 → epoch
    expect(result?.createdAt).toBe(new Date(0).toISOString());
  });
});
