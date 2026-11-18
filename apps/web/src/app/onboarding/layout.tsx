import OnboardingLayoutClient from './OnboardingLayoutClient';
import { OnboardingProvider } from './_contexts/OnboardingContext';

// TODO(#103): 파트너 연결 페이지가 /onboarding 밖으로 옮겨지면 OnboardingProvider와 함께 제거한다.
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <OnboardingLayoutClient>{children}</OnboardingLayoutClient>
    </OnboardingProvider>
  );
}
