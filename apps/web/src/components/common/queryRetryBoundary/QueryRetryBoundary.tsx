'use client';

import { Component, type ReactNode } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

/**
 * 서버에서 스트리밍된 쿼리가 실패했을 때 브라우저에서 한 번 다시 요청하게 하는 에러 바운더리
 *
 * - pending 상태로 dehydrate된 쿼리는 서버 요청이 실패하면 실패 상태 그대로 hydrate되어, useSuspenseQuery가 재요청 없이 에러를 던집니다.
 * - 첫 에러에서 쿼리 에러 상태를 reset하고 다시 렌더링해 브라우저가 쿠키를 실어 재요청하게 합니다.
 * - 401이면 customFetcher가 로그인 화면으로 보냅니다.
 * - 재요청도 실패하면 상위 에러 바운더리로 넘깁니다.
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/reference/QueryErrorResetBoundary
 */
export default function QueryRetryBoundary({ children }: { children: ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();

  return <RetryOnceBoundary onRetry={reset}>{children}</RetryOnceBoundary>;
}

interface RetryOnceBoundaryProps {
  children: ReactNode;
  onRetry: () => void;
}

interface RetryOnceBoundaryState {
  error: unknown;
  hasRetried: boolean;
}

class RetryOnceBoundary extends Component<
  RetryOnceBoundaryProps,
  RetryOnceBoundaryState
> {
  state: RetryOnceBoundaryState = { error: null, hasRetried: false };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch() {
    if (this.state.hasRetried) return;
    this.props.onRetry();
    this.setState({ error: null, hasRetried: true });
  }

  render() {
    if (this.state.error !== null) {
      if (this.state.hasRetried) throw this.state.error;
      return null;
    }
    return this.props.children;
  }
}
