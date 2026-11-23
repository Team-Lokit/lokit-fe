import { keepPreviousData } from '@tanstack/react-query';
import { getGetMonthQueryKey, useGetMonth } from '@repo/api-client';
import { useMemo } from 'react';
import { mapCalendarDays, toYearMonthKey, type YearMonth } from '@/utils/calendar';

interface UseCalendarMonthParams {
  yearMonth: YearMonth;
  /** 앨범 상세에서 조회할 때만 전달 (없거나 기본 앨범이면 전체 사진 기준) */
  albumId?: number;
}

/**
 * GET /calendar 월간 캘린더 조회
 * - 날짜별 대표 썸네일과 기념일 라벨로 변환해 반환한다.
 */
export const useCalendarMonth = ({ yearMonth, albumId }: UseCalendarMonthParams) => {
  const params = {
    yearMonth: toYearMonthKey(yearMonth),
    ...(albumId ? { albumId } : {}),
  };

  const response = useGetMonth(params, {
    query: { queryKey: getGetMonthQueryKey(params), placeholderData: keepPreviousData },
  });

  const { thumbnails, anniversaries } = useMemo(
    () => mapCalendarDays(response.data?.days),
    [response.data?.days],
  );

  return {
    thumbnails,
    anniversaries,
    isLoading: response.isLoading,
    isError: response.isError,
  };
};
