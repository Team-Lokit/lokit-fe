'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { useGetMyPage } from '@repo/api-client';
import DefaultProfileIcon from '@/assets/images/defaultProfile.svg';
import ArrowRightIcon from '@/assets/images/arrowRight.svg';
import * as S from './CommentInput.styles';

/** 16px * 160% 줄 높이 5줄 + 상하 패딩(6px * 2) */
const MAX_TEXTAREA_HEIGHT = 25.6 * 5 + 12;

interface CommentInputProps {
  isSubmitting: boolean;
  onSubmit: (content: string) => void;
}

const CommentInput = ({ isSubmitting, onSubmit }: CommentInputProps) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: myPage } = useGetMyPage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isSubmitting) return;

    onSubmit(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }
  };

  return (
    <S.Wrapper>
      <S.Bar onSubmit={handleSubmit}>
        {myPage?.myProfileImageUrl ? (
          <S.ProfileImage
            src={myPage.myProfileImageUrl}
            alt={myPage.myName || '프로필'}
          />
        ) : (
          <S.ProfileFallback>
            <DefaultProfileIcon width={36} height={36} />
          </S.ProfileFallback>
        )}

        <S.Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="댓글 입력"
          rows={1}
          maxLength={200}
        />

        {value.trim() && (
          <S.SendButton type="submit" disabled={isSubmitting}>
            <S.SendIcon>
              <ArrowRightIcon width={22} height={22} />
            </S.SendIcon>
          </S.SendButton>
        )}
      </S.Bar>
    </S.Wrapper>
  );
};

export default CommentInput;
