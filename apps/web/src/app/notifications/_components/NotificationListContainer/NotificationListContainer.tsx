'use client';

import { Suspense } from 'react';
import NotificationListClient from './_clientBoundary/NotificationListClient/NotificationListClient';
import NotificationListFallback from '../NotificationListFallback/NotificationListFallback';

export default function NotificationListContainer() {
  return (
    <Suspense fallback={<NotificationListFallback />}>
      <NotificationListClient />
    </Suspense>
  );
}
