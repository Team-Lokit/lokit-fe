/**
 * @fileoverview 사진 정보 기입 오버레이 컴포넌트
 *
 * 이 컴포넌트의 역할:
 * - 사진 선택 후 정보(위치, 메모, 앨범)를 입력하는 오버레이 UI
 * - Framer Motion으로 열기/닫기 애니메이션 처리
 * - AnimatePresence와 함께 사용하여 exit 애니메이션 지원
 *
 * 애니메이션 동작:
 * - 열기: 선택한 사진 셀 위치에서 scale 확대 + 페이드 인
 * - 닫기: scale 축소 + 페이드 아웃 (exit prop 사용)
 * - transformOrigin을 셀 중심으로 설정하여 자연스러운 확대/축소 효과
 *
 * 사용처:
 * - @modal/(.)note/page.tsx에서 인터셉트 모달로 사용
 * - AnimatePresence로 감싸서 exit 애니메이션 활성화 필요
 */
'use client';

import { ROUTES } from '@/constants';
import MapPreviewSheet from '@/components/map/mapPreview/MapPreviewSheet';
import { usePendingPhotos } from '@/stores/pendingPhotos/PendingPhotosContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePhotoContext } from '../../../_contexts/PhotoContext';
import { PHOTO_NOTE_OVERLAY_ANIMATION_DURATION } from '../../_constants';
import useAlbumModal from '../_hooks/useAlbumModal';
import useLocationModal from '../_hooks/useLocationModal';
import useMemoModal from '../_hooks/useMemoModal';
import { useReverseGeocode } from '../_hooks/useReverseGeocode';
import AlbumSelectOverlay from './AlbumSelectOverlay';
import LocationSelectOverlay from './LocationSelectOverlay';
import MemoModal from './MemoModal';
import * as S from './PhotoNoteOverlay.styles';
import AlbumSmallIcon from '@/assets/images/albumSmall.svg';
import ArrowRightIcon from '@/assets/images/arrowRight.svg';
import { useToast } from '@/components/toast';
import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { useTrackPage } from '@/hooks/analytics/useTrackPage';
import Chip from '@/components/buttons/chip/Chip';
import Tooltip from '@/components/tooltip/Tooltip';
import { PhotoHeader } from '@/components/header';

