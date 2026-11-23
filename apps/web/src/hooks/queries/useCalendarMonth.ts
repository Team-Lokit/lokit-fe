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
 * - 날짜별 칸 정보(대표 사진, 기념일 라벨)로 변환해 반환한다.
 */
export const useCalendarMonth = ({ yearMonth, albumId }: UseCalendarMonthParams) => {
  const params = {
    yearMonth: toYearMonthKey(yearMonth),
    ...(albumId ? { albumId } : {}),
  };

  const response = useGetMonth(params, {
    query: { queryKey: getGetMonthQueryKey(params), placeholderData: keepPreviousData },
  });

  const days = useMemo(() => mapCalendarDays(response.data?.days), [response.data?.days]);

  return {
    days,
    isLoading: response.isLoading,
    isError: response.isError,
  };
};
