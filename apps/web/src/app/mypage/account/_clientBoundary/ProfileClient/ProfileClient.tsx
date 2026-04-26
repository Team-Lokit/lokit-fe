import * as S from './ProfileClient.style';
import { Suspense } from 'react';
import ProfileNameClient from '../ProfileNameClient/ProfileNameClient';
import ConnectedAccountClient from '../ConnectedAccountClient/ConnectedAccountClient';
import VersionInfoClient from '../VersionInfoClient/VersionInfoClient';
import ProfileFallback from '../../_components/ProfileFallback/ProfileFallback';

export default function ProfileClient() {
  return (
    <S.Wrapper>
      <Suspense fallback={<ProfileFallback type="profileName" />}>
        <ProfileNameClient />
      </Suspense>
      <Suspense fallback={<ProfileFallback type="connectedAccount" />}>
        <ConnectedAccountClient />
      </Suspense>
      <Suspense fallback={<ProfileFallback type="versionInfo" />}>
        <VersionInfoClient />
      </Suspense>
    </S.Wrapper>
  );
}
