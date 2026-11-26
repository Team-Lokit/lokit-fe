import {
  findPinAtLngLat,
  partitionMapPins,
} from '@/components/map/regionPhotoLayer/regionPhoto.calc';
import {
  projectRegionFeature,
  type ProjectedRegion,
} from '@/components/map/regionPhotoLayer/regionBoundary.calc';
import type { MapPin } from '@/types/map.type';

const square = (code: string, lng: number, lat: number): ProjectedRegion =>
  projectRegionFeature({
    type: 'Feature',
    properties: { code },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [lng, lat],
          [lng + 0.1, lat],
          [lng + 0.1, lat + 0.1],
          [lng, lat + 0.1],
          [lng, lat],
        ],
      ],
    },
  })!;

const pin = (overrides: Partial<MapPin>): MapPin => ({
  id: 0,
  albumId: 0,
  latitude: 37,
  longitude: 127,
  imageUrl: '',
  imageCount: 1,
  isCluster: true,
  ...overrides,
});

const seoul = pin({ clusterId: 'sd_11', regionLevel: 'sido', regionCode: '11' });
const unknown = pin({ clusterId: 'sd_99', regionLevel: 'sido', regionCode: '99' });
const loadingEmd = pin({
  clusterId: 'emd_41111510',
  regionLevel: 'emd',
  regionCode: '41111510',
});
const photo = pin({ id: 7, isCluster: false });

const regionsByPath = new Map([
  ['/geo/sido.json', new Map([['11', square('11', 127, 37)]])],
]);
const settledPaths = new Set(['/geo/sido.json']);

describe('지도 항목을 영역 / 핀으로 나누기', () => {
  const { regionEntries, pinPhotos } = partitionMapPins(
    [seoul, unknown, loadingEmd, photo],
    regionsByPath,
    settledPaths,
  );

  it('경계 데이터가 있는 행정구역 클러스터는 영역으로 표시한다', () => {
    expect(regionEntries.map((entry) => entry.pin)).toEqual([seoul]);
  });

  it('개별 사진과 경계 데이터에 없는 클러스터는 핀으로 표시하고, 경계 파일을 받는 중인 클러스터는 잠시 숨긴다', () => {
    expect(pinPhotos).toEqual([unknown, photo]);
  });
});

describe('영역 클릭', () => {
  const { regionEntries } = partitionMapPins([seoul], regionsByPath, settledPaths);

  it('영역 안을 누르면 그 영역의 항목을 찾고, 영역 밖을 누르면 아무 항목도 찾지 않는다', () => {
    expect(findPinAtLngLat(regionEntries, 127.05, 37.05)).toBe(seoul);
    expect(findPinAtLngLat(regionEntries, 127.5, 37.5)).toBeUndefined();
  });
});
