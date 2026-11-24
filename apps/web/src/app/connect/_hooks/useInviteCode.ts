'use client';

import { useCallback, useState } from 'react';
import {
  ApiError,
  useCreateInvite,
  useRefreshInvite,
  type InviteCodeResponse,
} from '@repo/api-client';
import { useToast } from '@/components/toast';

interface InviteCodeData {
  code: string;
  expiresAt: string;
}

/** 초대코드 생성 요청 횟수 제한 */
const RATE_LIMIT_ERROR_CODE = 'COUPLE_017';

/**
 * 마지막으로 받은 초대코드. 연결 화면을 나갔다 다시 들어와도 바로 보여주고,
 * 생성 요청이 횟수 제한(429)에 걸리면 이 코드를 그대로 쓴다.
 * 로그아웃·탈퇴·연결 끊기는 모두 페이지를 새로 불러오므로 다른 계정의 코드가 남지 않는다.
 */
let lastInviteCode: InviteCodeData | null = null;
/** 진행 중인 생성 요청. 동시에 여러 번 호출돼도(StrictMode 등) 요청은 한 번만 보낸다. */
let pendingCreate: Promise<InviteCodeResponse> | null = null;

const getValidLastInviteCode = () =>
  lastInviteCode && new Date(lastInviteCode.expiresAt).getTime() > Date.now()
    ? lastInviteCode
    : null;

const isRateLimitError = (error: unknown) =>
  error instanceof ApiError && error.data?.errorCode === RATE_LIMIT_ERROR_CODE;

export function useInviteCode() {
  const [inviteCode, setInviteCode] = useState<InviteCodeData | null>(
    getValidLastInviteCode,
  );
  const { showToast } = useToast();
  const { mutateAsync: create, isPending: isCreating } = useCreateInvite();
  const { mutateAsync: refresh, isPending: isRefreshing } = useRefreshInvite();

  const saveInviteCode = useCallback((result: InviteCodeResponse) => {
    if (!result.inviteCode || !result.expiresAt) return false;

    const next = { code: result.inviteCode, expiresAt: result.expiresAt };
    lastInviteCode = next;
    setInviteCode(next);
    return true;
  }, []);

  const createCode = useCallback(async () => {
    try {
      pendingCreate ??= create().finally(() => {
        pendingCreate = null;
      });
      saveInviteCode(await pendingCreate);
    } catch (error) {
      // 횟수 제한이어도 보여줄 코드가 있으면 그 코드를 그대로 쓴다
      if (isRateLimitError(error) && getValidLastInviteCode()) return;
      showToast('초대코드 생성에 실패했어요');
    }
  }, [create, saveInviteCode, showToast]);

  const refreshCode = useCallback(async () => {
    try {
      if (saveInviteCode(await refresh())) {
        showToast('초대코드가 변경되었어요', 3000, 'warn');
      }
    } catch (error) {
      showToast('초대코드 갱신에 실패했어요');
    }
  }, [refresh, saveInviteCode, showToast]);

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
