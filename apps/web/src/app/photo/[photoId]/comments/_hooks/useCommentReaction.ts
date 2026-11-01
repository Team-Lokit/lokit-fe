import { useQueryClient } from '@tanstack/react-query';
import {
  useAddEmoticon,
  useRemoveEmoticon,
  getGetCommentsQueryKey,
  type CommentListResponse,
} from '@repo/api-client';
import { useToast } from '@/components/toast/ToastProvider';

const useCommentReaction = (photoId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const queryKey = getGetCommentsQueryKey(photoId);

  const applyOptimisticReaction = (
    commentId: number,
    emoji: string,
    isReacted: boolean,
  ) => {
    const previous = queryClient.getQueryData<CommentListResponse>(queryKey);

    queryClient.setQueryData<CommentListResponse>(queryKey, (old) => {
      if (!old?.comments) return old;

      return {
        ...old,
        comments: old.comments.map((comment) => {
          if (comment.id !== commentId) return comment;

          const emoticons = comment.emoticons ?? [];
          const existing = emoticons.find((emoticon) => emoticon.emoji === emoji);

          if (isReacted) {
            const nextEmoticons = existing
              ? emoticons.map((emoticon) =>
                  emoticon.emoji === emoji
                    ? { ...emoticon, count: (emoticon.count ?? 0) + 1, isEditable: true }
                    : emoticon,
                )
              : [...emoticons, { emoji, count: 1, isEditable: true }];

            return { ...comment, emoticons: nextEmoticons };
          }

          const nextEmoticons = emoticons
            .map((emoticon) =>
              emoticon.emoji === emoji
                ? {
                    ...emoticon,
                    count: Math.max((emoticon.count ?? 1) - 1, 0),
                    isEditable: false,
                  }
                : emoticon,
            )
            .filter((emoticon) => (emoticon.count ?? 0) > 0);

          return { ...comment, emoticons: nextEmoticons };
        }),
      };
    });

    return previous;
  };

  const { mutateAsync: addEmoticonAsync } = useAddEmoticon();
  const { mutateAsync: removeEmoticonAsync } = useRemoveEmoticon();

  const toggleReaction = async (commentId: number, emoji: string, isReacted: boolean) => {
    const previous = applyOptimisticReaction(commentId, emoji, !isReacted);

    try {
      if (isReacted) {
        await removeEmoticonAsync({ commentId, data: { emoji } });
      } else {
        await addEmoticonAsync({ commentId, data: { emoji } });
      }
    } catch {
      if (previous) {
        queryClient.setQueryData(queryKey, previous);
      }
      showToast('반응을 처리하지 못했어요. 다시 시도해주세요');
    }
  };

  return { toggleReaction };
};

export default useCommentReaction;
