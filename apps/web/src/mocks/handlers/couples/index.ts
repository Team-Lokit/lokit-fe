import { createHandler } from '@/mocks/createHandler';
import { mockCreateInvite } from './createInvite/mockCreateInvite';
import { mockDisconnect } from './disconnect/mockDisconnect';
import {
  mockConfirmDisconnectNotice,
  mockGetDisconnectNotice,
} from './disconnectNotice/mockDisconnectNotice';
import { mockRefreshInvite } from './refreshInvite/mockRefreshInvite';
import { mockUpdateFirstMetDate } from './updateFirstMetDate/mockUpdateFirstMetDate';

export const couplesHandlers = [
  createHandler(mockCreateInvite, '초대코드_생성_성공'),
  createHandler(mockRefreshInvite, '초대코드_갱신_성공'),
  createHandler(mockDisconnect, '연결_끊기_성공'),
  createHandler(mockUpdateFirstMetDate, '날짜_수정_성공'),
  createHandler(mockGetDisconnectNotice, '알림창_노출'),
  createHandler(mockConfirmDisconnectNotice, '알림창_확인_성공'),
];
