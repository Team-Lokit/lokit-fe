'use client';

import { useEffect, useState } from 'react';
import ChevronRightSmallIcon from '@/assets/images/chevronRightSmall.svg';
import { checkNotificationPermissionFromBridge } from '@/utils/bridge/checkNotificationPermissionFromBridge';
import { openNotificationSettingsFromBridge } from '@/utils/bridge/openNotificationSettingsFromBridge';
import * as S from './DeviceNotificationBannerClient.styles';

/** 알림 수신이 가능한 상태로 간주할 권한 값. 이 외(denied/blocked/unavailable)는 꺼짐으로 취급 */
const ENABLED_STATUSES = new Set(['granted', 'limited']);

export default function DeviceNotificationBannerClient() {
  const [isPermissionOff, setIsPermissionOff] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // 브리지가 없는 순수 웹에서는 status가 null로 돌아오고, 이 경우 배너는 계속 숨김 상태를 유지한다.
    checkNotificationPermissionFromBridge().then((status) => {
      if (cancelled || !status) return;
      setIsPermissionOff(!ENABLED_STATUSES.has(status));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isPermissionOff) return null;

  return (
    <S.Wrapper>
      <S.Banner onClick={() => openNotificationSettingsFromBridge()}>
        <S.TextGroup>
          <S.Title>기기 알림이 꺼져 있어요</S.Title>
          <S.Description>기기 설정에서 로킷의 알림을 허용해주세요.</S.Description>
        </S.TextGroup>
        <S.ChevronIcon>
          <ChevronRightSmallIcon />
        </S.ChevronIcon>
      </S.Banner>
    </S.Wrapper>
  );
}
