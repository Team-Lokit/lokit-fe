import { http, HttpResponse, delay } from 'msw';
import type {
  AddEmoticonRequest,
  CommentListResponse,
  CommentResponse,
  CreateCommentRequest,
  RemoveEmoticonRequest,
} from '@repo/api-client';
import { API_URL } from '@/constants';
import { 댓글_초기_목록 } from './mockData';

const commentStore = new Map<number, CommentResponse[]>(
  Object.entries(댓글_초기_목록).map(([photoId, comments]) => [
    Number(photoId),
    comments,
  ]),
);

let nextCommentId = 1000;

const getCommentsByPhotoId = (photoId: number): CommentResponse[] => {
  if (!commentStore.has(photoId)) {
    commentStore.set(photoId, []);
  }
  return commentStore.get(photoId)!;
};

const findCommentById = (commentId: number): CommentResponse | undefined => {
  for (const comments of commentStore.values()) {
    const found = comments.find((comment) => comment.id === commentId);
    if (found) return found;
  }
  return undefined;
};

export const getCommentsHandler = http.get(
  `*${API_URL.PHOTOS.COMMENTS(':photoId')}`,
  async ({ params }) => {
    await delay(300);

    const photoId = Number(params.photoId);
    const comments = getCommentsByPhotoId(photoId);

    return HttpResponse.json(
      { data: { comments } satisfies CommentListResponse },
      { status: 200 },
    );
  },
);

export const createCommentHandler = http.post(
  `*${API_URL.PHOTOS.COMMENTS(':photoId')}`,
  async ({ params, request }) => {
    await delay(300);

    const photoId = Number(params.photoId);
    const body = (await request.json()) as CreateCommentRequest;

    const newComment: CommentResponse = {
      id: nextCommentId++,
      userId: 9999,
      userName: '나',
      userProfileImageUrl: 'https://i.pravatar.cc/64?img=5',
      content: body.content,
      commentedAt: new Date().toISOString(),
      emoticons: [],
      isEditable: true,
    };

    getCommentsByPhotoId(photoId).push(newComment);

    return HttpResponse.json({ data: { id: newComment.id } }, { status: 200 });
  },
);

export const addEmoticonHandler = http.post(
  `*${API_URL.PHOTOS.COMMENT_EMOTICONS(':commentId')}`,
  async ({ params, request }) => {
    await delay(200);

    const commentId = Number(params.commentId);
    const body = (await request.json()) as AddEmoticonRequest;
    const comment = findCommentById(commentId);

    if (comment) {
      const emoticons = comment.emoticons ?? [];
      const existing = emoticons.find((emoticon) => emoticon.emoji === body.emoji);

      comment.emoticons = existing
        ? emoticons.map((emoticon) =>
            emoticon.emoji === body.emoji
              ? { ...emoticon, count: (emoticon.count ?? 0) + 1, isEditable: true }
              : emoticon,
          )
        : [...emoticons, { emoji: body.emoji, count: 1, isEditable: true }];
    }

    return HttpResponse.json({ data: { id: commentId } }, { status: 200 });
  },
);

export const removeEmoticonHandler = http.delete(
  `*${API_URL.PHOTOS.COMMENT_EMOTICONS(':commentId')}`,
  async ({ params, request }) => {
    await delay(200);

    const commentId = Number(params.commentId);
    const body = (await request.json()) as RemoveEmoticonRequest;
    const comment = findCommentById(commentId);

    if (comment?.emoticons) {
      comment.emoticons = comment.emoticons
        .map((emoticon) =>
          emoticon.emoji === body.emoji
            ? {
                ...emoticon,
                count: Math.max((emoticon.count ?? 1) - 1, 0),
                isEditable: false,
              }
            : emoticon,
        )
        .filter((emoticon) => (emoticon.count ?? 0) > 0);
    }

    return new HttpResponse(null, { status: 204 });
  },
);

export const deleteCommentHandler = http.delete(
  `*${API_URL.PHOTOS.COMMENT_DETAIL(':commentId')}`,
  async ({ params }) => {
    await delay(300);

    const commentId = Number(params.commentId);

    for (const comments of commentStore.values()) {
      const index = comments.findIndex((comment) => comment.id === commentId);
      if (index !== -1) {
        comments.splice(index, 1);
        break;
      }
    }

    return new HttpResponse(null, { status: 204 });
  },
);

export const commentsHandlers = [
  getCommentsHandler,
  createCommentHandler,
  addEmoticonHandler,
  removeEmoticonHandler,
  deleteCommentHandler,
];
