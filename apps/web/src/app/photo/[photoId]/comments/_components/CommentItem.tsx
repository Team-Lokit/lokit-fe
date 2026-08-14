'use client';

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CommentResponse } from '@repo/api-client';
import Menu from '@/components/menu/Menu';
import MenuIcon from '@/assets/images/menu.svg';
import ReactionIcon from '@/assets/images/reaction.svg';
import DefaultProfileIcon from '@/assets/images/defaultProfile.svg';
import { formatCommentDate } from '../utils/formatCommentDate';
import ReactionPicker from './ReactionPicker';
import * as S from './CommentItem.styles';

interface CommentItemProps {
  comment: CommentResponse;
  onToggleReaction: (commentId: number, emoji: string, reacted: boolean) => void;
  onRequestDelete: (commentId: number) => void;
}

interface AnchorPosition {
  top: number;
  right: number;
}

const getAnchorPosition = (element: HTMLElement): AnchorPosition => {
  const rect = element.getBoundingClientRect();
  return { top: rect.bottom + 6, right: window.innerWidth - rect.right };
};

const CommentItem = ({
  comment,
  onToggleReaction,
  onRequestDelete,
}: CommentItemProps) => {
  const utilityChipRef = useRef<HTMLDivElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<AnchorPosition | null>(null);

  if (!comment.id) return null;

  const commentId = comment.id;
  const emoticons = comment.emoticons ?? [];

  const handleSelectEmoji = (emoji: string) => {
    const existing = emoticons.find((emoticon) => emoticon.emoji === emoji);
    onToggleReaction(commentId, emoji, !!existing?.isEditable);
  };

  const toggleMenu = () => {
    if (menuPosition) {
      setMenuPosition(null);
      return;
    }
    if (utilityChipRef.current) {
      setMenuPosition(getAnchorPosition(utilityChipRef.current));
    }
  };

  return (
    <S.Container>
      {comment.userProfileImageUrl ? (
        <S.ProfileImage
          src={comment.userProfileImageUrl}
          alt={comment.userName || '프로필'}
        />
      ) : (
        <DefaultProfileIcon width={28} height={28} />
      )}

      <S.Body>
        <S.Row>
          <S.TextColumn>
            <S.MetaRow>
              <S.Name>{comment.userName || '알 수 없음'}</S.Name>
              <S.Dot>·</S.Dot>
              <S.Date>{formatCommentDate(comment.commentedAt)}</S.Date>
            </S.MetaRow>

            <S.Content>{comment.content}</S.Content>
          </S.TextColumn>

          <S.UtilityChip ref={utilityChipRef}>
            <S.IconButton type="button" onClick={() => setIsPickerOpen(true)}>
              <ReactionIcon width={14} height={14} />
            </S.IconButton>

            {comment.isEditable && (
              <S.IconButton type="button" onClick={toggleMenu}>
                <MenuIcon width={20} height={20} />
              </S.IconButton>
            )}
          </S.UtilityChip>

          {menuPosition &&
            typeof document !== 'undefined' &&
            document.getElementById('modal-root') &&
            createPortal(
              <>
                <S.MenuBackdrop onClick={() => setMenuPosition(null)} />
                <S.MenuDropdown
                  style={{ top: menuPosition.top, right: menuPosition.right }}
                >
                  <Menu size="sm">
                    <Menu.Item
                      onClick={() => {
                        setMenuPosition(null);
                        onRequestDelete(commentId);
                      }}
                    >
                      댓글 삭제
                    </Menu.Item>
                  </Menu>
                </S.MenuDropdown>
              </>,
              document.getElementById('modal-root')!,
            )}

          {isPickerOpen && (
            <ReactionPicker
              onSelect={handleSelectEmoji}
              onClose={() => setIsPickerOpen(false)}
            />
          )}
        </S.Row>

        {emoticons.length > 0 && (
          <S.ReactionRow>
            {emoticons.map(
              (emoticon) =>
                emoticon.emoji && (
                  <S.ReactionChip
                    key={emoticon.emoji}
                    type="button"
                    $reacted={emoticon.isEditable}
                    onClick={() =>
                      onToggleReaction(commentId, emoticon.emoji!, !!emoticon.isEditable)
                    }
                  >
                    <span>{emoticon.emoji}</span>
                    <span>{emoticon.count ?? 0}</span>
                  </S.ReactionChip>
                ),
            )}
          </S.ReactionRow>
        )}
      </S.Body>
    </S.Container>
  );
};

export default CommentItem;
