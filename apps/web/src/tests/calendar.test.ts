import { describe, expect, it } from 'vitest';
import {
  buildCalendarWeeks,
  getAnniversaryLabel,
  groupPhotosByDate,
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

describe('groupPhotosByDate', () => {
  it('촬영일을 KST 기준 날짜로 묶는다', () => {
    const photos = [
      { id: 1, takenAt: '2026-10-18T05:00:00Z' },
      // UTC 15시 = KST 다음 날 0시
      { id: 2, takenAt: '2026-10-18T15:00:00Z' },
      { id: 3, takenAt: '2026-10-18T01:00:00Z' },
    ];

    const grouped = groupPhotosByDate(photos);

    expect(grouped.get('2026-10-18')?.map((p) => p.id)).toEqual([1, 3]);
    expect(grouped.get('2026-10-19')?.map((p) => p.id)).toEqual([2]);
  });

  it('촬영일이 없는 사진은 제외한다', () => {
    const grouped = groupPhotosByDate([{ id: 1 }, { id: 2, takenAt: undefined }]);
    expect(grouped.size).toBe(0);
  });
});

describe('getAnniversaryLabel', () => {
  const firstMetDate = '2026-01-01';

  it('커플이 된 날을 1일째로 계산해 99일 뒤를 100일로 표시한다', () => {
    expect(getAnniversaryLabel('2026-04-10', firstMetDate)).toBe('100');
    expect(getAnniversaryLabel('2026-04-09', firstMetDate)).toBeNull();
    expect(getAnniversaryLabel('2026-07-19', firstMetDate)).toBe('200');
  });

  it('같은 월·일에 매년 N주년을 표시한다', () => {
    expect(getAnniversaryLabel('2027-01-01', firstMetDate)).toBe('1주년');
    expect(getAnniversaryLabel('2028-01-01', firstMetDate)).toBe('2주년');
  });

  it('커플이 된 당일과 그 이전에는 표시하지 않는다', () => {
    expect(getAnniversaryLabel('2026-01-01', firstMetDate)).toBeNull();
    expect(getAnniversaryLabel('2025-01-01', firstMetDate)).toBeNull();
    expect(getAnniversaryLabel('2025-09-24', firstMetDate)).toBeNull();
  });

  it('커플이 된 날짜가 없으면 표시하지 않는다', () => {
    expect(getAnniversaryLabel('2026-04-10', undefined)).toBeNull();
  });
});
