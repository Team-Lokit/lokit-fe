'use client';

import Modal from '@/components/popup/modal/Modal';
import TextButton from '@/components/buttons/textButton/TextButton';
import * as S from './CommentDeleteModal.styles';

interface CommentDeleteModalProps {
  isOpen: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CommentDeleteModal = ({
  isOpen,
  isDeleting = false,
  onClose,
  onConfirm,
}: CommentDeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <S.TextWrapper>
          <S.Title>댓글을 삭제할까요?</S.Title>
        </S.TextWrapper>
        <Modal.Footer>
          <TextButton
            text="취소"
            onClick={onClose}
            disabled={isDeleting}
            style={{ flex: 1 }}
          />
          <TextButton
            text="삭제하기"
            variant="negative"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{ flex: 1 }}
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default CommentDeleteModal;
