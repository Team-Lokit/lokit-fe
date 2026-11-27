import type { QueryClient } from '@tanstack/react-query';

/**
 * 캘린더 관련 쿼리(월간 `/calendar`, 날짜별 `/calendar/days/{date}/photos`)를 모두 무효화한다.
 * 두 쿼리 키의 첫 요소가 달라 prefix 매칭으로는 함께 무효화되지 않으므로 predicate를 사용한다.
 */
export const invalidateCalendarQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      typeof queryKey[0] === 'string' && queryKey[0].startsWith('/calendar'),
  });
