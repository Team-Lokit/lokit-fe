import ProfileRowClient from '@/app/mypage/account/_clientBoundary/ProfileRowClient/ProfileRowClient';
import styles from './ProfileContainer.module.css';
import { Suspense } from 'react';
import ProfileRowFallback from '@/app/mypage/account/_components/ProfileRowFallback/ProfileRowFallback';
import ProfileNameValueClient from '@/app/mypage/account/_clientBoundary/ProfileNameValueClient/ProfileNameValueClient';
import ConnectedAccountValueClient from '@/app/mypage/account/_clientBoundary/ConnectedAccountValueClient/ConnectedAccountValueClient';
import VersionInfoValueClient from '@/app/mypage/account/_clientBoundary/VersionInfoValueClient/VersionInfoValueClient';

export default function ProfileContainer() {
  return (
    <div className={styles.wrapper}>
      <ProfileRowClient type="name">
        <Suspense fallback={<ProfileRowFallback />}>
          <ProfileNameValueClient />
        </Suspense>
      </ProfileRowClient>
      <ProfileRowClient type="connectedAccount">
        <Suspense fallback={<ProfileRowFallback />}>
          <ConnectedAccountValueClient />
        </Suspense>
      </ProfileRowClient>
      <ProfileRowClient type="versionInfo">
        <Suspense fallback={<ProfileRowFallback />}>
          <VersionInfoValueClient />
        </Suspense>
      </ProfileRowClient>
    </div>
  );
}
