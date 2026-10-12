'use client';

import { useRouter } from 'next/navigation';
import DefaultHeader from '@/components/header/default/DefaultHeader';
import CircleButton from '@/components/buttons/circleButton/CircleButton';
import SettingIcon from '@/assets/images/setting.svg';
import { BUTTON_SIZE, ICON_SIZE } from '@/components/header/base/Header.constants';
import { ROUTES } from '@/constants/routes';
import { PAGE_TITLE } from '../../constants';

export default function HeaderClient() {
  const router = useRouter();

  return (
    <DefaultHeader
      title={PAGE_TITLE}
      onClickBack={() => router.back()}
      backButtonVariant="circle"
      fixed
      rightSlot={
        <CircleButton
          onClick={() => router.push(ROUTES.NOTIFICATION)}
          aria-label="알림 설정"
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
        >
          <SettingIcon width={ICON_SIZE} height={ICON_SIZE} />
        </CircleButton>
      }
    />
  );
}
