'use client';

import DefaultHeader from '@/components/header/default/DefaultHeader';
import { useGoBackOrHome } from '@/hooks/useGoBackOrHome';
import { PAGE_TITLE } from '../../constants';

export default function HeaderClient() {
  const goBackOrHome = useGoBackOrHome();

  return (
    <DefaultHeader
      title={PAGE_TITLE}
      onClickBack={goBackOrHome}
      backButtonVariant="circle"
    />
  );
}
