'use client';

import { useCallback, useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import useAlbumAdd from '../../_hooks/useAlbumAdd';
import AlbumAddModal from './AlbumAddModal';

interface AlbumAddModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  /** 모달 진입 시점의 전체 앨범 수. 생성 성공 시 +1로 total_album_count 산정 */
  currentAlbumCount: number;
}

export function AlbumAddModalContainer({
  isOpen,
  onClose,
  currentAlbumCount,
}: AlbumAddModalContainerProps) {
  const successFlagRef = useRef(false);

  const handleCreated = useCallback(
    (response: { id?: number }, title: string) => {
      successFlagRef.current = true;
      track('album_create_success', {
        album_id: String(response.id ?? ''),
        album_name: title,
        total_album_count: currentAlbumCount + 1,
      });
    },
    [currentAlbumCount],
  );

  const { isCreating, albumName, setAlbumName, confirmAdd } = useAlbumAdd({
    onSuccess: onClose,
    onCreated: handleCreated,
  });

  // 모달 노출 시 1회 발송
  useEffect(() => {
    if (!isOpen) return;
    track('modal_view_album_create', {});
    successFlagRef.current = false;
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (!successFlagRef.current) {
      track('click_album_create_cancel', {
        had_input: !!albumName.trim(),
      });
    }
    onClose();
  }, [onClose, albumName]);

  return (
    <AlbumAddModal
      isOpen={isOpen}
      isCreating={isCreating}
      albumName={albumName}
      onChangeAlbumName={setAlbumName}
      onClose={handleClose}
      onConfirm={confirmAdd}
    />
  );
}
