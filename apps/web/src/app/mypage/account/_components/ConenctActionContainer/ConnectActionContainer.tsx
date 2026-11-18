import DisconnectClient from '@/app/mypage/account/_clientBoundary/DisconnectClient/DisconnectClient';

interface ConnectActionContainerProps {
  isCoupled: boolean;
}

// 연결 끊기는 커플일 때만 노출한다. (재연결은 마이페이지 연결 배너로 통합)
export default function ConnectActionContainer({
  isCoupled,
}: ConnectActionContainerProps) {
  if (!isCoupled) return null;

  return <DisconnectClient />;
}
