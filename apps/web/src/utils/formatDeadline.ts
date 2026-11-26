/**
 * "2026-02-11" 또는 "2026-02-11T..." → "2026년 2월 11일"
 * - 시간대 변환 없이 문자열의 날짜 부분만 사용한다.
 */
export const formatDeadline = (deadline?: string | null) => {
  const match = deadline?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};
