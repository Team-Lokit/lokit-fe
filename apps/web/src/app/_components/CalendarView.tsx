'use client';

import { useState } from 'react';
import Calendar from '@/components/calendar/Calendar';
import { useCalendarMonth } from '@/hooks/queries';
import { getTodayKey, getTodayYearMonth } from '@/utils/calendar';

interface CalendarViewProps {
  /** 앨범 상세에서 볼 때만 전달 */
  albumId?: number;
}

const CalendarView = ({ albumId }: CalendarViewProps) => {
  const [todayKey] = useState(getTodayKey);
  const [yearMonth] = useState(getTodayYearMonth);

  const { thumbnails, anniversaries } = useCalendarMonth({ yearMonth, albumId });

  return (
    <Calendar
      yearMonth={yearMonth}
      todayKey={todayKey}
      thumbnails={thumbnails}
      anniversaries={anniversaries}
    />
  );
};

export default CalendarView;
