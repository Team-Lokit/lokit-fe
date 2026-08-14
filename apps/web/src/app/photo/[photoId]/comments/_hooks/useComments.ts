import { useQueryClient } from '@tanstack/react-query';
import {
  useGetComments,
  useCreateComment,
  getGetCommentsQueryKey,
  getGetCommentsQueryOptions,
  type CommentResponse,
} from '@repo/api-client';
import { useToast } from '@/components/toast/ToastProvider';

const useComments = (photoId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading } = useGetComments(photoId, {
    query: getGetCommentsQueryOptions(photoId),
  });

  const { mutateAsync: createCommentAsync, isPending: isSubmitting } = useCreateComment();

  const comments: CommentResponse[] = data?.comments ?? [];

  const submitComment = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      await createCommentAsync({ photoId, data: { content: trimmed } });
      queryClient.invalidateQueries({ queryKey: getGetCommentsQueryKey(photoId) });
    } catch {
      showToast('댓글 등록에 실패했어요. 다시 시도해주세요');
    }
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    submitComment,
  };
};

export default useComments;
