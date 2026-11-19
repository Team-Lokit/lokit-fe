import { describe, expect, it } from 'vitest';
import { formatTimeLeft } from './formatTimeLeft';

const NOW = new Date('2026-01-01T00:00:00Z').getTime();

describe('formatTimeLeft', () => {
  it('남은 시간을 HH:MM:SS로 표시한다', () => {
    expect(formatTimeLeft('2026-01-01T23:59:59Z', NOW)).toBe('23:59:59');
    expect(formatTimeLeft('2026-01-01T00:01:05Z', NOW)).toBe('00:01:05');
  });

  it('24시간 이상 남아도 시간이 잘리지 않는다', () => {
    expect(formatTimeLeft('2026-01-02T01:00:00Z', NOW)).toBe('25:00:00');
  });

  it('만료 시각이 지났으면 만료됨을 반환한다', () => {
    expect(formatTimeLeft('2026-01-01T00:00:00Z', NOW)).toBe('만료됨');
    expect(formatTimeLeft('2025-12-31T23:00:00Z', NOW)).toBe('만료됨');
  });
});
