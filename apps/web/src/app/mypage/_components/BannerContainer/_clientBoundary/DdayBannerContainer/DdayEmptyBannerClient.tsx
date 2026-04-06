'use client';

import { useGetMyPageSuspense } from '@repo/api-client';
import usePopup from '@/hooks/usePopup';
import folder3dPng from '@/assets/images/folder_3d.png';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import DdayEditModal from './DdayEditModal';
import * as S from './DdayBannerClient.styles';
import Image from 'next/image';

export default function DdayEmptyBannerClient() {
  const { data } = useGetMyPageSuspense();
  const { isOpen, handleOpen, handleClose } = usePopup();

  return (
    <>
      <S.Wrapper
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        <S.BackgroundIcon>
          <Image src={folder3dPng} alt="" width={97} height={85} aria-hidden />
        </S.BackgroundIcon>

        <S.EmptyText>처음 만난 날이 언제인가요?</S.EmptyText>
        <S.ChevronIcon>
          <ChevronRightIcon width={22} height={22} />
        </S.ChevronIcon>
      </S.Wrapper>
      <DdayEditModal
        isOpen={isOpen}
        onClose={handleClose}
        initialDate={data.joinedDate}
      />
    </>
  );
}
