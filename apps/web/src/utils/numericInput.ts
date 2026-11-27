import type { ChangeEvent } from 'react';

/**
 * 숫자만 남기고 최대 자릿수로 자른다.
 * 최댓값을 넘으면 null을 반환해 입력을 무시하게 한다.
 */
export const sanitizeNumericInput = (
  value: string,
  maxLength: number,
  max?: number,
): string | null => {
  const numeric = value.replace(/\D/g, '').slice(0, maxLength);
  if (numeric && max !== undefined && Number(numeric) > max) return null;
  return numeric;
};

/** 숫자 키패드 입력용 onChange 핸들러를 만든다. */
export const createNumericChangeHandler =
  (setter: (value: string) => void, maxLength: number, max?: number) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeNumericInput(e.target.value, maxLength, max);
    if (value !== null) setter(value);
  };
