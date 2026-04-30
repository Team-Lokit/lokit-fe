'use client';

import { useRouter } from 'next/navigation';
import { useGetMyPage } from '@repo/api-client';
import { track } from '@/lib/analytics';
import * as S from './DisconnectClient.styles';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';
import { ROUTES } from '@/constants';

export default function DisconnectClient() {
  const router = useRouter();
  const { data: myPageData } = useGetMyPage();

  const handleClickDisconnect = () => {
    track('click_disconnect_couple', {
      couple_days: myPageData?.coupledDay ?? 0,
      total_photos: myPageData?.couplePhotoCount ?? 0,
    });
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
