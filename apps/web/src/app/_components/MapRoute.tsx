'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetClusterPhotosQueryOptions, useGetMyPage } from '@repo/api-client';
import MapView from '@/components/map/MapView';
import Sidebar from '@/components/sidebar/Sidebar';
import ViewSwitcher, {
  VIEW_TYPE,
  type ViewType,
} from '@/components/viewSwitcher/ViewSwitcher';
import FloatingButton from '@/components/buttons/floatingButton/FloatingButton';
import PhotoGridContainer from '@/components/photoGridContainer/PhotoGridContainer';
import PhotoGridItem from '@/components/photoGridItem/PhotoGridItem';
import HomeEmptyState from '@/components/common/homeEmptyState/HomeEmptyState';
import CrossHairIcon from '@/assets/images/crossHair.svg';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import AddIcon from '@/assets/images/add.svg';
import MenuButton from '@/components/buttons/menuButton/MenuButton';
import TextButton from '@/components/buttons/textButton/TextButton';
import { MapPin } from '@/types/map.type';
import { ROUTES } from '@/constants/routes';
import { VIEW_CONTEXT_TYPE } from '@/constants/viewContext';
import { track } from '@/lib/analytics';
import { useTrackPage } from '@/hooks/analytics/useTrackPage';
import * as S from '../page.styles';
import { useMapRouteViewState } from '../_hooks/useMapRouteViewState';
import { useMapRouteViewContext } from '../_hooks/useMapRouteViewContext';
import { useMapRouteData } from '../_hooks/useMapRouteData';
import { usePendingPhotosViewModel } from '@/hooks/usePendingPhotosViewModel';
import {
  calculatePhotoCount,
  calculateCenterFromAlbumPhotos,
} from '../_utils/mapRoute.calc';
import { MapRouteHeader } from './MapRouteHeader';
import { AlbumAddModalContainer } from './albumAddModal/AlbumAddModalContainer';
import { AlbumRenameModalContainer } from './albumRenameModal/AlbumRenameModalContainer';
import { AlbumDeleteModalContainer } from './albumDeleteModal/AlbumDeleteModalContainer';
import LocationPermissionModal from './locationPermissionModal/LocationPermissionModal';
import { getCurrentPosition } from '@/utils/getCurrentPosition';
import { validateCenterCoordinate } from '../_utils/mapRoute.calc';
import { saveClusterToSession } from '@/utils/sessionStorage';
import { usePhotoContext } from '@/app/photo/_contexts/PhotoContext';
import { usePhotoSelect } from '@/app/photo/add/_hooks/usePhotoSelect';
import type { SelectedPhoto } from '@/app/photo/add/_types/photo';

