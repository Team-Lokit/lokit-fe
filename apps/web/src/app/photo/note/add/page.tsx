'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DefaultHeader from '@/components/header/default/DefaultHeader';
import Textarea from '@/components/textarea/Textarea';
import Button from '@/components/buttons/button/Button';
import { ROUTES } from '@/constants';
import { usePhotoContext } from '../../_contexts/PhotoContext';
import { useReverseGeocode } from './_hooks/useReverseGeocode';
import { usePhotoUpload } from './_hooks/usePhotoUpload';
import * as S from './page.styles';

// TODO: 사용자 컨텍스트에서 가져오도록 수정
const TEMP_USER_ID = 1;

export default function PhotoNoteAddPage() {
  const router = useRouter();
  const { selectedPhoto } = usePhotoContext();
  const [memo, setMemo] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | undefined>();

  const { data: addressData, isLoading: isAddressLoading } = useReverseGeocode({
    latitude: selectedPhoto?.location?.latitude,
    longitude: selectedPhoto?.location?.longitude,
  });

  const { mutate: uploadPhoto, isPending: isUploading } = usePhotoUpload();

  const handleBack = () => {
    router.push(ROUTES.PHOTO.ADD);
  };

  const handleUpload = () => {
    if (!selectedPhoto) return;

    uploadPhoto(
      {
        photo: selectedPhoto,
        description: memo || undefined,
        albumId: selectedAlbumId,
        userId: TEMP_USER_ID,
      },
      {
        onSuccess: () => {
          router.push(ROUTES.HOME);
        },
        onError: (error) => {
          console.error('Upload failed:', error);
          // TODO: 에러 토스트 표시
        },
      }
    );
  };

  const handleAlbumSelect = () => {
    // TODO: 앨범 선택 모달 구현
    console.log('Open album selector');
  };

  const handleAddLocation = () => {
    // TODO: 위치 추가 모달 구현
    console.log('Open location modal');
  };

  if (!selectedPhoto) {
    return (
      <S.Container>
        <DefaultHeader title="사진 정보 기입" onClickBack={handleBack} />
        <S.Content>
          <S.LocationPlaceholder>선택된 사진이 없습니다.</S.LocationPlaceholder>
        </S.Content>
      </S.Container>
    );
  }

  const hasLocation = !!selectedPhoto.location;
  const locationDisplay = isAddressLoading
    ? '위치 정보 불러오는 중...'
    : addressData?.placeName || addressData?.address;

  return (
    <S.Container>
      <DefaultHeader title="사진 정보 기입" onClickBack={handleBack} />

      <S.Content>
        <S.PhotoPreview>
          <img src={selectedPhoto.uri} alt={selectedPhoto.filename} />
        </S.PhotoPreview>

        <S.Section>
          <S.SectionLabel>위치</S.SectionLabel>
          <S.LocationContainer>
            <S.LocationIcon>
              <LocationPinIcon />
            </S.LocationIcon>
            {hasLocation ? (
              <S.LocationText>{locationDisplay}</S.LocationText>
            ) : (
              <>
                <S.LocationPlaceholder>위치 정보 없음</S.LocationPlaceholder>
                <S.LocationButton type="button" onClick={handleAddLocation}>
                  추가
                </S.LocationButton>
              </>
            )}
          </S.LocationContainer>
        </S.Section>

        <S.Section>
          <S.SectionLabel>메모</S.SectionLabel>
          <Textarea
            value={memo}
            onChange={setMemo}
            placeholder="사진에 대한 메모를 입력하세요"
            max={500}
          />
        </S.Section>

        <S.Section>
          <S.SectionLabel>앨범</S.SectionLabel>
          <S.AlbumSelector type="button" onClick={handleAlbumSelect}>
            <S.AlbumText>앨범 선택</S.AlbumText>
            <S.ChevronIcon>
              <ChevronRightIcon />
            </S.ChevronIcon>
          </S.AlbumSelector>
        </S.Section>
      </S.Content>

      <S.BottomSection>
        <Button
          text={isUploading ? '업로드 중...' : '업로드'}
          onClick={handleUpload}
          size="large"
          disabled={isUploading}
        />
      </S.BottomSection>
    </S.Container>
  );
}

const LocationPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      fill="currentColor"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"
      fill="currentColor"
    />
  </svg>
);
