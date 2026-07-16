'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LocationState } from '@/types/map.type';
import { useMapMe } from '@/hooks/queries/useMapMe';
import { useAlbumPhotos } from '@/hooks/queries/useAlbumPhotos';
import {
  useGetAlbumMapInfo,
  useGetClusterPhotos,
  getGetLocationInfoQueryOptions,
  type AlbumWithPhotosResponse,
  type LocationInfoResponse,
  type AlbumThumbnails,
  type AlbumMapInfoResponse,
  type ClusterPhotoResponse,
} from '@repo/api-client';
import { MAP_CLUSTERING_CONFIG } from '@/constants/map';
import { VIEW_CONTEXT_TYPE, type ViewContext } from '@/constants/viewContext';

interface UseMapRouteDataProps {
  viewState: LocationState;
  viewContext: ViewContext;
  selectedAlbumId: number | null;
}

interface UseMapRouteDataReturn {
  albumList: AlbumThumbnails[];
  albumDetail: AlbumWithPhotosResponse | undefined | null;
  albumMapInfo: AlbumMapInfoResponse | undefined;
  mapPins: ReturnType<typeof useMapMe>['mapPins'];
  totalHistoryCount: number | undefined;
  profileImageUrl: string | undefined;
  clusterLocationData: LocationInfoResponse | undefined;
  clusterPhotosData: ClusterPhotoResponse[] | undefined;
  clusterExpansionData: Map<string, ClusterPhotoResponse[]> | undefined;
}

/**
 * 지도 표시에 필요한 모든 데이터를 페칭하는 커스텀 훅
 * /map/me 통합 API 사용으로 네트워크 효율성 개선
 * - photos/clusters: useMapMe에서 mapPins로 변환
 * - 선택된 앨범의 상세 정보 및 맵 정보
 * - 클러스터의 위치 및 사진 정보
 */
export const useMapRouteData = ({
  viewState,
  viewContext,
  selectedAlbumId,
}: UseMapRouteDataProps): UseMapRouteDataReturn => {
  // 선택된 앨범의 상세 정보 조회
  const { albumDetail } = useAlbumPhotos(selectedAlbumId);

  // 선택된 앨범의 맵 정보 (중심 좌표) 조회
  const { data: albumMapInfo } = useGetAlbumMapInfo(selectedAlbumId ?? 0);

  // 앨범, 클러스터 조회
  const {
    response: mapMeResponse,
    mapPins,
    clusterExpansionData,
  } = useMapMe({
    longitude: viewState.longitude,
    latitude: viewState.latitude,
    zoom: viewState.zoom,
    albumId: selectedAlbumId ?? undefined,
  });

  // 클러스터의 위치 정보 조회
  const clusterLatitude =
    viewContext.type === VIEW_CONTEXT_TYPE.CLUSTER_DETAIL && 'latitude' in viewContext
      ? viewContext.latitude
      : null;
  const clusterLongitude =
    viewContext.type === VIEW_CONTEXT_TYPE.CLUSTER_DETAIL && 'longitude' in viewContext
      ? viewContext.longitude
      : null;

  const { data: clusterLocationData } = useQuery({
    ...getGetLocationInfoQueryOptions({
      longitude: clusterLongitude ?? 0,
      latitude: clusterLatitude ?? 0,
    }),
    enabled: !!clusterLatitude && !!clusterLongitude,
  });

  // 클러스터의 사진 정보 조회
  const clusterId =
    viewContext.type === VIEW_CONTEXT_TYPE.CLUSTER_DETAIL && 'clusterId' in viewContext
      ? viewContext.clusterId
      : null;

  // 클라이언트 클러스터인지 판별
  const isClientCluster = clusterId?.startsWith(
    MAP_CLUSTERING_CONFIG.CLIENT_CLUSTER_PREFIX,
  );

  // 서버 클러스터인 경우에만 API 호출 (클라이언트 클러스터는 빈 문자열 전달)
  const { data: serverClusterPhotosData } = useGetClusterPhotos(
    isClientCluster || !clusterId ? '' : clusterId,
  );

  // 클라이언트 클러스터는 로컬 데이터 사용
  const clientClusterPhotosData = useMemo(() => {
    if (!isClientCluster || !clusterId || !clusterExpansionData) {
      return undefined;
    }
    return clusterExpansionData.get(clusterId);
  }, [isClientCluster, clusterId, clusterExpansionData]);

  const clusterPhotosData = isClientCluster
    ? clientClusterPhotosData
    : serverClusterPhotosData;

  return {
    albumList: mapMeResponse.data?.albums ?? [],
    albumDetail,
    albumMapInfo,
    mapPins,
    totalHistoryCount: mapMeResponse.data?.totalHistoryCount,
    profileImageUrl: mapMeResponse.data?.profileImageUrl,
    clusterLocationData,
    clusterPhotosData,
    clusterExpansionData,
  };
};
