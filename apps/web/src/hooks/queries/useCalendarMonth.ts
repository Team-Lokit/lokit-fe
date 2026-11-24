import { getGetMonthQueryKey, useGetMonth, type GetMonthParams } from '@repo/api-client';
import { useMemo } from 'react';
import { mapCalendarDays, toYearMonthKey, type YearMonth } from '@/utils/calendar';

interface UseCalendarMonthParams {
  yearMonth: YearMonth;
  /** 앨범 상세에서 조회할 때만 전달 (없거나 기본 앨범이면 전체 사진 기준) */
  albumId?: number;
  /** false면 조회하지 않음 (조회 가능 범위 밖의 달 등) */
  enabled?: boolean;
}

/** 스와이프로 오가는 동안 재요청하지 않을 캐시 유지 시간 */
const CALENDAR_STALE_TIME = 60 * 1000;

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
      // 같은 앨범에서 달만 바뀔 때는 새 데이터가 올 때까지 이전 달 화면을 유지하고,
      // 앨범이 바뀌면 다른 앨범 사진이 잠깐 보이지 않도록 유지하지 않는다.
      placeholderData: (previousData, previousQuery) => {
        const previousParams = previousQuery?.queryKey[1] as GetMonthParams | undefined;
        return previousParams?.albumId === params.albumId ? previousData : undefined;
      },
      // 스와이프로 앞뒤 달을 오갈 때마다 다시 요청하지 않도록 잠시 캐시 유지
      // (사진 추가/수정/삭제 시에는 invalidateCalendarQueries로 갱신됨)
      staleTime: CALENDAR_STALE_TIME,
    },
  });

  const days = useMemo(() => mapCalendarDays(response.data?.days), [response.data?.days]);

  return {
    days,
    isLoading: response.isLoading,
    isError: response.isError,
  };
};
