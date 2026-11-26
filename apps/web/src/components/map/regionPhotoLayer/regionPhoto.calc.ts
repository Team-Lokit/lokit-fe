import type { MapPin } from '@/types/map.type';
import {
  getBoundaryPath,
  isPointInRegion,
  type ProjectedRegion,
} from './regionBoundary.calc';

/** 경계가 준비되어 영역으로 표시할 행정구역 클러스터 */
export interface RegionPinEntry {
  pin: MapPin;
  region: ProjectedRegion;
}

/**
 * 지도 항목(MapPin)을 영역 / 핀으로 나눈다.
 * - 개별 사진, 행정구역이 아닌 클러스터 → 핀
 * - 경계가 준비된 행정구역 클러스터 → 영역
 * - 경계 파일 로딩 중 → 표시하지 않음 (핀 → 영역으로 깜빡이는 것을 방지)
 * - 경계 파일은 받았지만 그 안에 해당 행정구역 코드가 없음(백엔드와 경계 데이터 기준일 불일치 등) 또는 로드 실패 → 대표점에 핀
 */
export const partitionMapPins = (
  pins: MapPin[],
  regionsByPath: Map<string, Map<string, ProjectedRegion>>,
  settledPaths: Set<string>,
): { regionEntries: RegionPinEntry[]; pinPhotos: MapPin[] } => {
  const regionEntries: RegionPinEntry[] = [];
  const pinPhotos: MapPin[] = [];

  pins.forEach((pin) => {
    if (!pin.regionLevel || !pin.regionCode || !pin.clusterId) {
      pinPhotos.push(pin);
      return;
    }

    const path = getBoundaryPath(pin.regionLevel, pin.regionCode);
    const region = regionsByPath.get(path)?.get(pin.regionCode);
    if (region) {
      regionEntries.push({ pin, region });
    } else if (settledPaths.has(path)) {
      pinPhotos.push(pin);
    }
  });

  return { regionEntries, pinPhotos };
};

/** 경위도 좌표가 속한 영역의 지도 항목 */
export const findPinAtLngLat = (
  entries: RegionPinEntry[],
  lng: number,
  lat: number,
): MapPin | undefined =>
  entries.find(({ region }) => isPointInRegion(region, lng, lat))?.pin;
