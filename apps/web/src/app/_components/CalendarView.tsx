'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CalendarSwiper from '@/components/calendar/calendarSwiper/CalendarSwiper';
import MonthPickerModal from '@/components/calendar/monthPickerModal/MonthPickerModal';
import Chip from '@/components/buttons/chip/Chip';
import ChevronRightSvg from '@/assets/images/chevronRightSmall.svg';
import { useCalendarMonth } from '@/hooks/queries';
import { ROUTES } from '@/constants/routes';
import {
  getTodayKey,
  getTodayYearMonth,
  isYearMonthInRange,
  parseYearMonthKey,
  shiftYearMonth,
  toYearMonthKey,
  type YearMonth,
} from '@/utils/calendar';
import * as S from './CalendarView.styles';

/** 캘린더에서 보고 있는 달(yyyy-MM)을 담는 URL 쿼리 키 */
const CALENDAR_MONTH_PARAM = 'month';

interface CalendarViewProps {
  /** 앨범 상세에서 볼 때만 전달 */
  albumId?: number;
}

const CalendarView = ({ albumId }: CalendarViewProps) => {
  const searchParams = useSearchParams();

  const [todayKey] = useState(getTodayKey);
  const [todayYearMonth] = useState(getTodayYearMonth);
  // 사진 상세에서 뒤로가기·앨범 변경 시에도 보던 달을 유지하도록 URL 쿼리에서 복원
  const [yearMonth, setYearMonthState] = useState(
    () => parseYearMonthKey(searchParams.get(CALENDAR_MONTH_PARAM)) ?? todayYearMonth,
  );
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const router = useRouter();

  // 스와이프마다 서버 요청(RSC)이 생기지 않도록 router 대신 history API로 쿼리만 교체
  // (현재 달이면 쿼리를 지워 URL을 깔끔하게 유지)
  const setYearMonth = (next: YearMonth) => {
    setYearMonthState(next);
    const params = new URLSearchParams(window.location.search);
    const isTodayMonth =
      next.year === todayYearMonth.year && next.month === todayYearMonth.month;
    if (isTodayMonth) params.delete(CALENDAR_MONTH_PARAM);
    else params.set(CALENDAR_MONTH_PARAM, toYearMonthKey(next));
    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}`,
    );
  };

  // 스와이프 중 옆 달이 비어 보이지 않도록 이전/다음 달도 함께 조회
  const prevYearMonth = shiftYearMonth(yearMonth, -1);
  const nextYearMonth = shiftYearMonth(yearMonth, 1);
  const { days } = useCalendarMonth({ yearMonth, albumId });
  // 조회 가능 범위(1년 1월 ~ 10000년 12월) 밖으로는 조회·이동하지 않음
  const hasPrev = isYearMonthInRange(prevYearMonth);
  const hasNext = isYearMonthInRange(nextYearMonth);
  const { days: prevDays } = useCalendarMonth({
    yearMonth: prevYearMonth,
    albumId,
    enabled: hasPrev,
  });
  const { days: nextDays } = useCalendarMonth({
    yearMonth: nextYearMonth,
    albumId,
    enabled: hasNext,
  });

  const daysByMonth = {
    [toYearMonthKey(prevYearMonth)]: prevDays,
    [toYearMonthKey(yearMonth)]: days,
    [toYearMonthKey(nextYearMonth)]: nextDays,
  };

  // 사진이 있는 날짜만 사진 상세로 이동 (하단 썸네일에 해당 날짜 사진 노출)
  const handleClickDate = (dateKey: string) => {
    const photoId = days[dateKey]?.photoId;
    if (photoId === undefined) return;
    router.push(
      ROUTES.PHOTO.VIEW(photoId, {
        date: dateKey,
        source: albumId ? 'album_detail' : 'home_calendar',
        ...(albumId ? { albumId } : {}),
      }),
    );
  };

  const isViewingCurrentMonth =
    yearMonth.year === todayYearMonth.year && yearMonth.month === todayYearMonth.month;

  const handleConfirmMonth = (nextYearMonth: YearMonth) => {
    setYearMonth(nextYearMonth);
    setIsMonthPickerOpen(false);
  };

  return (
    <>
      <CalendarSwiper
        yearMonth={yearMonth}
        todayKey={todayKey}
        daysByMonth={daysByMonth}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onChangeMonth={setYearMonth}
        onClickDate={handleClickDate}
        onClickMonth={() => setIsMonthPickerOpen(true)}
      />
      {!isViewingCurrentMonth && (
        <S.TodayButtonWrapper>
          <Chip
            text="오늘"
            variant="gray"
            size="medium"
            trailingIcon={<ChevronRightSvg width={14} height={14} />}
            ariaLabel="현재 달로 이동"
            onClick={() => setYearMonth(todayYearMonth)}
          />
        </S.TodayButtonWrapper>
      )}
      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        initialYearMonth={yearMonth}
        onClose={() => setIsMonthPickerOpen(false)}
        onConfirm={handleConfirmMonth}
      />
    </>
  );
};

export default CalendarView;
