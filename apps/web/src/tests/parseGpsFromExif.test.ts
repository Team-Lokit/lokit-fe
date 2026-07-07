import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('exifreader', () => ({ default: { load: vi.fn() } }));

import ExifReader from 'exifreader';
import { parseGpsFromExif } from '@repo/webview-bridge';

const mockLoad = vi.mocked(ExifReader.load);
const buf = new ArrayBuffer(8);

const GYEONGJU = { latitude: 35.8562, longitude: 129.2247 };

describe('parseGpsFromExif (exifreader 기반 - 다중 포맷 대응)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exifreader의 gps 그룹에서 위경도를 추출한다 (JPEG/HEIC/WebP/PNG 공통 경로)', () => {
    mockLoad.mockReturnValue({
      gps: { Latitude: GYEONGJU.latitude, Longitude: GYEONGJU.longitude },
    } as never);

    expect(parseGpsFromExif(buf)).toEqual(GYEONGJU);
    // expanded 모드로 호출해 gps 그룹(부호 계산된 십진수)을 받아야 한다
    expect(mockLoad).toHaveBeenCalledWith(buf, { expanded: true });
  });

  it('gps 그룹이 없으면 null (예: GIF - 포맷상 위치 메타데이터 없음)', () => {
    mockLoad.mockReturnValue({ gif: {} } as never);

    expect(parseGpsFromExif(buf)).toBeNull();
  });

  it('위도 또는 경도 한쪽만 있으면 null (부분 GPS 방어)', () => {
    mockLoad.mockReturnValue({ gps: { Latitude: GYEONGJU.latitude } } as never);

    expect(parseGpsFromExif(buf)).toBeNull();
  });

  it('exifreader가 throw하면(미지원/손상 파일) null로 degrade한다', () => {
    mockLoad.mockImplementation(() => {
      throw new Error('unsupported format');
    });

    expect(parseGpsFromExif(buf)).toBeNull();
  });
});
