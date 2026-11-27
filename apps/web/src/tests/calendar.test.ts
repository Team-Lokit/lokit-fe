import { describe, expect, it } from 'vitest';
import { AnniversaryResponseType } from '@repo/api-client';
import {
  buildCalendarWeeks,
  formatYear,
  getAnniversaryLabel,
  mapCalendarDays,
  parseYearMonthKey,
  shiftYearMonth,
  toDateKey,
  toYearMonthKey,
} from '@/utils/calendar';

describe('buildCalendarWeeks', () => {
  it('일요일 시작 주 단위로 나누고 앞뒤 빈칸을 이전/다음 달 날짜로 채운다', () => {
    // 2026-10-01은 목요일
    const weeks = buildCalendarWeeks({ year: 2026, month: 10 });

    expect(weeks).toHaveLength(5);
    weeks.forEach((week) => expect(week).toHaveLength(7));

    expect(weeks[0][0]).toEqual({
      dateKey: '2026-09-27',
      day: 27,
      dayOfWeek: 0,
      isCurrentMonth: false,
    });
    expect(weeks[0][4]).toMatchObject({ dateKey: '2026-10-01', isCurrentMonth: true });
    expect(weeks[4][6]).toMatchObject({ dateKey: '2026-10-31', isCurrentMonth: true });
  });

  it('달이 6주에 걸치면 6주를 반환한다', () => {
    // 2026-08-01은 토요일, 31일까지
    expect(buildCalendarWeeks({ year: 2026, month: 8 })).toHaveLength(6);
  });

  it('1월은 이전 해 12월 날짜로 채운다', () => {
    // 2027-01-01은 금요일
    const [firstWeek] = buildCalendarWeeks({ year: 2027, month: 1 });
    expect(firstWeek[0].dateKey).toBe('2026-12-27');
  });
});

describe('toYearMonthKey', () => {
  it('yyyy-MM 형식으로 변환한다', () => {
    expect(toYearMonthKey({ year: 2026, month: 3 })).toBe('2026-03');
    expect(toYearMonthKey({ year: 2026, month: 11 })).toBe('2026-11');
  });
});

describe('getAnniversaryLabel', () => {
  it('DAY_COUNT는 일수, YEARLY는 N주년으로 표시한다', () => {
    expect(
      getAnniversaryLabel([{ type: AnniversaryResponseType.DAY_COUNT, value: 100 }]),
    ).toBe('100');
    expect(
      getAnniversaryLabel([{ type: AnniversaryResponseType.YEARLY, value: 1 }]),
    ).toBe('1주년');
  });

  it('같은 날 겹치면 주년을 우선한다', () => {
    expect(
      getAnniversaryLabel([
        { type: AnniversaryResponseType.DAY_COUNT, value: 1100 },
        { type: AnniversaryResponseType.YEARLY, value: 3 },
      ]),
    ).toBe('3주년');
  });

  it('기념일이 없으면 null', () => {
    expect(getAnniversaryLabel([])).toBeNull();
    expect(getAnniversaryLabel(undefined)).toBeNull();
  });
});

describe('mapCalendarDays', () => {
  it('날짜별 대표 사진과 기념일 라벨을 칸 정보로 변환한다', () => {
    const result = mapCalendarDays([
      {
        date: '2026-11-02',
        representativePhoto: { id: 1, url: 'a.jpg' },
        anniversaries: [],
      },
      {
        date: '2026-11-10',
        anniversaries: [{ type: AnniversaryResponseType.DAY_COUNT, value: 200 }],
      },
    ]);
    expect(result).toEqual({
      '2026-11-02': { thumbnail: 'a.jpg', photoId: 1, anniversary: undefined },
      '2026-11-10': { thumbnail: undefined, photoId: undefined, anniversary: '200' },
    });
  });

  it('응답이 없으면 빈 객체', () => {
    expect(mapCalendarDays(undefined)).toEqual({});
  });
});

describe('shiftYearMonth', () => {
  it('같은 해 안에서 이동한다', () => {
    expect(shiftYearMonth({ year: 2026, month: 5 }, 1)).toEqual({ year: 2026, month: 6 });
    expect(shiftYearMonth({ year: 2026, month: 5 }, -1)).toEqual({
      year: 2026,
      month: 4,
    });
  });

  it('연도 경계를 넘는다', () => {
    expect(shiftYearMonth({ year: 2026, month: 12 }, 1)).toEqual({
      year: 2027,
      month: 1,
    });
    expect(shiftYearMonth({ year: 2026, month: 1 }, -1)).toEqual({
      year: 2025,
      month: 12,
    });
  });
});

describe('formatYear / toYearMonthKey / toDateKey', () => {
  it('4자리 미만은 앞을 0으로 채우고, 5자리는 앞에 +를 붙인다', () => {
    expect(formatYear(1)).toBe('0001');
    expect(formatYear(999)).toBe('0999');
    expect(formatYear(9999)).toBe('9999');
    expect(formatYear(10000)).toBe('+10000');
  });

  it('서버 형식에 맞는 연월/날짜 키를 만든다', () => {
    expect(toYearMonthKey({ year: 1, month: 1 })).toBe('0001-01');
    expect(toYearMonthKey({ year: 10000, month: 1 })).toBe('+10000-01');
    expect(toDateKey(999, 12, 31)).toBe('0999-12-31');
    expect(toDateKey(10000, 1, 1)).toBe('+10000-01-01');
  });
});

describe('buildCalendarWeeks (0~99년)', () => {
  it('1년 1월을 1901년이 아닌 1년 기준으로 만든다', () => {
    const days = buildCalendarWeeks({ year: 1, month: 1 }).flat();
    const currentMonth = days.filter((day) => day.isCurrentMonth);
    expect(currentMonth).toHaveLength(31);
    expect(currentMonth[0].dateKey).toBe('0001-01-01');
    // 서기 1년 1월 1일은 월요일 (프롤렙틱 그레고리력)
    expect(currentMonth[0].dayOfWeek).toBe(1);
  });
});

describe('parseYearMonthKey', () => {
  it('toYearMonthKey 결과를 다시 연/월로 되돌린다', () => {
    const cases = [
      { year: 2026, month: 5 },
      { year: 1, month: 1 },
      { year: 10000, month: 12 },
    ];
    for (const yearMonth of cases) {
      expect(parseYearMonthKey(toYearMonthKey(yearMonth))).toEqual(yearMonth);
    }
  });

  it('형식이 맞지 않거나 범위를 벗어나면 null', () => {
    expect(parseYearMonthKey(null)).toBeNull();
    expect(parseYearMonthKey('')).toBeNull();
    expect(parseYearMonthKey('2026-5')).toBeNull();
    expect(parseYearMonthKey('2026-13')).toBeNull();
    expect(parseYearMonthKey('2026-00')).toBeNull();
    expect(parseYearMonthKey('0000-01')).toBeNull();
    expect(parseYearMonthKey('+10001-01')).toBeNull();
    expect(parseYearMonthKey('abc')).toBeNull();
  });
});