interface PhotoNoteOverlayProps {
  onClose: () => void;
}
export default function PhotoNoteOverlay({ onClose }: PhotoNoteOverlayProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { selectedPhoto, selectedPhotoRect, photos } = usePhotoContext();
  const {
    memo,
    tempMemo,
    setTempMemo,
    isOpen: isMemoModalOpen,
    openModal: handleAddMemo,
    closeModal: handleMemoModalClose,
    submitMemo: handleMemoSubmit,
  } = useMemoModal();

  const {
    selectedAlbum,
    tempSelectedAlbumId,
    setTempSelectedAlbumId,
    searchQuery,
    setSearchQuery,
    albums,
    isLoading: isAlbumsLoading,
    isOpen: isAlbumModalOpen,
    openModal: handleAlbumSelect,
    closeModal: handleAlbumModalClose,
    resetAlbum: handleAlbumReset,
    submitAlbum: handleAlbumSubmit,
  } = useAlbumModal();

  const {
    selectedLocation,
    tempSelectedLocationId,
    setTempSelectedLocationId,
    searchQuery: locationSearchQuery,
    setSearchQuery: setLocationSearchQuery,
    locations,
    isLoading: isLocationsLoading,
    isOpen: isLocationModalOpen,
    openModal: handleAddLocation,
    closeModal: handleLocationModalClose,
    submitLocation: handleLocationSubmit,
  } = useLocationModal();

  const { data: addressData } = useReverseGeocode({
    latitude: selectedPhoto?.location?.latitude,
    longitude: selectedPhoto?.location?.longitude,
  });

  const { addPendingPhoto } = usePendingPhotos();
  const isSubmittingRef = useRef(false);
  const shouldShowLocationUpdatedToastRef = useRef(false); // 사용자가 위치 선택 모달에서 수정한 건지 확인
  const [isMapPreviewOpen, setIsMapPreviewOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  useTrackPage(
    'screen_view_photo_info',
    selectedPhoto
      ? {
          photo_count: photos.length || 1,
          has_metadata_location: !!selectedPhoto.location,
        }
      : null,
  );

  useEffect(() => {
    if (!shouldShowLocationUpdatedToastRef.current) return;
    if (!selectedLocation) return;

    shouldShowLocationUpdatedToastRef.current = false;

    // 위치 수정 후에는 툴팁 안보이도록
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTooltipVisible(false);
    showToast('위치가 수정되었어요.', 3000, 'success');
  }, [selectedLocation, showToast]);

  const handleUpload = () => {
    if (!selectedPhoto || !hasLocation || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    track('click_photo_upload_submit', {
      photo_count: 1,
      has_memo: !!memo,
      has_location: hasLocation,
      has_album: !!selectedAlbum,
      ...(selectedAlbum ? { album_id: String(selectedAlbum.id) } : {}),
    });

    addPendingPhoto({
      photo: selectedPhoto,
      description: memo || undefined,
      albumId: selectedAlbum?.id,
      location:
        selectedLocation?.latitude != null && selectedLocation?.longitude != null
          ? {
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }
          : undefined,
    });

    showToast('사진이 추가되었어요');
    if (selectedAlbum) {
      router.replace(ROUTES.ALBUM.DETAIL(selectedAlbum.id));
    } else {
      router.replace(ROUTES.HOME);
    }
  };

  const handleClickClose = () => {
    track('click_photo_upload_close', {
      photo_count: 1,
      has_memo: !!memo,
      has_location: hasLocation,
      has_album: !!selectedAlbum,
    });
    onClose();
  };

  const handleClickAddLocation = () => {
    track('click_location_tag', {
      has_auto_location: !!selectedLocation,
    });
    handleAddLocation();
  };

  const handleSubmitLocation = () => {
    shouldShowLocationUpdatedToastRef.current = true;
    handleLocationSubmit();
  };

  const handleClickAddMemo = () => {
    track('click_memo_input', {});
    handleAddMemo();
  };

  const handleClickAlbumSelect = () => {
    track('click_album_select', {});
    handleAlbumSelect();
  };

  if (!selectedPhoto) {
    return null;
  }

  const hasPhotoLocation = !!selectedPhoto.location;
  const hasSelectedLocation = !!selectedLocation;
  const hasLocation = hasPhotoLocation || hasSelectedLocation;

  const locationText =
    selectedLocation?.roadAddress ||
    selectedLocation?.address ||
    selectedLocation?.placeName ||
    addressData?.address ||
    addressData?.placeName;

  /**
   * scale 애니메이션을 위한 초기값과 transform-origin 계산
   *
   * 동작 원리:
   * 1. 선택한 사진 셀의 위치(selectedPhotoRect)를 PhotoContext에서 가져옴
   * 2. 셀 크기 / 화면 크기 비율로 초기 scale 계산
   * 3. 셀 중심 좌표를 transform-origin으로 설정
   * 4. 이렇게 하면 셀 위치에서 확대되는 것처럼 보임
   */
  const getScaleAndOrigin = () => {
    // selectedPhotoRect가 없으면 (직접 URL 접근 등) 기본값 사용
    if (!selectedPhotoRect || typeof window === 'undefined') {
      return {
        scale: 0.9,
        originX: '50%',
        originY: '50%',
      };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 셀 크기 대비 화면 크기 비율 (작은 값 사용)
    const scaleX = selectedPhotoRect.width / viewportWidth;
    const scaleY = selectedPhotoRect.height / viewportHeight;

    // 셀 중심 위치를 transform-origin으로 사용
    const originX = selectedPhotoRect.left + selectedPhotoRect.width / 2;
    const originY = selectedPhotoRect.top + selectedPhotoRect.height / 2;

    return {
      scale: Math.min(scaleX, scaleY),
      originX: `${originX}px`,
      originY: `${originY}px`,
    };
  };

  const { scale, originX, originY } = getScaleAndOrigin();

  return (
    <motion.div
      // Framer Motion 애니메이션 설정
      // - initial: 컴포넌트 마운트 시 초기 상태 (작은 크기 + 투명)
      // - animate: 애니메이션 완료 후 상태 (전체 크기 + 불투명)
      // - exit: AnimatePresence 내에서 언마운트 시 상태 (다시 작아짐)
      initial={{ scale, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale, opacity: 0 }}
      transition={{
        type: 'tween',
        duration: PHOTO_NOTE_OVERLAY_ANIMATION_DURATION / 1000,
        ease: [0.32, 0.72, 0, 1], // 커스텀 이징 (부드러운 감속)
      }}
      style={{
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        inset: 0,
        height: '100dvh',
        zIndex: 100,
        overflow: 'hidden',
        // 이 지점을 중심으로 scale 변환이 일어남
        transformOrigin: `${originX} ${originY}`,
      }}
    >
      <S.Container>
        {/* 사진 영역 */}
        <S.PhotoSection>
          <S.PhotoFrame>
            <S.PhotoBlurBackground>
              <img src={selectedPhoto.uri} alt="" />
            </S.PhotoBlurBackground>

            <S.PhotoMain>
              <img src={selectedPhoto.uri} alt={selectedPhoto.filename} />
            </S.PhotoMain>
          </S.PhotoFrame>

          {/* 상단 오버레이 */}
          <S.TopOverlay>
            <PhotoHeader onClickBack={handleClickClose} showMenu={false} />
          </S.TopOverlay>

          {/* 메모, 앨범 오버레이 (사진에 오버레이) */}
          <S.MemoAlbumOverlay>
            <S.MemoButton type="button" onClick={handleClickAddMemo}>
              {memo || '메모 추가...'}
            </S.MemoButton>

            <S.ChipContainer>
              {/* 툴팁은 스크롤 컨테이너(ChipScrollRow) 바깥에 둔다.
                  overflow-x: auto가 걸린 컨테이너 안에 있으면 세로로 클리핑돼 안 보임. */}
              <AnimatePresence>
                {isTooltipVisible && (
                  <S.LocationTooltipPositioner
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                      delay: 0.5,
                    }}
                  >
                    <Tooltip
                      status={hasLocation ? 'info' : 'error'}
                      tooltipText={
                        hasLocation
                          ? '사진의 위치 정보를 자동으로 불러왔어요.'
                          : '반드시 위치를 추가해 주세요.'
                      }
                      showClose
                      arrowPosition="bottom"
                      arrowAlign="left"
                      onClose={() => setIsTooltipVisible(false)}
                    />
                  </S.LocationTooltipPositioner>
                )}
              </AnimatePresence>

              <S.ChipScrollRow>
                <S.LocationChipContainer>
                  <Chip
                    size="small"
                    icon={
                      <S.ChipIconWrapper>
                        <S.LocationArrowIcon />
                      </S.ChipIconWrapper>
                    }
                    text={locationText ?? '위치 추가...'}
                    onClick={handleClickAddLocation}
                  />
                </S.LocationChipContainer>
                <Chip
                  size="small"
                  icon={
                    <S.ChipIconWrapper>
                      <AlbumSmallIcon />
                    </S.ChipIconWrapper>
                  }
                  text={selectedAlbum?.title || '앨범 선택...'}
                  onClick={!selectedAlbum ? handleClickAlbumSelect : undefined}
                  onCancel={selectedAlbum ? handleAlbumReset : undefined}
                />
              </S.ChipScrollRow>
            </S.ChipContainer>
          </S.MemoAlbumOverlay>
        </S.PhotoSection>

        {/* 최하단 컨테이너 (사진 밑에 위치) */}
        <S.BottomContainer>
          <S.UploadButton type="button" onClick={handleUpload} disabled={!hasLocation}>
            <S.UploadIcon>
              <ArrowRightIcon width={24} height={24} />
            </S.UploadIcon>
          </S.UploadButton>
        </S.BottomContainer>
      </S.Container>

      <MemoModal
        isOpen={isMemoModalOpen}
        tempMemo={tempMemo}
        onChangeTempMemo={setTempMemo}
        onClose={handleMemoModalClose}
        onSubmit={handleMemoSubmit}
      />

      <AlbumSelectOverlay
        isOpen={isAlbumModalOpen}
        albums={albums}
        isLoading={isAlbumsLoading}
        selectedAlbumId={tempSelectedAlbumId}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        onSelectAlbum={setTempSelectedAlbumId}
        onClose={handleAlbumModalClose}
        onSubmit={handleAlbumSubmit}
      />

      <LocationSelectOverlay
        isOpen={isLocationModalOpen}
        locations={locations}
        isLoading={isLocationsLoading}
        selectedLocationId={tempSelectedLocationId}
        searchQuery={locationSearchQuery}
        onChangeSearchQuery={setLocationSearchQuery}
        onSelectLocation={setTempSelectedLocationId}
        onClose={handleLocationModalClose}
        onSubmit={handleSubmitLocation}
      />

      <MapPreviewSheet
        isOpen={isMapPreviewOpen}
        photoUrl={selectedPhoto.uri}
        onClose={() => setIsMapPreviewOpen(false)}
      />
    </motion.div>
  );
}
