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

export interface YearMonth {
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

/**
 * 사진을 촬영일(KST) 기준 YYYY-MM-DD로 묶는다.
 * 촬영일이 없는 사진은 제외한다.
 */
export const groupPhotosByDate = <T extends { takenAt?: string }>(
  photos: T[],
): Map<string, T[]> => {
  const grouped = new Map<string, T[]>();
  for (const photo of photos) {
    const dateKey = getDateOnly(photo.takenAt);
    if (!dateKey) continue;
    const list = grouped.get(dateKey);
    if (list) {
      list.push(photo);
    } else {
      grouped.set(dateKey, [photo]);
    }
  }
  return grouped;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return { year, month, day, utc: Date.UTC(year, month - 1, day) };
};

/**
 * 커플 기념일 배지 라벨.
 * - 커플이 된 날을 1일째로 계산해 100일 단위(100, 200, ...)를 표시한다.
 * - 커플이 된 날과 같은 월·일에 매년 N주년을 표시한다. (같은 날이면 주년 우선)
 * - 커플이 된 날짜가 없거나 기념일이 아니면 null.
 */
export const getAnniversaryLabel = (
  dateKey: string,
  firstMetDate?: string,
): string | null => {
  if (!firstMetDate) return null;
  const start = parseDateKey(firstMetDate);
  const target = parseDateKey(dateKey);
  if (Number.isNaN(start.utc) || Number.isNaN(target.utc)) return null;

  const years = target.year - start.year;
  if (years > 0 && target.month === start.month && target.day === start.day) {
    return `${years}주년`;
  }

  const dayCount = Math.round((target.utc - start.utc) / DAY_MS) + 1;
  if (dayCount > 0 && dayCount % 100 === 0) return String(dayCount);

  return null;
};
