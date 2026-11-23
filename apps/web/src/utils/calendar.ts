import {
  AnniversaryResponseType,
  type AnniversaryResponse,
  type CalendarDayResponse,
} from '@repo/api-client';
import { getDateOnly } from './photoGrid';

export interface CalendarDay {
  /** YYYY-MM-DD */
  dateKey: string;
  day: number;
  /** 0(일) ~ 6(토) */
  dayOfWeek: number;
  /** 조회 중인 달에 속한 날짜인지 (이전/다음 달 날짜는 false) */
  isCurrentMonth: boolean;
}

/**
 * 캘린더에 표시할 연도와 월. (예: { year: 2026, month: 10 } → 2026년 10월)
 * 월 이동 시 12월 → 다음 해 1월처럼 두 값이 함께 바뀌므로 하나로 묶어 관리한다.
 */
export interface YearMonth {
  /** 4자리 연도 (예: 2026) */
  year: number;
  /** 1 ~ 12 */
  month: number;
}

const pad = (value: number) => String(value).padStart(2, '0');

export const toDateKey = (year: number, month: number, day: number) =>
  `${year}-${pad(month)}-${pad(day)}`;

/**
 * 해당 월을 일요일 시작 주 단위로 나눈다.
 * 첫 주/마지막 주의 빈칸은 이전/다음 달 날짜로 채운다.
 */
export const buildCalendarWeeks = ({ year, month }: YearMonth): CalendarDay[][] => {
  const startOffset = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(year, month - 1, 1 - startOffset + i);
    const cell: CalendarDay = {
      dateKey: toDateKey(date.getFullYear(), date.getMonth() + 1, date.getDate()),
      day: date.getDate(),
      dayOfWeek: date.getDay(),
      isCurrentMonth: date.getMonth() === month - 1,
    };
    if (i % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push(cell);
  }
  return weeks;
};

/** 오늘 날짜 (KST 기준, 격자 뷰 날짜 배지와 동일한 기준) */
export const getTodayKey = (): string => getDateOnly(new Date().toISOString()) ?? '';

export const getTodayYearMonth = (): YearMonth => {
  const [year, month] = getTodayKey().split('-').map(Number);
  return { year, month };
};

/** API 조회 파라미터용 연월 문자열 (yyyy-MM) */
export const toYearMonthKey = ({ year, month }: YearMonth) => `${year}-${pad(month)}`;

/**
 * 기념일 배지 라벨. (DAY_COUNT 100 → '100', YEARLY 1 → '1주년')
 * 같은 날 여러 기념일이 겹치면 주년을 우선한다.
 */
export const getAnniversaryLabel = (
  anniversaries?: AnniversaryResponse[],
): string | null => {
  if (!anniversaries?.length) return null;
  const yearly = anniversaries.find(
    (item) => item.type === AnniversaryResponseType.YEARLY,
  );
  if (yearly?.value) return `${yearly.value}주년`;
  const dayCount = anniversaries.find(
    (item) => item.type === AnniversaryResponseType.DAY_COUNT,
  );
  if (dayCount?.value) return String(dayCount.value);
  return null;
};

/** 월간 캘린더 응답을 날짜(YYYY-MM-DD)별 대표 썸네일 / 기념일 라벨로 변환한다. */
export const mapCalendarDays = (days: CalendarDayResponse[] = []) => {
  const thumbnails: Record<string, string> = {};
  const anniversaries: Record<string, string> = {};
  for (const day of days) {
    if (!day.date) continue;
    const thumbnail = day.representativePhoto?.url;
    if (thumbnail) thumbnails[day.date] = thumbnail;
    const label = getAnniversaryLabel(day.anniversaries);
    if (label) anniversaries[day.date] = label;
  }
  return { thumbnails, anniversaries };
};
