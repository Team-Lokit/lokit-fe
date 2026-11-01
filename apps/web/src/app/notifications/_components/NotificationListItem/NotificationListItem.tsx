import type { NotificationResponse } from '@repo/api-client';
import NotificationTypeIcon from '../NotificationTypeIcon/NotificationTypeIcon';
import { formatNotificationTime } from '../../_utils/formatNotificationTime';
import * as S from './NotificationListItem.styles';

interface NotificationListItemProps {
  notification: NotificationResponse;
  onClick: (notification: NotificationResponse) => void;
}

export default function NotificationListItem({
  notification,
  onClick,
}: NotificationListItemProps) {
  return (
    <S.Row isRead={!!notification.isRead} onClick={() => onClick(notification)}>
      <S.IconWrapper>
        <NotificationTypeIcon type={notification.type} />
      </S.IconWrapper>
      <S.TextGroup>
        <S.TopRow>
          <S.Title>{notification.title}</S.Title>
          <S.Time>{formatNotificationTime(notification.sentAt)}</S.Time>
        </S.TopRow>
        <S.Body>{notification.body}</S.Body>
      </S.TextGroup>
    </S.Row>
  );
}