export default function MapRoute() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 사이드바 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>(VIEW_TYPE.MAP);

  // 사용자 프로필 데이터
  const { data: myPageData } = useGetMyPage();

  // 상태 관리
  const { viewState, mapViewRef, handleViewStateChange, handleGoToCurrentLocation } =
    useMapRouteViewState();

  const { viewContext, setViewContext, selectedAlbumId } = useMapRouteViewContext();

  // 데이터 페칭
  const {
    albumList,
    address,
    albumDetail,
    albumMapInfo,
    mapPins,
    totalHistoryCount,
    profileImageUrl,
    clusterExpansionData,
  } = useMapRouteData({
    viewState,
    viewContext,
    selectedAlbumId,
  });

  // Pending 사진 merge (앨범 리스트 + 앨범 상세)
  const { albumList: mergedAlbumList, displayPhotos } = usePendingPhotosViewModel(
    albumList,
    albumDetail,
  );

  // 사진 추가
  const { addPhotos, setSelectedPhoto, setInitialAlbumId, resetPhotoNoteState } =
    usePhotoContext();

  const handlePhotosSelected = useCallback(
    (newPhotos: SelectedPhoto[]) => {
      addPhotos(newPhotos);
      if (newPhotos.length > 0) {
        const source =
          viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL ? 'album_detail' : 'home';
        track('select_photo', {
          photo_count: newPhotos.length,
          source,
        });
        setSelectedPhoto(newPhotos[0]);
        resetPhotoNoteState(newPhotos[0]);
        const albumId =
          viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL
            ? viewContext.albumId
            : null;
        setInitialAlbumId(albumId);
        router.push(ROUTES.PHOTO.NOTE.ADD);
      }
    },
    [
      addPhotos,
      setSelectedPhoto,
      resetPhotoNoteState,
      setInitialAlbumId,
      router,
      viewContext,
    ],
  );

  const { selectPhotosFromFile } = usePhotoSelect({
    onPhotosSelected: handlePhotosSelected,
  });

  // 모달 상태 관리
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLocationDeniedModalOpen, setIsLocationDeniedModalOpen] = useState(false);
  const [menuAlbumId, setMenuAlbumId] = useState<number | undefined>(undefined);
  const [menuAlbumTitle, setMenuAlbumTitle] = useState<string | undefined>(undefined);

  // 앨범이 선택되었을 때 앨범의 중심 위치로 지도 이동
  useEffect(() => {
    if (!selectedAlbumId) {
      return;
    }

    let centerInfo = null;
    if (albumDetail?.photos && albumDetail.photos.length > 0) {
      centerInfo = calculateCenterFromAlbumPhotos(albumDetail.photos);
    } else if (albumMapInfo) {
      centerInfo = validateCenterCoordinate(
        albumMapInfo.centerLongitude,
        albumMapInfo.centerLatitude,
        albumMapInfo.boundingBox,
      );
    }

    if (centerInfo) {
      handleViewStateChange({
        longitude: centerInfo.longitude,
        latitude: centerInfo.latitude,
        zoom: centerInfo.zoom,
      });
    }
  }, [selectedAlbumId, albumDetail, albumMapInfo, handleViewStateChange]);

  useEffect(() => {
    const initLocation = async () => {
      const position = await getCurrentPosition();
      if (!position) {
        setIsLocationDeniedModalOpen(true);
        return;
      }
    };
    initLocation();
  }, []);

  useTrackPage(
    'screen_view_home',
    viewContext.type === VIEW_CONTEXT_TYPE.HOME && totalHistoryCount !== undefined
      ? { view_mode: activeView, total_records: totalHistoryCount }
      : null,
  );

  useTrackPage(
    'screen_view_album_detail',
    viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL && albumDetail?.id !== undefined
      ? {
          album_id: String(albumDetail.id),
          album_name: albumDetail.title ?? '',
          record_count: albumDetail.photoCount ?? 0,
          view_mode: activeView,
        }
      : null,
    albumDetail?.id,
  );

  // 계산된 데이터
  const photoCount = useMemo(() => {
    return calculatePhotoCount(viewContext, albumDetail, 0, totalHistoryCount);
  }, [viewContext, albumDetail, totalHistoryCount]);

  const selectedAlbumTitle = albumDetail?.title;

  const isCustomAlbumSelected =
    selectedAlbumId != null && selectedAlbumId !== mergedAlbumList[0]?.id;

  const handlePinClick = async (pin: MapPin) => {
    if (!pin.isCluster) {
      track('click_map_photo_pin', {
        photo_id: String(pin.id),
        location_name: address ?? '',
      });
      const pinSource =
        viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL ? 'album_detail' : 'home_map';
      const pinUrl = ROUTES.PHOTO.VIEW(pin.id);
      router.push(`${pinUrl}${pinUrl.includes('?') ? '&' : '?'}source=${pinSource}`);
      return;
    }

    const clusterId = pin.clusterId;
    if (!clusterId) return;

    track('click_photo_cluster', {
      cluster_count: pin.imageCount,
      location_name: address ?? '',
    });

    let photos = clusterExpansionData?.get(clusterId);

    if (!photos) {
      try {
        photos = await queryClient.fetchQuery(getGetClusterPhotosQueryOptions(clusterId));
      } catch {
        console.error('[MapRoute] Failed to load cluster photos');
        return;
      }
    }

    if (!photos?.length) return;

    saveClusterToSession(clusterId, photos);
    const firstPhotoId = photos.find((photo) => !!photo.id)?.id;
    if (!firstPhotoId) return;

    const clusterSource =
      viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL ? 'album_detail' : 'home_map';
    router.push(
      `${ROUTES.PHOTO.VIEW_WITH_CLUSTER(firstPhotoId, clusterId)}&source=${clusterSource}`,
    );
  };

  const handleOpenSidebar = () => {
    track('click_sidebar_open', {
      total_records: totalHistoryCount ?? 0,
    });
    setIsSidebarOpen(true);
  };

  const handleSidebarNewAlbum = () => {
    track('click_sidebar_new_album', {});
    setIsAddModalOpen(true);
  };

  const handleSelectAlbum = (albumId: number, position: number) => {
    const album = mergedAlbumList.find((a) => a.id === albumId);
    track('click_sidebar_album', {
      album_id: String(albumId),
      album_name: album?.title ?? '',
      album_position: position,
    });
    setViewContext({ type: VIEW_CONTEXT_TYPE.ALBUM_DETAIL, albumId });
    setIsSidebarOpen(false);
    router.push(`/album/${albumId}`);
  };

  const handleRenameAlbum = (albumId: number) => {
    const album = mergedAlbumList.find((a) => a.id === albumId);
    setMenuAlbumId(albumId);
    setMenuAlbumTitle(album?.title ?? '');
    setIsRenameModalOpen(true);
  };

  const handleDeleteAlbum = (albumId: number) => {
    setMenuAlbumId(albumId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseRenameModal = () => {
    setIsRenameModalOpen(false);
    setMenuAlbumId(undefined);
    setMenuAlbumTitle(undefined);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMenuAlbumId(undefined);
  };

  const handleCloseLocationDeniedModal = () => {
    setIsLocationDeniedModalOpen(false);
  };

  return (
    <S.Wrapper>
      <S.HeaderContainer>
        <MapRouteHeader
          viewContext={viewContext}
          selectedAlbumTitle={selectedAlbumTitle}
          address={address}
          onOpenSidebar={handleOpenSidebar}
          onRenameAlbum={
            isCustomAlbumSelected ? () => handleRenameAlbum(selectedAlbumId) : undefined
          }
          onDeleteAlbum={
            isCustomAlbumSelected ? () => handleDeleteAlbum(selectedAlbumId) : undefined
          }
        />
      </S.HeaderContainer>

      {activeView === VIEW_TYPE.MAP && viewState && (
        <MapView
          ref={mapViewRef}
          locationState={viewState}
          pins={mapPins}
          onPinClick={handlePinClick}
          onViewStateChange={handleViewStateChange}
        />
      )}

      {activeView === VIEW_TYPE.GRID && (
        <S.GridViewContainer>
          {displayPhotos.length === 0 ? (
            <S.EmptyState>
              <HomeEmptyState
                onAddPhoto={() => selectPhotosFromFile()}
                onAddAlbum={() => setIsAddModalOpen(true)}
              />
            </S.EmptyState>
          ) : (
            <PhotoGridContainer>
              {displayPhotos.map((photo) =>
                photo.kind === 'pending' ? (
                  <PhotoGridItem
                    key={photo.pendingId}
                    src={photo.url}
                    date={photo.takenAt}
                    onClick={() => {}}
                    progress={photo.progress}
                    hasError={photo.status === 'error'}
                  />
                ) : (
                  <PhotoGridItem
                    key={photo.id}
                    src={photo.url ?? ''}
                    date={photo.takenAt}
                    onClick={() => {
                      track('click_grid_photo_thumb', {
                        photo_id: String(photo.id),
                        photo_date: photo.takenAt ?? '',
                      });
                      const url = ROUTES.PHOTO.VIEW(photo.id!);
                      const gridSource =
                        viewContext.type === VIEW_CONTEXT_TYPE.ALBUM_DETAIL
                          ? 'album_detail'
                          : 'home_grid';
                      router.push(
                        `${url}${url.includes('?') ? '&' : '?'}source=${gridSource}`,
                      );
                    }}
                  />
                ),
              )}
            </PhotoGridContainer>
          )}
        </S.GridViewContainer>
      )}

      <S.ActionColumn>
        <MenuButton
          triggerIcon={(isOpen) => (
            <AddIcon
              style={{
                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          )}
          placement="top"
        >
          <TextButton
            text="사진 추가"
            onClick={() => {
              track('screen_view_photo_picker', { source: 'home' });
              selectPhotosFromFile();
            }}
            textAlign="left"
          />
          <TextButton
            text="앨범 추가"
            onClick={() => setIsAddModalOpen(true)}
            textAlign="left"
          />
        </MenuButton>

        <CircleButton aria-label="현재 위치로 이동" onClick={handleGoToCurrentLocation}>
          <CrossHairIcon />
        </CircleButton>
      </S.ActionColumn>

      <S.FloatingButtonWrapper>
        <FloatingButton text={`기록 ${photoCount}개`} />
      </S.FloatingButtonWrapper>

      <S.ViewSwitcherWrapper>
        <ViewSwitcher
          activeView={activeView}
          onChangeView={(view) => {
            if (view !== activeView) {
              track('click_view_mode_switch', {
                from_mode: activeView,
                to_mode: view,
              });
            }
            setActiveView(view);
          }}
        />
      </S.ViewSwitcherWrapper>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        albums={mergedAlbumList}
        nickname={myPageData?.myName ?? ''}
        dDay={myPageData?.coupledDay ?? 0}
        profileImageUrl={myPageData?.myProfileImageUrl ?? profileImageUrl}
        selectedAlbumId={selectedAlbumId}
        onExplore={() => router.push(ROUTES.EXPLORE)}
        onNewAlbum={handleSidebarNewAlbum}
        onSelectAlbum={handleSelectAlbum}
        onRenameAlbum={handleRenameAlbum}
        onDeleteAlbum={handleDeleteAlbum}
        onMyPage={() => router.push(ROUTES.MYPAGE)}
      />

      <AlbumAddModalContainer
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        currentAlbumCount={mergedAlbumList.length}
      />
      <AlbumRenameModalContainer
        isOpen={isRenameModalOpen}
        onClose={handleCloseRenameModal}
        selectedAlbumId={menuAlbumId ?? selectedAlbumId ?? undefined}
        initialTitle={menuAlbumTitle ?? selectedAlbumTitle}
      />
      <AlbumDeleteModalContainer
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        selectedAlbumId={menuAlbumId ?? selectedAlbumId ?? undefined}
      />
      <LocationPermissionModal
        isOpen={isLocationDeniedModalOpen}
        onClose={handleCloseLocationDeniedModal}
      />
    </S.Wrapper>
  );
}
