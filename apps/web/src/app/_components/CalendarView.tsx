'use client';

import { useMemo, useState } from 'react';
import Calendar from '@/components/calendar/Calendar';
import type { DisplayPhoto } from '@/stores/pendingPhotos/types';
import { getTodayKey, getTodayYearMonth, groupPhotosByDate } from '@/utils/calendar';

interface CalendarViewProps {
  photos: DisplayPhoto[];
  /** 커플이 된 날짜 (기념일 배지용) */
  firstMetDate?: string;
}

const CalendarView = ({ photos, firstMetDate }: CalendarViewProps) => {
  const [todayKey] = useState(getTodayKey);
  const [yearMonth] = useState(getTodayYearMonth);

  // 날짜별 첫 번째 사진을 대표 썸네일로 사용
  const thumbnails = useMemo(() => {
    const result: Record<string, string> = {};
    groupPhotosByDate(photos).forEach((dayPhotos, dateKey) => {
      const url = dayPhotos.find((photo) => photo.url)?.url;
      if (url) result[dateKey] = url;
    });
    return result;
  }, [photos]);

  return (
    <Calendar
      yearMonth={yearMonth}
      todayKey={todayKey}
      thumbnails={thumbnails}
      firstMetDate={firstMetDate}
    />
  );
};

export default CalendarView;
