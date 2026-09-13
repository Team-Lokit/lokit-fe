'use client';

import { useRouter } from 'next/navigation';
import {
  useGetNotificationsSuspense,
  useMarkNotificationAsRead,
  getGetNotificationsQueryKey,
  type NotificationResponse,
  type PageResultNotificationResponse,
} from '@repo/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/constants/routes';
import { NOTIFICATION_LIST_PARAMS } from '@/app/notifications/constants';
import NotificationListItem from '../../../NotificationListItem/NotificationListItem';
import NotificationListEmptyState from '../../../NotificationListEmptyState/NotificationListEmptyState';
import * as S from './NotificationListClient.styles';

export default function NotificationListClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useGetNotificationsSuspense(NOTIFICATION_LIST_PARAMS);
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const notifications = data.content ?? [];
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  if (notifications.length === 0) {
    return <NotificationListEmptyState />;
  }

  const handleClickItem = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      const queryKey = getGetNotificationsQueryKey(NOTIFICATION_LIST_PARAMS);
      queryClient.setQueryData<PageResultNotificationResponse>(queryKey, (old) =>
        old
          ? {
              ...old,
              content: old.content?.map((n) =>
                n.notifId === notification.notifId ? { ...n, isRead: true } : n,
              ),
            }
          : old,
      );
      markAsRead({ notifId: notification.notifId });
    }

    if (notification.targetPhotoId) {
      router.push(ROUTES.PHOTO.VIEW(notification.targetPhotoId));
    }
  };

  return (
    <S.List>
      {unread.map((notification) => (
        <NotificationListItem
          key={notification.notifId}
          notification={notification}
          onClick={handleClickItem}
        />
      ))}

      {read.length > 0 && (
        <>
          <S.SectionTitle>읽은 알림</S.SectionTitle>
          {read.map((notification) => (
            <NotificationListItem
              key={notification.notifId}
              notification={notification}
              onClick={handleClickItem}
            />
          ))}
        </>
      )}

      <S.Footer>알림은 최근 30일 동안 보관돼요.</S.Footer>
    </S.List>
  );
}
