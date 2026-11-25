'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from 'react-map-gl/mapbox';
import {
  computeWorldToScreen,
  lngLatToWorld,
  toRegionTransform,
  type ProjectedRegion,
} from './regionBoundary.calc';
import * as S from './RegionPhotoLayer.styles';

export interface RegionPhoto {
  /** 고유 키 (clusterId) */
  key: string;
  region: ProjectedRegion;
  imageUrl: string;
}

interface RegionPhotoLayerProps {
  regions: RegionPhoto[];
}

/**
 * 행정구역 경계 모양으로 사진을 잘라 지도 위에 표시하는 레이어
 *
 * - 지도 캔버스 컨테이너 안에 SVG 를 올리고, 구역마다 clipPath 로 경계 모양을 만든다.
 * - 지도가 움직일 때마다 React 렌더 없이 구역별 transform 만 갱신해서 경계를 따라가게 한다.
 * - 클릭 판정은 MapView 에서 경위도 기준으로 처리한다.
 */
const RegionPhotoLayer = ({ regions }: RegionPhotoLayerProps) => {
  const { current: mapRef } = useMap();
  const idPrefix = useId().replace(/:/g, '');
  const groupRefs = useRef(new Map<string, SVGGElement>());
  const regionsRef = useRef(regions);

  const updateTransforms = useCallback(() => {
    const map = mapRef?.getMap();
    if (!map) return;

    const center = map.getCenter();
    const worldToScreen = computeWorldToScreen(
      ([lng, lat]) => map.project([lng, lat]),
      lngLatToWorld(center.lng, center.lat),
    );

    regionsRef.current.forEach(({ key, region }) => {
      groupRefs.current
        .get(key)
        ?.setAttribute('transform', toRegionTransform(worldToScreen, region.origin));
    });
  }, [mapRef]);

  // 구역 목록이 바뀌면 페인트 전에 위치를 맞춘다
  useLayoutEffect(() => {
    regionsRef.current = regions;
    updateTransforms();
  }, [regions, updateTransforms]);

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;

    map.on('move', updateTransforms);
    map.on('resize', updateTransforms);
    return () => {
      map.off('move', updateTransforms);
      map.off('resize', updateTransforms);
    };
  }, [mapRef, updateTransforms]);

  const container = mapRef?.getMap().getCanvasContainer();
  if (!container || regions.length === 0) return null;

  return createPortal(
    <S.Svg aria-hidden>
      {regions.map(({ key, region, imageUrl }, index) => {
        const clipId = `${idPrefix}-region-${index}`;
        const { x, y, width, height } = region.imageRect;
        return (
          <g
            key={key}
            ref={(element) => {
              if (element) groupRefs.current.set(key, element);
              else groupRefs.current.delete(key);
            }}
          >
            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                <path d={region.path} clipRule="evenodd" />
              </clipPath>
            </defs>
            <S.RegionGroup clipPath={`url(#${clipId})`}>
              <S.Placeholder d={region.path} fillRule="evenodd" />
              <image
                href={imageUrl}
                x={x}
                y={y}
                width={width}
                height={height}
                preserveAspectRatio="xMidYMid slice"
              />
            </S.RegionGroup>
            <S.OutlineHalo
              d={region.path}
              fillRule="evenodd"
              vectorEffect="non-scaling-stroke"
            />
            <S.Outline
              d={region.path}
              fillRule="evenodd"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </S.Svg>,
    container,
  );
};

export default RegionPhotoLayer;
