'use client';

import { useRouter } from 'next/navigation';
import {
  useMarkNotificationAsRead,
  getNotifications,
  type NotificationResponse,
  type PageResultNotificationResponse,
} from '@repo/api-client';
import {
  useQueryClient,
  useSuspenseInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { ROUTES } from '@/constants/routes';
import { NOTIFICATION_LIST_PAGE_SIZE } from '@/app/notifications/constants';
import {
  getNotificationsInfiniteQueryKey,
  getNotificationsNextPageParam,
} from '@/app/notifications/_utils/notificationsQuery';
import { useInfiniteScrollSentinel } from '@/app/notifications/_utils/useInfiniteScrollSentinel';
import NotificationListItem from '../../../NotificationListItem/NotificationListItem';
import NotificationListEmptyState from '../../../NotificationListEmptyState/NotificationListEmptyState';
import * as S from './NotificationListClient.styles';

export default function NotificationListClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const queryKey = getNotificationsInfiniteQueryKey();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        getNotifications({ page: pageParam, size: NOTIFICATION_LIST_PAGE_SIZE }),
      initialPageParam: 0,
      getNextPageParam: getNotificationsNextPageParam,
    });
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const sentinelRef = useInfiniteScrollSentinel(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, hasNextPage);

  const notifications = data.pages.flatMap((page) => page.content ?? []);
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  if (notifications.length === 0) {
    return <NotificationListEmptyState />;
  }

  const handleClickItem = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      queryClient.setQueryData<InfiniteData<PageResultNotificationResponse>>(
        queryKey,
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content?.map((n) =>
                n.notifId === notification.notifId ? { ...n, isRead: true } : n,
              ),
            })),
          },
      );
      markAsRead({ notifId: notification.notifId });
    }

    if (notification.targetPhotoId) {
      router.push(ROUTES.PHOTO.VIEW(notification.targetPhotoId));
    }
  };

  return (
    <S.List>
      <S.Card>
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
      </S.Card>

      {hasNextPage ? (
        <div ref={sentinelRef}>
          {isFetchingNextPage && <S.LoadingMore>불러오는 중...</S.LoadingMore>}
        </div>
      ) : (
        <S.Footer>알림은 최근 30일 동안 보관돼요.</S.Footer>
      )}
    </S.List>
  );
}
