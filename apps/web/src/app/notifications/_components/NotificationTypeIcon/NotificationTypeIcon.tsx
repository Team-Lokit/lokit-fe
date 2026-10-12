import { NotificationResponseType } from '@repo/api-client';
import CommentIcon from '@/assets/images/comment.svg';
import ReactionIcon from '@/assets/images/heart.svg';
import GalleryIcon from '@/assets/images/gallery.svg';
import * as S from './NotificationTypeIcon.styles';

interface NotificationTypeIconProps {
  type: NotificationResponseType;
}

export default function NotificationTypeIcon({ type }: NotificationTypeIconProps) {
  switch (type) {
    case NotificationResponseType.REACTION:
      return (
        <S.IconColor type={type}>
          <ReactionIcon />
        </S.IconColor>
      );
    case NotificationResponseType.UPLOAD:
      return (
        <S.IconColor type={type}>
          <GalleryIcon />
        </S.IconColor>
      );
    case NotificationResponseType.COMMENT:
    default:
      return (
        <S.IconColor type={NotificationResponseType.COMMENT}>
          <CommentIcon />
        </S.IconColor>
      );
  }
}
