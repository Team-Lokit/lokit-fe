import { useMemo } from 'react';
import {
  useGetPhotoDetail,
  getGetPhotoDetailQueryOptions,
  useGetPhotos,
  useGetDayPhotos,
  getGetDayPhotosQueryKey,
  useGetClusterPhotos,
  getGetClusterPhotosQueryOptions,
  getGetPhotosQueryKey,
  type PhotoResponse,
  type ClusterPhotoResponse,
} from '@repo/api-client';
import { getClusterFromSession } from '@/utils/sessionStorage';
import { MAP_CLUSTERING_CONFIG } from '@/constants/map';

interface UsePhotoDataProps {
  photoId: number;
  albumIdFromQuery?: number;
  clusterIdFromQuery?: string;
  /** 캘린더에서 진입한 날짜(YYYY-MM-DD). 있으면 해당 날짜 사진 목록을 슬라이더에 사용 */
  dateFromQuery?: string;
  /** false이면 모든 API 호출 건너뜀 (pending 사진 모드) */
  enabled?: boolean;
}

const convertClusterPhotoToPhotoResponse = (
  photo: ClusterPhotoResponse,
): PhotoResponse => ({
  id: photo.id,
  url: photo.url,
  takenAt: photo.takenAt,
  location: {
    longitude: photo.longitude,
    latitude: photo.latitude,
  },
  description: undefined,
});

const sortPhotosByDate = (photos: PhotoResponse[]): PhotoResponse[] => {
  return [...photos].sort((a, b) => {
    const dateA = a.takenAt ? new Date(a.takenAt).getTime() : 0;
    const dateB = b.takenAt ? new Date(b.takenAt).getTime() : 0;
    return dateB - dateA;
  });
};

const usePhotoData = ({
  photoId,
  albumIdFromQuery,
  clusterIdFromQuery,
  dateFromQuery,
  enabled = true,
}: UsePhotoDataProps) => {
  // 클라이언트 클러스터 여부 판별
  const isClientCluster = clusterIdFromQuery?.startsWith(
    MAP_CLUSTERING_CONFIG.CLIENT_CLUSTER_PREFIX,
  );

  // 클라이언트 클러스터인 경우 sessionStorage에서 데이터 가져오기
  // 아니면 서버 API 호출
  const clientClusterPhotosData = useMemo(() => {
    if (isClientCluster && clusterIdFromQuery) {
      return getClusterFromSession<ClusterPhotoResponse[]>(clusterIdFromQuery);
    }
    return null;
  }, [isClientCluster, clusterIdFromQuery]);

  // 클라이언트 클러스터인 경우 sessionStorage에서 photoDetail 생성
  const clientClusterPhotoDetail = useMemo(() => {
    if (!isClientCluster || !clientClusterPhotosData) return undefined;

    const photo = clientClusterPhotosData.find((p) => p.id === photoId);
    if (!photo) return undefined;

    return convertClusterPhotoToPhotoResponse(photo);
  }, [isClientCluster, clientClusterPhotosData, photoId]);

  // 클라이언트 클러스터가 아닌 경우에만 API 호출
  // 또는 클라이언트 클러스터이지만 sessionStorage에 데이터가 없으면 API 호출 (fallback)
  const shouldFetchPhotoDetail =
    enabled && photoId > 0 && (!isClientCluster || !clientClusterPhotoDetail);

  const photoDetailId = shouldFetchPhotoDetail ? photoId : 0;
  const { data: apiPhotoDetail, isLoading: isApiLoading } = useGetPhotoDetail(
    photoDetailId,
    {
      query: {
        ...getGetPhotoDetailQueryOptions(photoDetailId),
        enabled: shouldFetchPhotoDetail,
      },
    },
  );

  const clusterIdForFetch =
    isClientCluster || !clusterIdFromQuery ? '' : clusterIdFromQuery;
  const { data: serverClusterPhotosData } = useGetClusterPhotos(clusterIdForFetch, {
    query: {
      ...getGetClusterPhotosQueryOptions(clusterIdForFetch),
      enabled: enabled && !isClientCluster && !!clusterIdFromQuery,
    },
  });

  const clusterPhotosData = isClientCluster
    ? clientClusterPhotosData
    : serverClusterPhotosData;

  const firstClusterPhoto = clusterPhotosData?.[0];
  const clusterFallbackPhotoDetail = firstClusterPhoto
    ? convertClusterPhotoToPhotoResponse(firstClusterPhoto)
    : undefined;

  const photoDetail =
    clientClusterPhotoDetail || apiPhotoDetail || clusterFallbackPhotoDetail;
  const isPhotoLoading = shouldFetchPhotoDetail ? isApiLoading : false;

  const { data: albumPhotos } = useGetPhotos(albumIdFromQuery ?? 0, {
    query: {
      queryKey: getGetPhotosQueryKey(albumIdFromQuery),
      enabled: enabled && !!albumIdFromQuery && !clusterIdFromQuery && !dateFromQuery,
    },
  });

  const dayPhotosParams = albumIdFromQuery ? { albumId: albumIdFromQuery } : undefined;
  const { data: dayPhotos } = useGetDayPhotos(dateFromQuery ?? '', dayPhotosParams, {
    query: {
      queryKey: getGetDayPhotosQueryKey(dateFromQuery ?? '', dayPhotosParams),
      enabled: enabled && !!dateFromQuery && !clusterIdFromQuery,
    },
  });

  const photos = useMemo(() => {
    let photoList: PhotoResponse[] = [];

    // 클러스터 사진 우선
    if (clusterPhotosData && Array.isArray(clusterPhotosData)) {
      photoList = clusterPhotosData.map(convertClusterPhotoToPhotoResponse);
    } else if (dateFromQuery) {
      photoList = (dayPhotos?.photos ?? []).map(({ id, url, takenAt }) => ({
        id,
        url,
        takenAt,
      }));
    } else if (albumPhotos?.albums?.[0]?.photos) {
      photoList = albumPhotos.albums[0].photos;
    }

    // 날짜순 정렬
    return sortPhotosByDate(photoList);
  }, [clusterPhotosData, dateFromQuery, dayPhotos, albumPhotos]);

  return {
    photoDetail,
    photos,
    isPhotoLoading,
  };
};

export default usePhotoData;
