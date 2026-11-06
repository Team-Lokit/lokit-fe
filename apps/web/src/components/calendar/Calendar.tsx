'use client';

import { useMemo } from 'react';
import ChevronDownIcon from '@/assets/images/chevronDownSmall.svg';
import {
  buildCalendarWeeks,
  getAnniversaryLabel,
  type CalendarDay,
  type YearMonth,
} from '@/utils/calendar';
import * as S from './Calendar.styles';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const getDayVariant = (day: CalendarDay, todayKey: string): S.DayVariant => {
  if (day.dateKey === todayKey) return 'today';
  if (day.dayOfWeek === 0 || day.dayOfWeek === 6) return 'weekend';
  return 'default';
};

export interface CalendarProps {
  /** 조회 중인 연/월 */
  yearMonth: YearMonth;
  /** 오늘 날짜 (YYYY-MM-DD) */
  todayKey: string;
  /** 날짜(YYYY-MM-DD)별 대표 썸네일 URL */
  thumbnails: Record<string, string>;
  /** 커플이 된 날짜 (YYYY-MM-DD). 없으면 기념일 배지를 표시하지 않음 */
  firstMetDate?: string;
  /** 연/월 영역 클릭 */
  onClickMonth?: () => void;
  /** 날짜 클릭 */
  onClickDate?: (dateKey: string) => void;
}

const Calendar = ({
  yearMonth,
  todayKey,
  thumbnails,
  firstMetDate,
  onClickMonth,
  onClickDate,
}: CalendarProps) => {
  const weeks = useMemo(() => buildCalendarWeeks(yearMonth), [yearMonth]);

  return (
    <S.Container>
      <S.MonthButton type="button" onClick={onClickMonth}>
        <S.MonthLabel>
          {yearMonth.year} {yearMonth.month}월
        </S.MonthLabel>
        <S.MonthIcon aria-hidden>
          <ChevronDownIcon />
        </S.MonthIcon>
      </S.MonthButton>

      <S.WeekdayRow aria-hidden>
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </S.WeekdayRow>

      {weeks.map((week) => (
        <S.WeekRow key={week[0].dateKey}>
          {week.map((day) => {
            const thumbnail = thumbnails[day.dateKey];
            const anniversary = getAnniversaryLabel(day.dateKey, firstMetDate);
            const [year, month] = day.dateKey.split('-');
            const label = [
              `${year}년 ${Number(month)}월 ${day.day}일`,
              anniversary &&
                `${anniversary.endsWith('주년') ? anniversary : `${anniversary}일`} 기념일`,
              thumbnail && '사진 있음',
            ]
              .filter(Boolean)
              .join(', ');

            return (
              <S.DayCell key={day.dateKey} $isCurrentMonth={day.isCurrentMonth}>
                <S.DayButton
                  type="button"
                  aria-label={label}
                  aria-current={day.dateKey === todayKey ? 'date' : undefined}
                  onClick={() => onClickDate?.(day.dateKey)}
                >
                  <S.DayNumber $variant={getDayVariant(day, todayKey)}>
                    <span>{day.day}</span>
                  </S.DayNumber>
                  <S.DayContent>
                    {thumbnail && <S.Thumbnail src={thumbnail} alt="" />}
                    {anniversary && (
                      <S.AnniversaryBadge aria-hidden>💗{anniversary}</S.AnniversaryBadge>
                    )}
                  </S.DayContent>
                </S.DayButton>
              </S.DayCell>
            );
          })}
        </S.WeekRow>
      ))}
    </S.Container>
  );
};

export default Calendar;
