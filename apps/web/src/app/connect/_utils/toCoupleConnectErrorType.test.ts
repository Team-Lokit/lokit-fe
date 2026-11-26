import { describe, expect, it } from 'vitest';
import { toCoupleConnectErrorType } from './toCoupleConnectErrorType';

describe('toCoupleConnectErrorType', () => {
  it.each(['COUPLE_008', 'COUPLE_009', 'COUPLE_011', 'COUPLE_012', 'COUPLE_014'])(
    '코드 자체가 잘못된 경우 invalid_code: %s',
    (code) => {
      expect(toCoupleConnectErrorType(code)).toBe('invalid_code');
    },
  );

  it('만료된 코드는 expired', () => {
    expect(toCoupleConnectErrorType('COUPLE_010')).toBe('expired');
  });

  it('이미 커플로 연결된 경우 already_connected', () => {
    expect(toCoupleConnectErrorType('COUPLE_013')).toBe('already_connected');
  });

  it.each(['COUPLE_017', 'COUPLE_018', 'UNKNOWN_ERROR', 'toString', undefined])(
    '코드 문제가 아닌 에러는 undefined: %s',
    (code) => {
      expect(toCoupleConnectErrorType(code)).toBeUndefined();
    },
  );
});
