'use client';

import RouteErrorFallback from '@/components/common/routeErrorFallback/RouteErrorFallback';

export default function SignoutError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback {...props} />;
}
