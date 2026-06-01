'use client';

import Modal from '@/components/popup/modal/Modal';
import TextButton from '@/components/buttons/textButton/TextButton';
import * as S from './PhotoSourceSheet.styles';

interface PhotoSourceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectLibrary: () => void;
}

const PhotoSourceSheet = ({
  isOpen,
  onClose,
  onSelectCamera,
  onSelectLibrary,
}: PhotoSourceSheetProps) => {
  const handleSelectCamera = () => {
    onClose();
    onSelectCamera();
  };

  const handleSelectLibrary = () => {
    onClose();
    onSelectLibrary();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <S.TextWrapper>
          <S.Title>어떻게 사진을 추가할까요?</S.Title>
        </S.TextWrapper>
        <S.Actions>
          <TextButton text="갤러리에서 선택" onClick={handleSelectLibrary} />
          <TextButton text="사진 촬영" onClick={handleSelectCamera} />
        </S.Actions>
        <Modal.Footer>
          <TextButton text="취소" onClick={onClose} style={{ flex: 1 }} />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default PhotoSourceSheet;
