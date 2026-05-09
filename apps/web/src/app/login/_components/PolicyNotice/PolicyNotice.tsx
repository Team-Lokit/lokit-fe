import { PRIVACY_POLICY_URL, SERVICE_TERMS_URL } from '@/app/login/constants';
import styles from './PolicyNotice.module.css';

export default function PolicyNotice() {
  return (
    <p className={styles.infoText}>
      가입을 진행할 경우, 아래의 정책에 동의한 것으로 간주됩니다.
      <br />
      <a
        className={styles.linkText}
        href={SERVICE_TERMS_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        서비스이용약관
      </a>{' '}
      및{' '}
      <a
        className={styles.linkText}
        href={PRIVACY_POLICY_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        개인정보처리방침
      </a>
    </p>
  );
}
