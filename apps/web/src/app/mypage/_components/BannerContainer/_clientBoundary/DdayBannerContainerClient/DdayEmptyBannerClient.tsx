'use client';

import { useGetMyPageSuspense } from '@repo/api-client';
import usePopup from '@/hooks/usePopup';
import ChevronRightIcon from '@/assets/images/chevronRight.svg';
import DdayEditModal from './DdayEditModal';
import * as S from './DdayBannerClient.styles';
import CalendarIcon from '@/assets/images/calendar.svg';
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
        <S.ContentContainer>
          <S.CalendarContainer>
            <CalendarIcon />
          </S.CalendarContainer>
          <S.TextContainer>
            <S.Title>첫 만남은 언제인가요?</S.Title>
            <S.Description>날짜 설정하고 D-day 확인하기</S.Description>
          </S.TextContainer>
        </S.ContentContainer>
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
