'use client';

import { useParams, useRouter } from 'next/navigation';
import DefaultHeader from '@/components/header/default/DefaultHeader';
import { CommentItem, CommentInput, CommentDeleteModal } from './_components';
import { useComments, useCommentReaction, useCommentDelete } from './_hooks';
import * as S from './page.styles';

export default function CommentsPage() {
  const router = useRouter();
  const params = useParams();
  const photoId = Number(params.photoId);

  const { comments, isSubmitting, submitComment } = useComments(photoId);
  const { toggleReaction } = useCommentReaction(photoId);
  const { isModalOpen, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete } =
    useCommentDelete(photoId);

  return (
    <S.Container>
      <DefaultHeader title="댓글" onClickBack={() => router.back()} />

      <S.List>
        {comments.length === 0 ? (
          <S.EmptyState>아직 댓글이 없어요</S.EmptyState>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onToggleReaction={toggleReaction}
              onRequestDelete={openDeleteModal}
            />
          ))
        )}
      </S.List>

      <CommentInput isSubmitting={isSubmitting} onSubmit={submitComment} />

      <CommentDeleteModal
        isOpen={isModalOpen}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </S.Container>
  );
}
