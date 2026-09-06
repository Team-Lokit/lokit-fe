'use client';

import {
  useGetNotificationSettingsSuspense,
  useUpdateNotificationSettings,
  getGetNotificationSettingsQueryKey,
  type NotificationSettingsResponse,
  type NotificationResponseType,
} from '@repo/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/toast';
import Toggle from '@/components/buttons/toggle/Toggle';
import * as S from './NotificationSettingRowClient.styles';

interface NotificationSettingRowClientProps {
  title: string;
  description: string;
  types: NotificationResponseType[];
}

export default function NotificationSettingRowClient({
  title,
  description,
  types,
}: NotificationSettingRowClientProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data } = useGetNotificationSettingsSuspense();
  const { mutate: updateNotificationSettings } = useUpdateNotificationSettings();

  const checked = types.every((type) => data.types[type]);

  const handleChange = (next: boolean) => {
    const queryKey = getGetNotificationSettingsQueryKey();
    // 토글 하나가 여러 알림 타입을 한 번에 제어하므로 각 타입에 동일한 값을 매핑
    const nextTypes = Object.fromEntries(types.map((type) => [type, next]));

    // 진행 중인 fetch가 낙관적 업데이트를 덮어쓰지 않도록 먼저 취소
    queryClient.cancelQueries({ queryKey });
    // 실패 시 롤백할 수 있도록 변경 전 캐시 스냅샷 보관
    const previousData = queryClient.getQueryData<NotificationSettingsResponse>(queryKey);
    // 서버 응답을 기다리지 않고 캐시를 먼저 갱신해 토글이 즉시 반응하도록 함
    queryClient.setQueryData<NotificationSettingsResponse>(queryKey, (old) =>
      old ? { ...old, types: { ...old.types, ...nextTypes } } : old,
    );

    updateNotificationSettings(
      { data: { types: nextTypes } },
      {
        onError: () => {
          // 요청 실패 시 낙관적 업데이트를 되돌리고 사용자에게 알림
          queryClient.setQueryData(queryKey, previousData);
          showToast('알림 설정 변경에 실패했어요');
        },
        onSettled: () => {
          // 성공/실패와 무관하게 서버 최신 상태로 재검증
          queryClient.invalidateQueries({ queryKey });
        },
      },
    );
  };

  return (
    <S.Row>
      <S.TextGroup>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
      </S.TextGroup>
      <Toggle checked={checked} onChange={handleChange} />
    </S.Row>
  );
}
