import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  useDelete,
  getGetPhotosQueryKey,
  getGetMapMeV11QueryKey,
  getGetPhotoDetailQueryKey,
  getGetClusterPhotosQueryKey,
  type AlbumThumbnails,
  type PhotoListResponse,
} from '@repo/api-client';
import { useToast } from '@/components/toast/ToastProvider';

interface ConfirmDeleteParams {
  photoId: number;
  albumId?: number;
  clusterId?: string;
}

const usePhotoDelete = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync: deletePhotoAsync, isPending: isDeleting } = useDelete();

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = async ({ photoId, albumId, clusterId }: ConfirmDeleteParams) => {
    // 낙관적 업데이트를 위한 이전 데이터 스냅샷
    const previousAlbums = queryClient.getQueryData<AlbumThumbnails[]>(
      getGetMapMeV11QueryKey(),
    );
    const previousPhotos = albumId
      ? queryClient.getQueryData<PhotoListResponse>(getGetPhotosQueryKey(albumId))
      : undefined;

    // 앨범 사진 목록에서 낙관적으로 제거
    if (albumId) {
      queryClient.setQueryData<PhotoListResponse>(
        getGetPhotosQueryKey(albumId),
        (old) => {
          if (!old?.albums?.length) return old;
          return {
            ...old,
            albums: old.albums.map((album) =>
              album.id === albumId
                ? {
                    ...album,
                    photoCount: Math.max((album.photoCount ?? 0) - 1, 0),
                    photos: (album.photos ?? []).filter((p) => p.id !== photoId),
                  }
                : album,
            ),
          };
        },
      );
    }

    // 앨범 썸네일 목록 낙관적 업데이트 (photoCount만 갱신, thumbnailUrls는 invalidate로 동기화)
    if (albumId) {
      queryClient.setQueryData<AlbumThumbnails[]>(getGetMapMeV11QueryKey(), (old) => {
        if (!old) return old;
        return old.map((album) =>
          album.id === albumId
            ? {
                ...album,
                photoCount: Math.max((album.photoCount ?? 0) - 1, 0),
              }
            : album,
        );
      });
    }

    // 낙관적 업데이트: 삭제 완료를 기다리지 않고 즉시 이동
    showToast('사진이 삭제되었습니다');
    closeDeleteModal();
    router.back();

    try {
      await deletePhotoAsync({ id: photoId });
      queryClient.removeQueries({ queryKey: getGetPhotoDetailQueryKey(photoId) });
      queryClient.invalidateQueries({ queryKey: getGetMapMeV11QueryKey() });

      // 전체 사진 앨범(첫 번째 앨범)은 항상 invalidate
      const cachedAlbums = queryClient.getQueryData<AlbumThumbnails[]>(
        getGetMapMeV11QueryKey(),
      );
      const allPhotosAlbumId = cachedAlbums?.[0]?.id;
      if (allPhotosAlbumId) {
        queryClient.invalidateQueries({
          queryKey: getGetPhotosQueryKey(allPhotosAlbumId),
        });
      }
      // 특정 앨범에서 삭제한 경우 해당 앨범도 invalidate
      if (albumId && albumId !== allPhotosAlbumId) {
        queryClient.invalidateQueries({ queryKey: getGetPhotosQueryKey(albumId) });
      }
      // 클러스터 캐시 invalidate (클러스터 뷰에서 삭제 시 지도에 반영)
      if (clusterId) {
        queryClient.invalidateQueries({
          queryKey: getGetClusterPhotosQueryKey(clusterId),
        });
      }
      queryClient.invalidateQueries({ queryKey: ['mapPhotos'] });
    } catch {
      if (previousAlbums !== undefined) {
        queryClient.setQueryData(getGetMapMeV11QueryKey(), previousAlbums);
      }
      if (albumId && previousPhotos !== undefined) {
        queryClient.setQueryData(getGetPhotosQueryKey(albumId), previousPhotos);
      }
      showToast('삭제에 실패했습니다. 다시 시도해주세요');
    }
  };

  return {
    isModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
};

export default usePhotoDelete;
