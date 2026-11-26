'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useJoinByInviteCode,
  getGetMyStatusQueryKey,
  saveCoupleStatusCookie,
  ApiError,
} from '@repo/api-client';
import type { JoinCodeResult } from '../_types';

export function useCodeVerification() {
  const queryClient = useQueryClient();
  const { mutateAsync: join, isPending: isJoining } = useJoinByInviteCode();

  const joinCode = useCallback(
    async (code: string): Promise<JoinCodeResult> => {
      try {
        await join({ data: { inviteCode: code } });
        await saveCoupleStatusCookie().catch(() => {});
        queryClient.invalidateQueries({ queryKey: getGetMyStatusQueryKey() });
        return { success: true };
      } catch (error) {
        if (error instanceof ApiError) {
          const errorCode = error?.data?.errorCode || String(error?.code);
          return { success: false, errorCode };
        }
        return { success: false, errorCode: 'UNKNOWN_ERROR' };
      }
    },
    [join, queryClient],
  );

  return { joinCode, isJoining };
}
