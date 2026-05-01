import styles from './PolicyButtonContainer.module.css';
import ServiceTermsButtonClient from '@/app/mypage/policies/_clientBoundary/ServiceTermsButtonClient/ServiceTermsButtonClient';
import PrivacyPolicyButtonClient from '@/app/mypage/policies/_clientBoundary/PrivacyPolicyButtonClient/PrivacyPolicyButtonClient';

export default function PolicyButtonContainer() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.buttonContainer}>
        <ServiceTermsButtonClient />
        <PrivacyPolicyButtonClient />
      </div>
    </div>
  );
}
