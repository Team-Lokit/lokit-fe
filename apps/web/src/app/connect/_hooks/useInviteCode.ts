'use client';

import { useCallback, useState } from 'react';
import { useCreateInvite, useRefreshInvite } from '@repo/api-client';
import { useToast } from '@/components/toast';

interface InviteCodeData {
  code: string;
  expiresAt: string;
}

export function useInviteCode() {
  const [inviteCode, setInviteCode] = useState<InviteCodeData | null>(null);
  const { showToast } = useToast();
  const { mutateAsync: create, isPending: isCreating } = useCreateInvite();
  const { mutateAsync: refresh, isPending: isRefreshing } = useRefreshInvite();

  const createCode = useCallback(async () => {
    try {
      const result = await create();
      if (result.inviteCode && result.expiresAt) {
        setInviteCode({
          code: result.inviteCode,
          expiresAt: result.expiresAt,
        });
      }
    } catch (error) {
      showToast('초대코드 생성에 실패했어요');
    }
  }, [create, setInviteCode, showToast]);

  const refreshCode = useCallback(async () => {
    try {
      const result = await refresh();
      if (result.inviteCode && result.expiresAt) {
        setInviteCode({
          code: result.inviteCode,
          expiresAt: result.expiresAt,
        });
        showToast('초대코드가 변경되었어요', 3000, 'warn');
      }
    } catch (error) {
      showToast('초대코드 갱신에 실패했어요');
    }
  }, [refresh, setInviteCode, showToast]);

  const copyCode = useCallback(async () => {
    if (!inviteCode?.code) return;

    try {
      await navigator.clipboard.writeText(inviteCode.code);
      showToast('복사되었어요');
    } catch (error) {
      showToast('복사에 실패했어요');
    }
  }, [inviteCode, showToast]);

  return {
    inviteCode,
    createCode,
    refreshCode,
    copyCode,
    isLoading: isCreating || isRefreshing,
  };
}
