import {
  COUPLE_CONNECT_ERROR_TYPE_BY_CODE,
  type CoupleConnectErrorCode,
  type CoupleConnectErrorType,
} from '@/lib/analytics/events';

/** API 에러 코드를 couple_connect_fail 이벤트의 error_type으로 변환한다. 모르는 코드는 invalid_code */
export const toCoupleConnectErrorType = (errorCode?: string): CoupleConnectErrorType =>
  (errorCode
    ? COUPLE_CONNECT_ERROR_TYPE_BY_CODE[errorCode as CoupleConnectErrorCode]
    : undefined) ?? 'invalid_code';
