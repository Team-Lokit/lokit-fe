'use client';

import { useState } from 'react';
import { useLogout } from '@repo/api-client';
import usePopup from '@/hooks/usePopup';
import { useToast } from '@/components/toast';
import Modal from '@/components/popup/modal/Modal';
import TextButton from '@/components/buttons/textButton/TextButton';
import { ROUTES } from '@/constants/routes';
import { resetIdentity } from '@/lib/analytics';
import { getDeviceToken } from '@/utils/getDeviceToken';
import * as S from './LogoutClient.styles';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';

export default function LogoutClient() {
  const { isOpen, handleOpen, handleClose } = usePopup();
  const { showToast } = useToast();
  const [isFetchingToken, setIsFetchingToken] = useState(false);

  const { mutate: logout, isPending } = useLogout({
    mutation: {
      onSuccess: () => {
        resetIdentity();
        window.location.href = ROUTES.LOGIN;
      },
      onError: () => {
        handleClose();
        showToast('로그아웃에 실패했어요');
      },
    },
  });

  const isLoggingOut = isFetchingToken || isPending;

  const handleLogout = async () => {
    setIsFetchingToken(true);
    const device = await getDeviceToken({ requestPermission: false });
    setIsFetchingToken(false);
    logout({ data: { deviceToken: device?.token } });
  };

  return (
    <>
      <S.Button type="button" onClick={handleOpen}>
        <S.ButtonText>로그아웃</S.ButtonText>
        <S.ChevronIcon>
          <ChevronRightSmallIcon />
        </S.ChevronIcon>
      </S.Button>
      <Modal isOpen={isOpen} onClose={isLoggingOut ? () => {} : handleClose}>
        <Modal.Content>
          <S.Title>로그아웃 할까요?</S.Title>
          <Modal.Footer>
            <TextButton
              text="돌아가기"
              onClick={handleClose}
              disabled={isLoggingOut}
              style={{ flex: 1 }}
            />
            <TextButton
              text="로그아웃"
              variant="negative"
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{ flex: 1 }}
            />
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
