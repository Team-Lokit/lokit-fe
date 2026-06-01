/**
 * ISO 8601 형식의 날짜를 YYYY M월 D 형식으로 변환합니다.
 * @param dateString - ISO 8601 형식의 날짜 문자열 (예: "2025-01-15T12:00:00Z")
 * @returns YYYY M월 D 형식의 문자열 (예: "2025 1월 15")
 */
export const formatPhotoDate = (dateString: string | undefined): string => {
  if (!dateString) return '날짜 없음';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '날짜 없음';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year} ${month}월 ${day}`;
};
