import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { COUPLE_STATUS_COOKIE } from '@/constants/cookie';
import { COUPLE_STATUS } from '@/constants/coupleStatus';
import MapRoute from './_components/MapRoute';
import DisconnectNoticeModal from './_components/disconnectNoticeModal/DisconnectNoticeModal';

export default async function Home() {
  const cookieStore = await cookies();
  // 알림창은 상대가 연결을 끊은 경우에만 필요하므로, 그때만 노출 여부를 조회한다.
  const isDisconnectedByPartner =
    cookieStore.get(COUPLE_STATUS_COOKIE)?.value ===
    COUPLE_STATUS.DISCONNECTED_BY_PARTNER;

  return (
    <>
      <Suspense>
        <MapRoute />
      </Suspense>
      {isDisconnectedByPartner && <DisconnectNoticeModal />}
    </>
  );
}
