import {
  COUPLE_CONNECT_ERROR_TYPE_BY_CODE,
  type CoupleConnectErrorCode,
  type CoupleConnectErrorType,
} from '@/lib/analytics/events';

const isCoupleConnectErrorCode = (code: string): code is CoupleConnectErrorCode =>
  Object.hasOwn(COUPLE_CONNECT_ERROR_TYPE_BY_CODE, code);

/**
 * API 에러 코드를 couple_connect_fail 이벤트의 error_type으로 변환한다.
 * 코드 자체의 문제가 아닌 에러(요청 제한, 동시 요청 충돌, 네트워크 등)는 undefined
 */
export const toCoupleConnectErrorType = (
  errorCode?: string,
): CoupleConnectErrorType | undefined =>
  errorCode && isCoupleConnectErrorCode(errorCode)
    ? COUPLE_CONNECT_ERROR_TYPE_BY_CODE[errorCode]
    : undefined;
