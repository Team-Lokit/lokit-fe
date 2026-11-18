import { COUPLE_STATUS_COOKIE } from '@/constants/cookie';
import { COUPLE_STATUS } from '@/constants/coupleStatus';
import { createHandler } from '@/mocks/createHandler';
import { 커플_상태_조회_연결됨, 커플_상태_조회_미연결 } from './getCoupleStatus/mockData';
import { mockGetCoupleStatus } from './getCoupleStatus/mockGetCoupleStatus';
import { mockGetMyPage } from './getMyPage/mockGetMyPage';
import { mockUpdateNickname } from './updateNickname/mockUpdateNickname';
import { mockUpdateProfileImage } from './updateProfileImage/mockUpdateProfileImage';

export const mypageHandlers = [
  createHandler(mockGetCoupleStatus, '커플_상태_조회_연결됨', {
    // 실제 백엔드처럼 coupleStatus 쿠키 기준으로 연결 여부를 응답한다.
    // 쿠키가 없으면(일반 mock 개발 환경) 기존처럼 연결됨으로 응답한다.
    dataResolver: (_params, cookies) => {
      const coupleStatus = cookies[COUPLE_STATUS_COOKIE];
      if (!coupleStatus || coupleStatus === COUPLE_STATUS.COUPLED) {
        return 커플_상태_조회_연결됨;
      }
      return 커플_상태_조회_미연결;
    },
  }),
  createHandler(mockGetMyPage, '마이페이지_조회_성공'),
  createHandler(mockUpdateNickname, '닉네임_수정_성공'),
  createHandler(mockUpdateProfileImage, '프로필_사진_수정_성공'),
];
