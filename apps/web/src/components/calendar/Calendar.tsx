'use client';

import { useMemo } from 'react';
import ChevronDownIcon from '@/assets/images/chevronDownSmall.svg';
import {
  buildCalendarWeeks,
  type CalendarDay,
  type CalendarDayInfo,
  type YearMonth,
} from '@/utils/calendar';
import * as S from './Calendar.styles';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const getDayVariant = (day: CalendarDay, todayKey: string): S.DayVariant => {
  if (day.dateKey === todayKey) return 'today';
  if (day.dayOfWeek === 0 || day.dayOfWeek === 6) return 'weekend';
  return 'default';
};

interface CalendarMonthButtonProps {
  yearMonth: YearMonth;
  onClick?: () => void;
}

/** 연/월 라벨 버튼 (스와이프 시에도 고정) */
export const CalendarMonthButton = ({ yearMonth, onClick }: CalendarMonthButtonProps) => (
  <S.MonthButton type="button" onClick={onClick}>
    <S.MonthLabel>
      {yearMonth.year} {yearMonth.month}월
    </S.MonthLabel>
    <S.MonthIcon aria-hidden>
      <ChevronDownIcon />
    </S.MonthIcon>
  </S.MonthButton>
);

export interface CalendarGridProps {
  /** 그릴 연/월 */
  yearMonth: YearMonth;
  /** 오늘 날짜 (YYYY-MM-DD) */
  todayKey: string;
  /** 날짜(YYYY-MM-DD)별 칸 정보 (대표 썸네일, 기념일 라벨) */
  days: Record<string, CalendarDayInfo>;
  /** 날짜 클릭 */
  onClickDate?: (dateKey: string) => void;
}

/** 요일 줄 + 날짜 격자 (스와이프 시 옆 달과 함께 이동하는 영역) */
export const CalendarGrid = ({
  yearMonth,
  todayKey,
  days,
  onClickDate,
}: CalendarGridProps) => {
  const weeks = useMemo(() => buildCalendarWeeks(yearMonth), [yearMonth]);

  return (
    <S.Container>
      <S.WeekdayRow aria-hidden>
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </S.WeekdayRow>

      {weeks.map((week) => (
        <S.WeekRow key={week[0].dateKey}>
          {week.map((day) => {
            const { thumbnail, anniversary } = days[day.dateKey] ?? {};
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

export interface CalendarProps extends CalendarGridProps {
  /** 연/월 영역 클릭 */
  onClickMonth?: () => void;
}

/** 연/월 버튼 + 한 달 격자 */
const Calendar = ({ onClickMonth, ...gridProps }: CalendarProps) => (
  <S.Container>
    <CalendarMonthButton yearMonth={gridProps.yearMonth} onClick={onClickMonth} />
    <CalendarGrid {...gridProps} />
  </S.Container>
);

export default Calendar;
