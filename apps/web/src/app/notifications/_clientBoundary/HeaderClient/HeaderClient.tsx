'use client';

import { useRouter } from 'next/navigation';
import DefaultHeader from '@/components/header/default/DefaultHeader';
import { HeaderIconButton } from '@/components/header';
import SettingIcon from '@/assets/images/setting.svg';
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
        <HeaderIconButton
          icon={SettingIcon}
          onClick={() => router.push(ROUTES.NOTIFICATION)}
          aria-label="알림 설정"
        />
      }
    />
  );
}
