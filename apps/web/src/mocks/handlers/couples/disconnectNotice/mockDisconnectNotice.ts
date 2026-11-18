import type { DisconnectNoticeResponse } from '@repo/api-client';
import { API_URL } from '@/constants';
import type { MockApiResponse } from '@/mocks/types';

export const mockGetDisconnectNotice = {
  url: API_URL.COUPLES.DISCONNECT_NOTICE,
  description: '연결 끊김 알림창 노출 여부 조회',
  method: 'get',
  response: {
    알림창_노출: {
      status: 200,
      delayTime: 300,
      data: { shouldShow: true },
    },
    알림창_미노출: {
      status: 200,
      delayTime: 300,
      data: { shouldShow: false },
    },
  },
} satisfies MockApiResponse<'알림창_노출' | '알림창_미노출', DisconnectNoticeResponse>;

export const mockConfirmDisconnectNotice = {
  url: API_URL.COUPLES.DISCONNECT_NOTICE_CONFIRM,
  description: '연결 끊김 알림창 확인 처리',
  method: 'post',
  response: {
    알림창_확인_성공: {
      status: 204,
      delayTime: 300,
      data: {},
    },
  },
} satisfies MockApiResponse<'알림창_확인_성공', unknown>;
