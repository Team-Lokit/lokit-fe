import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useDeleteComment,
  useRestoreComment,
  getGetCommentsQueryKey,
  type CommentListResponse,
} from '@repo/api-client';
import { useToast } from '@/components/toast/ToastProvider';

const useCommentDelete = (photoId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const queryKey = getGetCommentsQueryKey(photoId);
  const [targetCommentId, setTargetCommentId] = useState<number | null>(null);

  const { mutateAsync: deleteCommentAsync, isPending: isDeleting } = useDeleteComment();
  const { mutateAsync: restoreCommentAsync } = useRestoreComment();

  const undoDelete = async (commentId: number) => {
    try {
      await restoreCommentAsync({ commentId });
      queryClient.invalidateQueries({ queryKey });
    } catch {
      showToast('댓글 복구에 실패했어요. 다시 시도해주세요');
    }
  };

  const openDeleteModal = (commentId: number) => {
    setTargetCommentId(commentId);
  };

  const closeDeleteModal = () => {
    setTargetCommentId(null);
  };

  const confirmDelete = async () => {
    if (targetCommentId === null) return;

    const commentId = targetCommentId;
    const previous = queryClient.getQueryData<CommentListResponse>(queryKey);

    queryClient.setQueryData<CommentListResponse>(queryKey, (old) => {
      if (!old?.comments) return old;
      return {
        ...old,
        comments: old.comments.filter((comment) => comment.id !== commentId),
      };
    });
    closeDeleteModal();

    try {
      await deleteCommentAsync({ commentId });
      queryClient.invalidateQueries({ queryKey });
      showToast('댓글이 삭제되었어요.', undefined, 'success', {
        label: '실행취소',
        onClick: () => undoDelete(commentId),
      });
    } catch {
      if (previous) {
        queryClient.setQueryData(queryKey, previous);
      }
      showToast('댓글 삭제에 실패했어요. 다시 시도해주세요');
    }
  };

  return {
    isModalOpen: targetCommentId !== null,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
};

export default useCommentDelete;
