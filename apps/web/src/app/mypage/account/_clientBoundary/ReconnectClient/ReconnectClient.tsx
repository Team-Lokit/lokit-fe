'use client';

import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { COUPLE_STATUS_COOKIE } from '@/constants/cookie';
import { COUPLE_STATUS } from '@/constants/coupleStatus';
import { ROUTES } from '@/constants/routes';
import * as S from './ReconnectClient.style';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';

function getCookieValue(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

const subscribe = () => () => {};

export default function ReconnectClient() {
  const router = useRouter();

  const isDisconnectedByPartner = useSyncExternalStore(
    subscribe,
    () => {
      const coupleStatus = getCookieValue(COUPLE_STATUS_COOKIE);
      return (
        coupleStatus === COUPLE_STATUS.DISCONNECTED_BY_PARTNER ||
        coupleStatus === COUPLE_STATUS.DISCONNECTED_EXPIRED
      );
    },
    () => false,
  );

  if (!isDisconnectedByPartner) return null;

  const handleClickReconnect = () => {
    router.push(ROUTES.RECONNECT);
  };

  return (
    <S.ButtonWrapper>
      <S.Button
        type="button"
        tabIndex={0}
        onClick={handleClickReconnect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClickReconnect();
          }
        }}
      >
        <S.ButtonText>재연결하기</S.ButtonText>
        <S.ChevronIcon>
          <ChevronRightSmallIcon />
        </S.ChevronIcon>
      </S.Button>
    </S.ButtonWrapper>
  );
}
