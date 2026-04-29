'use client';

import { useRouter } from 'next/navigation';
import * as S from './DisconnectClient.styles';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';
import { ROUTES } from '@/constants';

export default function DisconnectClient() {
  const router = useRouter();

  const handleClickDisconnect = () => {
    router.push(ROUTES.DISCONNECT);
  };

  return (
    <S.ButtonWrapper>
      <S.Button
        type="button"
        tabIndex={0}
        onClick={handleClickDisconnect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClickDisconnect();
          }
        }}
      >
        <S.ButtonText>상대방과 연결 끊기</S.ButtonText>
        <S.ChevronIcon>
          <ChevronRightSmallIcon />
        </S.ChevronIcon>
      </S.Button>
    </S.ButtonWrapper>
  );
}
