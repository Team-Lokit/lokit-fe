import { ROUTES } from '@/constants/routes';

/** 초대코드 자릿수 */
export const INVITE_CODE_LENGTH = 6;

/** 연결 화면 진입 경로를 나타내는 쿼리 파라미터 */
export const CONNECT_FROM_PARAM = 'from';
export const CONNECT_FROM_MYPAGE = 'mypage';

/** 마이페이지에서 연결 화면으로 들어갈 때 쓰는 경로. 연결 성공 시 back으로 돌아갈지 판단하는 데 쓴다. */
export const CONNECT_FROM_MYPAGE_PATH = `${ROUTES.CONNECT}?${CONNECT_FROM_PARAM}=${CONNECT_FROM_MYPAGE}`;
