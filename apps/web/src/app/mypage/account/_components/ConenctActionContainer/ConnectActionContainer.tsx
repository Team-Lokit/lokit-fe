import DisconnectClient from '@/app/mypage/account/_clientBoundary/DisconnectClient/DisconnectClient';
import ReconnectClient from '@/app/mypage/account/_clientBoundary/ReconnectClient/ReconnectClient';

export default function ConnectActionContainer() {
  return (
    <>
      <ReconnectClient />
      <DisconnectClient />
    </>
  );
}
