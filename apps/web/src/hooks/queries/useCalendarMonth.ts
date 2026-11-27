import { getGetMonthQueryKey, useGetMonth } from '@repo/api-client';
import { useMemo } from 'react';
import { mapCalendarDays, toYearMonthKey, type YearMonth } from '@/utils/calendar';

interface UseCalendarMonthParams {
  yearMonth: YearMonth;
  /** 앨범 상세에서 조회할 때만 전달 (없거나 기본 앨범이면 전체 사진 기준) */
  albumId?: number;
  /** false면 조회하지 않음 (조회 가능 범위 밖의 달 등) */
  enabled?: boolean;
}

/** 다른 달로 넘어갔다 돌아올 때 이전 데이터를 바로 보여주기 위한 캐시 보관 시간 */
const CALENDAR_GC_TIME = 5 * 60 * 1000;

/**
 * GET /calendar 월간 캘린더 조회
 * - 날짜별 칸 정보(대표 사진, 기념일 라벨)로 변환해 반환한다.
 */
export const useCalendarMonth = ({
  yearMonth,
  albumId,
  enabled = true,
}: UseCalendarMonthParams) => {
  const params = {
    yearMonth: toYearMonthKey(yearMonth),
    ...(albumId ? { albumId } : {}),
  };

  const response = useGetMonth(params, {
    query: {
      queryKey: getGetMonthQueryKey(params),
      enabled,
      // 파트너가 올린 사진도 바로 보이도록 달이 바뀔 때마다 재요청한다.
      // 캐시된 달은 이전 데이터를 먼저 보여주고 백그라운드에서 갱신한다.
      staleTime: 0,
      gcTime: CALENDAR_GC_TIME,
    },
  });

  const days = useMemo(() => mapCalendarDays(response.data?.days), [response.data?.days]);

  return {
    days,
    isLoading: response.isLoading,
    isError: response.isError,
  };
};
