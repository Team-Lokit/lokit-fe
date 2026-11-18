'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  getGetDisconnectNoticeQueryKey,
  useConfirmDisconnectNotice,
  useGetDisconnectNotice,
  useGetMyPage,
  type DisconnectNoticeResponse,
} from '@repo/api-client';
import Modal from '@/components/popup/modal/Modal';
import TextButton from '@/components/buttons/textButton/TextButton';
import * as S from './DisconnectNoticeModal.styles';

// "2026-02-11" 또는 "2026-02-11T..." → "2026년 2월 11일" (시간대 변환 없이 날짜만 사용)
const formatDeadline = (deadline?: string) => {
  const match = deadline?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

/**
 * 상대가 연결을 끊은 뒤 처음 홈에 들어왔을 때 1회 노출하는 알림창.
 * 노출 여부는 서버가 관리하므로 기기가 바뀌어도 한 번만 뜬다.
 */
export default function DisconnectNoticeModal() {
  const queryClient = useQueryClient();
  const { data: notice } = useGetDisconnectNotice();
  const { data: myPage } = useGetMyPage();
  const { mutate: confirmNotice } = useConfirmDisconnectNotice();

  const deadline = formatDeadline(myPage?.reconnectDeadline);

  const handleClose = () => {
    // 확인 API 응답을 기다리지 않고 바로 닫는다.
    queryClient.setQueryData<DisconnectNoticeResponse>(getGetDisconnectNoticeQueryKey(), {
      shouldShow: false,
    });
    confirmNotice();
  };

  return (
    <Modal isOpen={notice?.shouldShow === true} onClose={handleClose}>
      <Modal.Content>
        <S.Title>상대방과 연결이 끊어졌어요</S.Title>
        <S.Description>
          {deadline ? `${deadline}까지 재연결하면` : '재연결하면'} 업로드한
          <br />
          사진들을 다시 복구할 수 있어요
        </S.Description>
        <Modal.Footer>
          <S.ButtonWrapper>
            <TextButton text="닫기" variant="primary" onClick={handleClose} />
          </S.ButtonWrapper>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
