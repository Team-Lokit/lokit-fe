'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

interface RouteErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 라우트 error.tsx 공통 화면
 *
 * - error.tsx의 reset()은 화면만 다시 그려서 그대로는 재요청이 일어나지 않습니다.
 * - React Query: 에러 상태가 남아 있으면 useSuspenseQuery가 재요청 없이 같은 에러를 다시 던집니다.
 *   - useQueryErrorResetBoundary의 reset으로 쿼리 에러 상태를 초기화합니다.
 * - 서버 컴포넌트: reset()만으로는 서버 컴포넌트가 다시 실행되지 않습니다.
 *   - router.refresh()로 서버 컴포넌트를 다시 요청합니다.
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/reference/QueryErrorResetBoundary
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#reset
 */
export default function RouteErrorFallback({ error, reset }: RouteErrorFallbackProps) {
  const router = useRouter();
  const { reset: resetQueries } = useQueryErrorResetBoundary();
  const [isRetrying, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRetry = () => {
    resetQueries();
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: '16px',
      }}
    >
      <p style={{ color: '#999', fontSize: '16px' }}>페이지를 불러오지 못했어요</p>
      <button
        type="button"
        onClick={handleRetry}
        disabled={isRetrying}
        style={{
          padding: '8px 20px',
          borderRadius: '8px',
          border: '1px solid #555',
          background: 'transparent',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
