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
  /** 연도 (1 ~ 10000, 예: 2026) */
  year: number;
  /** 1 ~ 12 */
  month: number;
}

/** 캘린더에서 조회·이동할 수 있는 연도 범위 */
export const CALENDAR_MIN_YEAR = 1;
export const CALENDAR_MAX_YEAR = 10000;

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * 서버와 맞춘 연도 표기. 4자리 미만은 앞을 0으로 채우고, 5자리 이상은 앞에 '+'를 붙인다.
 * (1 → '0001', 999 → '0999', 9999 → '9999', 10000 → '+10000')
 */
export const formatYear = (year: number) =>
  year > 9999 ? `+${year}` : String(year).padStart(4, '0');

export const toDateKey = (year: number, month: number, day: number) =>
  `${formatYear(year)}-${pad(month)}-${pad(day)}`;

/**
 * 연/월/일로 Date를 만든다.
 * new Date(year, ...)는 0~99년을 1900년대로 바꿔 버리므로 setFullYear로 연도를 다시 지정한다.
 */
const createDate = (year: number, monthIndex: number, day: number) => {
  const date = new Date(2000, 0, 1);
  date.setFullYear(year, monthIndex, day);
  return date;
};

/**
 * 해당 월을 일요일 시작 주 단위로 나눈다.
 * 첫 주/마지막 주의 빈칸은 이전/다음 달 날짜로 채운다.
 */
export const buildCalendarWeeks = ({ year, month }: YearMonth): CalendarDay[][] => {
  const startOffset = createDate(year, month - 1, 1).getDay();
  const daysInMonth = createDate(year, month, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < totalCells; i++) {
    const date = createDate(year, month - 1, 1 - startOffset + i);
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

/** 연/월이 캘린더 조회 가능 범위(1년 1월 ~ 10000년 12월) 안인지 */
export const isYearMonthInRange = ({ year }: YearMonth) =>
  year >= CALENDAR_MIN_YEAR && year <= CALENDAR_MAX_YEAR;

/** 연/월을 offset개월만큼 이동한다. (양수: 이후 달, 음수: 이전 달 / 예: 2026-12 +1 → 2027-01) */
export const shiftYearMonth = ({ year, month }: YearMonth, offset: number): YearMonth => {
  const index = year * 12 + (month - 1) + offset;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
};

/** API 조회 파라미터용 연월 문자열 (yyyy-MM) */
export const toYearMonthKey = ({ year, month }: YearMonth) =>
  `${formatYear(year)}-${pad(month)}`;

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

/** 캘린더 날짜 칸 하나에 표시할 정보 */
export interface CalendarDayInfo {
  /** 대표 사진 URL */
  thumbnail?: string;
  /** 대표 사진 ID (날짜 클릭 시 사진 상세 진입용) */
  photoId?: number;
  /** 기념일 라벨 (예: '100', '1주년') */
  anniversary?: string;
}

/** 월간 캘린더 응답을 날짜(YYYY-MM-DD)별 칸 정보로 변환한다. */
export const mapCalendarDays = (
  days: CalendarDayResponse[] = [],
): Record<string, CalendarDayInfo> => {
  const result: Record<string, CalendarDayInfo> = {};
  for (const day of days) {
    if (!day.date) continue;
    result[day.date] = {
      thumbnail: day.representativePhoto?.url,
      photoId: day.representativePhoto?.id,
      anniversary: getAnniversaryLabel(day.anniversaries) ?? undefined,
    };
  }
  return result;
};
