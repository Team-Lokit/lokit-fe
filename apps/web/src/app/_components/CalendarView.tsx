'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarSwiper from '@/components/calendar/calendarSwiper/CalendarSwiper';
import MonthPickerModal from '@/components/calendar/monthPickerModal/MonthPickerModal';
import { useCalendarMonth } from '@/hooks/queries';
import { ROUTES } from '@/constants/routes';
import {
  getTodayKey,
  getTodayYearMonth,
  shiftYearMonth,
  toYearMonthKey,
  type YearMonth,
} from '@/utils/calendar';

interface CalendarViewProps {
  /** 앨범 상세에서 볼 때만 전달 */
  albumId?: number;
}

const CalendarView = ({ albumId }: CalendarViewProps) => {
  const [todayKey] = useState(getTodayKey);
  const [yearMonth, setYearMonth] = useState(getTodayYearMonth);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const router = useRouter();

  // 스와이프 중 옆 달이 비어 보이지 않도록 이전/다음 달도 함께 조회
  const prevYearMonth = shiftYearMonth(yearMonth, -1);
  const nextYearMonth = shiftYearMonth(yearMonth, 1);
  const { days } = useCalendarMonth({ yearMonth, albumId });
  const { days: prevDays } = useCalendarMonth({ yearMonth: prevYearMonth, albumId });
  const { days: nextDays } = useCalendarMonth({ yearMonth: nextYearMonth, albumId });

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
        onChangeMonth={setYearMonth}
        onClickDate={handleClickDate}
        onClickMonth={() => setIsMonthPickerOpen(true)}
      />
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
