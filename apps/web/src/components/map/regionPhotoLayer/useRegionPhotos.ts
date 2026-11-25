import { useCallback, useMemo } from 'react';
import type { MapMouseEvent } from 'react-map-gl/mapbox';
import type { MapPin } from '@/types/map.type';
import type { RegionPhoto } from './RegionPhotoLayer';
import { findPinAtLngLat, partitionMapPins } from './regionPhoto.calc';
import { useRegionBoundaries } from './useRegionBoundaries';

interface UseRegionPhotosReturn {
  /** 영역(행정구역 경계 모양)으로 표시할 사진 (경계 데이터가 준비된 행정구역 클러스터) */
  regionPhotos: RegionPhoto[];
  /** 핀(사각형 프레임)으로 표시할 사진 (개별 사진, 경계 데이터에 없거나 로드 실패한 클러스터) */
  pinPhotos: MapPin[];
  /** 영역 클릭 판정 */
  handleRegionClick: (event: MapMouseEvent) => void;
}

/** 지도 항목을 영역 / 핀으로 나누고 영역 표시와 클릭 판정을 준비한다. */
export const useRegionPhotos = (
  pins: MapPin[],
  onPinClick: (pin: MapPin) => void,
): UseRegionPhotosReturn => {
  const { regionsByPath, settledPaths } = useRegionBoundaries(pins);

  const { regionEntries, pinPhotos } = useMemo(
    () => partitionMapPins(pins, regionsByPath, settledPaths),
    [pins, regionsByPath, settledPaths],
  );

  const regionPhotos: RegionPhoto[] = useMemo(
    () =>
      regionEntries.map(({ pin, region }) => ({
        key: pin.clusterId ?? String(pin.id),
        region,
        imageUrl: pin.imageUrl,
      })),
    [regionEntries],
  );

  const handleRegionClick = useCallback(
    (event: MapMouseEvent) => {
      const pin = findPinAtLngLat(regionEntries, event.lngLat.lng, event.lngLat.lat);
      if (pin) onPinClick(pin);
    },
    [regionEntries, onPinClick],
  );

  return { regionPhotos, pinPhotos, handleRegionClick };
};
