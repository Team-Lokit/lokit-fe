import {
  computeWorldToScreen,
  getBoundaryPath,
  isPointInRegion,
  lngLatToWorld,
  LOCAL_SCALE,
  parseRegionClusterId,
  projectRegionFeature,
  toRegionTransform,
  worldToLngLat,
  type RegionFeature,
} from '@/components/map/regionPhotoLayer/regionBoundary.calc';

/** 가운데 구멍이 있는 사각형 + 멀리 떨어진 작은 섬 */
const feature: RegionFeature = {
  type: 'Feature',
  properties: { code: '41110' },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [127, 37],
          [127.2, 37],
          [127.2, 37.2],
          [127, 37.2],
          [127, 37],
        ],
        [
          [127.08, 37.08],
          [127.12, 37.08],
          [127.12, 37.12],
          [127.08, 37.12],
          [127.08, 37.08],
        ],
      ],
      [
        [
          [128, 37],
          [128.01, 37],
          [128.01, 37.01],
          [128, 37.01],
          [128, 37],
        ],
      ],
    ],
  },
};

describe('백엔드 clusterId 해석', () => {
  it('sd_/sgg_/emd_ clusterId 에서 행정구역 단위와 코드를 꺼낸다', () => {
    expect(parseRegionClusterId('sd_11')).toEqual({ level: 'sido', code: '11' });
    expect(parseRegionClusterId('sgg_41110')).toEqual({ level: 'sgg', code: '41110' });
    expect(parseRegionClusterId('emd_11110515')).toEqual({
      level: 'emd',
      code: '11110515',
    });
  });

  it('격자·클라이언트 클러스터처럼 행정구역이 아닌 clusterId 는 영역으로 그리지 않는다(null)', () => {
    expect(parseRegionClusterId('z14_130234_38456_mz14700')).toBeNull();
    expect(parseRegionClusterId('client_z15_3')).toBeNull();
    expect(parseRegionClusterId('sd_')).toBeNull();
    expect(parseRegionClusterId(undefined)).toBeNull();
  });
});

describe('경계 파일 경로', () => {
  it('시·도/시·군·구는 단위별 파일 하나, 읍·면·동은 코드 앞 2자리 시도 파일을 쓴다', () => {
    expect(getBoundaryPath('sido', '11')).toBe('/geo/sido.json');
    expect(getBoundaryPath('sgg', '41110')).toBe('/geo/sgg.json');
    expect(getBoundaryPath('emd', '41111510')).toBe('/geo/emd/41.json');
  });
});

describe('경위도 ↔ 지도 평면 좌표 변환', () => {
  it('경위도를 평면 좌표로 바꿨다가 되돌리면 원래 경위도가 나온다', () => {
    const [x, y] = lngLatToWorld(127.5, 36.5);
    const [lng, lat] = worldToLngLat(x, y);
    expect(lng).toBeCloseTo(127.5, 9);
    expect(lat).toBeCloseTo(36.5, 9);
  });
});

describe('행정구역 경계 → 영역 데이터 변환', () => {
  const region = projectRegionFeature(feature)!;

  it('영역 클릭 판정: 구역 안·떨어진 섬은 클릭, 구역 속 구멍(다른 구역)·바깥은 클릭 아님', () => {
    expect(isPointInRegion(region, 127.03, 37.03)).toBe(true);
    expect(isPointInRegion(region, 127.1, 37.1)).toBe(false); // 구멍
    expect(isPointInRegion(region, 128.005, 37.005)).toBe(true); // 섬
    expect(isPointInRegion(region, 127.5, 37.1)).toBe(false); // 바깥
  });

  it('사진은 멀리 떨어진 작은 섬을 빼고 본토 범위에 맞춰 채운다', () => {
    const [x0, y0] = lngLatToWorld(127, 37.2);
    const [x1, y1] = lngLatToWorld(127.2, 37);
    expect(region.imageRect.x).toBeCloseTo(0, 1);
    expect(region.imageRect.width).toBeCloseTo((x1 - x0) * LOCAL_SCALE, 0);
    expect(region.imageRect.height).toBeCloseTo((y1 - y0) * LOCAL_SCALE, 0);
  });

  it('경계 모양(path)에 본토 외곽·구멍·섬이 모두 들어간다', () => {
    expect(region.path.match(/M/g)).toHaveLength(3);
  });
});

describe('지도 이동·확대·회전 시 영역 위치', () => {
  /** zoom 10, bearing 30도, 화면 중심 (200, 400) 인 가상의 지도 */
  const zoom = 10;
  const bearing = (30 * Math.PI) / 180;
  const center = lngLatToWorld(127.1, 37.1);
  const scale = 2 ** zoom;
  const project = ([lng, lat]: [number, number]) => {
    const [x, y] = lngLatToWorld(lng, lat);
    const dx = (x - center[0]) * scale;
    const dy = (y - center[1]) * scale;
    return {
      x: 200 + dx * Math.cos(-bearing) - dy * Math.sin(-bearing),
      y: 400 + dx * Math.sin(-bearing) + dy * Math.cos(-bearing),
    };
  };

  it('영역의 경계 꼭짓점이 Mapbox 가 계산한 화면 위치(map.project)와 같은 곳에 그려진다', () => {
    const region = projectRegionFeature(feature)!;
    const transform = toRegionTransform(
      computeWorldToScreen(project, center),
      region.origin,
    );
    const [a, b, c, d, e, f] = transform
      .replace('matrix(', '')
      .replace(')', '')
      .split(' ')
      .map(Number);

    const target: [number, number] = [127.2, 37];
    const [wx, wy] = lngLatToWorld(...target);
    const lx = (wx - region.origin[0]) * LOCAL_SCALE;
    const ly = (wy - region.origin[1]) * LOCAL_SCALE;
    const expected = project(target);

    expect(a * lx + c * ly + e).toBeCloseTo(expected.x, 3);
    expect(b * lx + d * ly + f).toBeCloseTo(expected.y, 3);
  });
});
