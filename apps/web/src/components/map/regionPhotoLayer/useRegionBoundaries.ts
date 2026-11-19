import {
  queryOptions,
  useQueries,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { MAP_REGION_CONFIG } from '@/constants/map';
import type { MapPin } from '@/types/map.type';
import {
  getBoundaryPath,
  projectRegionCollection,
  type ProjectedRegion,
  type RegionFeatureCollection,
} from './regionBoundary.calc';

const fetchBoundary = async (path: string, signal?: AbortSignal) => {
  const response = await fetch(path, { signal });
  if (!response.ok) {
    throw new Error(`[useRegionBoundaries] 경계 데이터 로드 실패: ${path}`);
  }
  const collection = (await response.json()) as RegionFeatureCollection;
  return projectRegionCollection(collection);
};

/** 경계 파일 쿼리 옵션. 경계 파일은 정적 데이터이므로 세션 동안 캐시를 유지한다. */
const getRegionBoundaryQueryOptions = (path: string) =>
  queryOptions({
    queryKey: ['regionBoundary', path],
    queryFn: ({ signal }) => fetchBoundary(path, signal),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

/**
 * 시·도 경계를 미리 받아 둔다. (홈 진입 시 호출)
 * 지도 응답 이후에 경계를 받기 시작하면 첫 영역 표시가 늦어지므로,
 * 가장 먼저 쓰이는 시·도 경계(gzip 약 26KB)는 지도 응답과 병렬로 받아 둔다.
 */
export const usePrefetchSidoBoundary = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    void queryClient.prefetchQuery(
      getRegionBoundaryQueryOptions(MAP_REGION_CONFIG.BOUNDARY_PATH.sido),
    );
  }, [queryClient]);
};

/**
 * 핀(행정구역 클러스터)에 필요한 경계 파일만 불러와 투영된 경계를 반환한다.
 *
 * @returns regionsByPath: 경계 파일 경로 → (구역 코드 → 투영된 경계)
 *          settledPaths: 로딩이 끝난(성공/실패) 경계 파일 경로
 */
export const useRegionBoundaries = (pins: MapPin[]) => {
  // 응답이 바뀌어도 필요한 파일 목록이 같으면 같은 참조를 유지한다
  const pathsKey = useMemo(() => {
    const set = new Set<string>();
    pins.forEach((pin) => {
      if (pin.regionLevel && pin.regionCode) {
        set.add(getBoundaryPath(pin.regionLevel, pin.regionCode));
      }
    });
    return [...set].sort().join('|');
  }, [pins]);
  const paths = useMemo(() => (pathsKey ? pathsKey.split('|') : []), [pathsKey]);

  const combine = useCallback(
    (results: UseQueryResult<Map<string, ProjectedRegion>>[]) => {
      const regionsByPath = new Map<string, Map<string, ProjectedRegion>>();
      const settledPaths = new Set<string>();
      results.forEach((result, index) => {
        if (result.data) regionsByPath.set(paths[index], result.data);
        if (!result.isPending) settledPaths.add(paths[index]);
      });
      return { regionsByPath, settledPaths };
    },
    [paths],
  );

  return useQueries({
    queries: paths.map(getRegionBoundaryQueryOptions),
    combine,
  });
};
