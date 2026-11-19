'use client';

import Modal from '@/components/popup/modal/Modal';
import TextButton from '@/components/buttons/textButton/TextButton';
import * as S from './CodeMismatchModal.styles';

interface CodeMismatchModalProps {
  isOpen: boolean;
  /** 다시 입력하기 (배경을 눌러 닫을 때도 호출) */
  onRetry: () => void;
}

/** 입력한 초대 코드가 일치하지 않을 때 보여주는 모달 */
export default function CodeMismatchModal({ isOpen, onRetry }: CodeMismatchModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onRetry}>
      <Modal.Content>
        <S.TextGroup>
          <S.Title>코드가 일치하지 않아요</S.Title>
          <S.Description>상대방의 초대 코드를 다시 확인해 주세요.</S.Description>
        </S.TextGroup>
        <Modal.Footer>
          <TextButton
            text="다시 입력하기"
            variant="primary"
            onClick={onRetry}
            style={{ flex: 1 }}
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
