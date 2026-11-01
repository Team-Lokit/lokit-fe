import type { CommentResponse } from '@repo/api-client';

export const 댓글_초기_목록: Record<number, CommentResponse[]> = {
  101: [
    {
      id: 1,
      userId: 1001,
      userName: '김철수',
      userProfileImageUrl: 'https://i.pravatar.cc/64?img=12',
      content: '안녕하세요? 여기 풍경 정말 좋네요!',
      commentedAt: '2025-01-27T10:00:00Z',
      emoticons: [{ emoji: '❤️', count: 2, isEditable: false }],
      isEditable: true,
    },
    {
      id: 2,
      userId: 1002,
      userName: '김영희',
      userProfileImageUrl: 'https://i.pravatar.cc/64?img=32',
      content: '저도 가보고 싶어요 :)',
      commentedAt: '2025-01-27T11:30:00Z',
      emoticons: [],
      isEditable: false,
    },
  ],
};
