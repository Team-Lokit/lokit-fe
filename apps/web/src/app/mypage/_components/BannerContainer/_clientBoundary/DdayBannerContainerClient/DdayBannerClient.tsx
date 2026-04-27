'use client';

import { useGetMyPageSuspense } from '@repo/api-client';
import usePopup from '@/hooks/usePopup';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';
import DdayEditModal from './DdayEditModal';
import * as S from './DdayBannerClient.styles';
import CalendarIcon from '@/assets/images/calendar.svg';

export default function DdayBannerClient() {
  const { data } = useGetMyPageSuspense();
  const { isOpen, handleOpen, handleClose } = usePopup();

  const [year, month, date] = data.firstMetDate?.split('-') ?? [];

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
            <S.Title>{data.coupledDay}일째 사랑 중</S.Title>
            <S.Description>{`${year}년 ${month}월 ${date}일 첫 만남`}</S.Description>
          </S.TextContainer>
        </S.ContentContainer>
        <S.ChevronIcon>
          <ChevronRightSmallIcon />
        </S.ChevronIcon>
      </S.Wrapper>
      <DdayEditModal
        isOpen={isOpen}
        onClose={handleClose}
        initialDate={data.firstMetDate}
      />
    </>
  );
}
