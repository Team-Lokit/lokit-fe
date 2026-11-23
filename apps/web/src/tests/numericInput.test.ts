import { describe, expect, it } from 'vitest';
import { sanitizeNumericInput } from '@/utils/numericInput';

describe('sanitizeNumericInput', () => {
  it('숫자만 남긴다', () => {
    expect(sanitizeNumericInput('20a2-6', 4)).toBe('2026');
  });

  it('최대 자릿수로 자른다', () => {
    expect(sanitizeNumericInput('20261', 4)).toBe('2026');
  });

  it('최댓값을 넘으면 null', () => {
    expect(sanitizeNumericInput('13', 2, 12)).toBeNull();
    expect(sanitizeNumericInput('12', 2, 12)).toBe('12');
  });

  it('빈 값은 그대로 허용한다', () => {
    expect(sanitizeNumericInput('', 2, 12)).toBe('');
  });
});
