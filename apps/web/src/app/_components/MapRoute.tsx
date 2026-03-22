'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetClusterPhotosQueryOptions, useGetMyPage } from '@repo/api-client';
import MapView from '@/components/map/MapView';
import Sidebar from '@/components/sidebar/Sidebar';
import ViewSwitcher from '@/components/viewSwitcher/ViewSwitcher';
import FloatingButton from '@/components/buttons/floatingButton/FloatingButton';
import PhotoGridContainer from '@/components/photoGridContainer/PhotoGridContainer';
import PhotoGridItem from '@/components/photoGridItem/PhotoGridItem';
import CrossHairIcon from '@/assets/images/crossHair.svg';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import AddIcon from '@/assets/images/add.svg';
import MenuButton from '@/components/buttons/menuButton/MenuButton';
import TextButton from '@/components/buttons/textButton/TextButton';
import { MapPin } from '@/types/map.type';
import { ROUTES } from '@/constants/routes';
import { SHEET_CONTEXT_TYPE } from '@/components/bottomSheet/constants';
import * as S from '../page.styles';
import { useMapRouteViewState } from '../_hooks/useMapRouteViewState';
import { useMapRouteSheetContext } from '../_hooks/useMapRouteSheetContext';
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
  const [activeView, setActiveView] = useState<'map' | 'grid'>('map');

  // 사용자 프로필 데이터
  const { data: myPageData } = useGetMyPage();

  // 상태 관리
  const { viewState, mapViewRef, handleViewStateChange, handleGoToCurrentLocation } =
    useMapRouteViewState();

  const { sheetContext, setSheetContext, selectedAlbumId } = useMapRouteSheetContext();

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
    sheetContext,
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
        setSelectedPhoto(newPhotos[0]);
        resetPhotoNoteState(newPhotos[0]);
        const albumId =
          sheetContext.type === SHEET_CONTEXT_TYPE.ALBUM_DETAIL
            ? sheetContext.albumId
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
      sheetContext,
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

  // 계산된 데이터
  const photoCount = useMemo(() => {
    return calculatePhotoCount(sheetContext, albumDetail, 0, totalHistoryCount);
  }, [sheetContext, albumDetail, totalHistoryCount]);

  const selectedAlbumTitle = albumDetail?.title;

  const handlePinClick = async (pin: MapPin) => {
    if (!pin.isCluster) {
      router.push(ROUTES.PHOTO.VIEW(pin.id));
      return;
    }

    const clusterId = pin.clusterId;
    if (!clusterId) return;

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

    router.push(ROUTES.PHOTO.VIEW_WITH_CLUSTER(firstPhotoId, clusterId));
  };

  const handleSelectAlbum = (albumId: number) => {
    setSheetContext({ type: SHEET_CONTEXT_TYPE.ALBUM_DETAIL, albumId });
    setIsSidebarOpen(false);
    router.push(`/album/${albumId}`);
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
          sheetContext={sheetContext}
          selectedAlbumTitle={selectedAlbumTitle}
          address={address}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
      </S.HeaderContainer>

      {activeView === 'map' && viewState && (
        <MapView
          ref={mapViewRef}
          locationState={viewState}
          pins={mapPins}
          onPinClick={handlePinClick}
          onViewStateChange={handleViewStateChange}
        />
      )}

      {activeView === 'grid' && (
        <S.GridViewContainer>
          {displayPhotos.length === 0 ? (
            <S.EmptyState>
              <S.EmptyTitle>기록이 없어요</S.EmptyTitle>
              <S.EmptyDescription>함께 기록을 추가해볼까요?</S.EmptyDescription>
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
                      if (photo.id) {
                        router.push(ROUTES.PHOTO.VIEW(photo.id));
                      }
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
            onClick={() => selectPhotosFromFile()}
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
        <ViewSwitcher activeView={activeView} onChangeView={setActiveView} />
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
        onNewAlbum={() => setIsAddModalOpen(true)}
        onSelectAlbum={handleSelectAlbum}
        onMyPage={() => router.push(ROUTES.MYPAGE)}
      />

      <AlbumAddModalContainer
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
