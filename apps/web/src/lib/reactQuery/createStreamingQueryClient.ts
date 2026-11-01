import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';

/**
 * 서버 컴포넌트에서 prefetch 결과를 스트리밍하기 위한 QueryClient
 *
 * - prefetch를 await하면 API 응답 전까지 페이지 전체가 막혀 하위 Suspense 스켈레톤이 보이지 않습니다.
 * - pending 쿼리도 dehydrate해 진행 중인 요청을 클라이언트로 스트리밍하고, useSuspenseQuery가 이를 이어받게 합니다.
 * - 따라서 이 QueryClient로 prefetch할 때는 await하지 않습니다.
 * - 요청 간 데이터가 섞이지 않도록 서버 컴포넌트 렌더링마다 새로 생성합니다.
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#streaming-with-server-components
 */
export function createStreamingQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}
