'use client';

import * as S from './ProfileClient.style';
import { Suspense } from 'react';
import ProfileNameValueClient from '../ProfileNameValueClient/ProfileNameValueClient';
import ConnectedAccountValueClient from '../ConnectedAccountValueClient/ConnectedAccountValueClient';
import VersionInfoValueClient from '../VersionInfoValueClient/VersionInfoValueClient';
import ProfileRowClient from '@/app/mypage/account/_clientBoundary/ProfileRowClient/ProfileRowClient';
import ProfileRowFallback from '@/app/mypage/account/_components/ProfileRowFallback/ProfileRowFallback';

export default function ProfileClient() {
  return (
    <S.Wrapper>
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
    </S.Wrapper>
  );
}
