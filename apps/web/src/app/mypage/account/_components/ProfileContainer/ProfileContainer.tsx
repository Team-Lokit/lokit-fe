import ProfileRowClient from '@/app/mypage/account/_clientBoundary/ProfileRowClient/ProfileRowClient';
import styles from './ProfileContainer.module.css';
import { ReactNode, Suspense } from 'react';
import ProfileRowFallback from '@/app/mypage/account/_components/ProfileRowFallback/ProfileRowFallback';
import ProfileNameValueClient from '@/app/mypage/account/_clientBoundary/ProfileNameValueClient/ProfileNameValueClient';
import ConnectedAccountValueClient from '@/app/mypage/account/_clientBoundary/ConnectedAccountValueClient/ConnectedAccountValueClient';
import VersionInfoValueClient from '@/app/mypage/account/_clientBoundary/VersionInfoValueClient/VersionInfoValueClient';

const PROFILE_ROWS: {
  title: string;
  value: ReactNode;
}[] = [
  {
    title: '이름',
    value: <ProfileNameValueClient />,
  },
  {
    title: '연결된 계정',
    value: <ConnectedAccountValueClient />,
  },
  {
    title: '나의 버전 정보',
    value: <VersionInfoValueClient />,
  },
];

export default function ProfileContainer() {
  return (
    <div className={styles.wrapper}>
      {PROFILE_ROWS.map(({ title, value }) => (
        <ProfileRowClient key={title} title={title}>
          <Suspense fallback={<ProfileRowFallback />}>{value}</Suspense>
        </ProfileRowClient>
      ))}
    </div>
  );
}
