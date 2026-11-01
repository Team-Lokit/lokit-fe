'use client';

import RouteErrorFallback from '@/components/common/routeErrorFallback/RouteErrorFallback';

export default function MyPageError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback {...props} />;
}
