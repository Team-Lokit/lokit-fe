import { useRef, useState } from 'react';
import { usePhotoContext } from '@/app/photo/_contexts/PhotoContext';
import { STATE_SOURCE, type StateSource } from '@/app/photo/_constants/stateSource';
import { track } from '@/lib/analytics';

interface UseMemoModalOptions {
  /** 상태 소스: 사진 추가(NOTE) 또는 사진 수정(EDIT) */
  stateSource?: StateSource;
}

const useMemoModal = (options?: UseMemoModalOptions) => {
  const stateSource = options?.stateSource ?? STATE_SOURCE.NOTE;
  const { photoNoteState, updatePhotoNoteState, photoEditState, updatePhotoEditState } =
    usePhotoContext();

  const state = stateSource === STATE_SOURCE.EDIT ? photoEditState : photoNoteState;
  const updateState =
    stateSource === STATE_SOURCE.EDIT ? updatePhotoEditState : updatePhotoNoteState;

  const [tempMemo, setTempMemo] = useState(state.memo);
  const [isOpen, setIsOpen] = useState(false);
  const submittedRef = useRef(false);

  const openModal = () => {
    submittedRef.current = false;
    setTempMemo(state.memo);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (!submittedRef.current && stateSource === STATE_SOURCE.NOTE) {
      track('click_memo_cancel', {
        had_input: tempMemo.length > 0,
        memo_length: tempMemo.length,
      });
    }
    setIsOpen(false);
  };

  const submitMemo = () => {
    submittedRef.current = true;
    if (stateSource === STATE_SOURCE.NOTE) {
      track('click_memo_confirm', {
        memo_length: tempMemo.length,
      });
    }
    updateState({ memo: tempMemo });
    setIsOpen(false);
  };

  return {
    memo: state.memo,
    tempMemo,
    setTempMemo,
    isOpen,
    openModal,
    closeModal,
    submitMemo,
  };
};

export default useMemoModal;
