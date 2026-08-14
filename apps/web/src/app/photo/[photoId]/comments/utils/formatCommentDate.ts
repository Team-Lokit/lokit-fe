/**
 * ISO 8601 형식의 날짜를 YY.MM.DD 형식으로 변환합니다.
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns YY.MM.DD 형식의 문자열 (예: "25.01.27")
 */
export const formatCommentDate = (dateString: string | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};
