const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * 알림 발송 시각을 경과 시간 기준으로 표기한다.
 * - 1분 미만: 방금 전 / 1분~59분: N분 전 / 1시간~23시간: N시간 전
 * - 24시간~6일: 어제(1일), N일 전(2~6일)
 * - 7일 이상: 올해면 M월 D일, 아니면 YYYY년 M월 D일
 */
export const formatNotificationTime = (dateString: string | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < MINUTE) return '방금 전';
  if (diffMs < HOUR) return `${Math.floor(diffMs / MINUTE)}분 전`;
  if (diffMs < DAY) return `${Math.floor(diffMs / HOUR)}시간 전`;

  const dayDiff = Math.floor(diffMs / DAY);
  if (dayDiff <= 6) {
    return dayDiff === 1 ? '어제' : `${dayDiff}일 전`;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (date.getFullYear() === now.getFullYear()) {
    return `${month}월 ${day}일`;
  }
  return `${date.getFullYear()}년 ${month}월 ${day}일`;
};
