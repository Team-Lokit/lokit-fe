'use client';

import { useRouter } from 'next/navigation';
import DefaultHeader from '@/components/header/default/DefaultHeader';
import { ROUTES } from '@/constants';
import { usePhotoContext } from '../../_contexts/PhotoContext';

export default function PhotoNoteAddPage() {
  const router = useRouter();
  const { selectedPhoto } = usePhotoContext();

  const handleBack = () => {
    router.push(ROUTES.PHOTO.ADD);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#242426' }}>
      <DefaultHeader title="사진 정보 기입" onClickBack={handleBack} />
      <div style={{ padding: 20 }}>
        {selectedPhoto ? (
          <div>
            <img
              src={selectedPhoto.uri}
              alt={selectedPhoto.filename}
              style={{ width: '100%', maxWidth: 400, borderRadius: 8 }}
            />
            <p style={{ color: '#B2B2B4', marginTop: 16 }}>
              (사진 정보 기입 페이지 - 구현 예정)
            </p>
          </div>
        ) : (
          <p style={{ color: '#B2B2B4' }}>선택된 사진이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
