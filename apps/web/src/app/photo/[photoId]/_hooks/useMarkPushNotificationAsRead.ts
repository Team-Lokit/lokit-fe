import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetNotificationsQueryKey,
  getHasUnreadNotificationsQueryKey,
  useMarkNotificationAsRead,
} from '@repo/api-client';

/**
 * 푸시 알림을 탭해 `?notifId=`와 함께 진입하면 해당 알림을 읽음 처리한다.
 * (앱/웹 모두 알림 탭 시 /photo/{photoId}?notifId=... 로 진입한다)
 * 처리 후 새로고침/뒤로가기 시 재호출되지 않도록 쿼리에서 notifId를 제거한다.
 */
const useMarkPushNotificationAsRead = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const handledNotifIdRef = useRef<string | null>(null);

  const notifId = searchParams.get('notifId');

  useEffect(() => {
    if (!notifId || handledNotifIdRef.current === notifId) return;
    handledNotifIdRef.current = notifId;

    markAsRead(
      { notifId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey() });
          queryClient.invalidateQueries({
            queryKey: getHasUnreadNotificationsQueryKey(),
          });
        },
      },
    );

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('notifId');
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [notifId, searchParams, pathname, router, markAsRead, queryClient]);
};

export default useMarkPushNotificationAsRead;
