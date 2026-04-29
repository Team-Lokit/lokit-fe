'use client';

import { useGetMyPageSuspense } from '@repo/api-client';

export default function ProfileNameValueClient() {
  const { data } = useGetMyPageSuspense();

  return <>{data.myName}</>;
}
