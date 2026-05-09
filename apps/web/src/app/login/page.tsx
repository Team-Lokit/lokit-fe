import styles from './page.module.css';
import PolicyNoticeClient from '@/app/login/_clientBoundary/PolicyNoticeClient/PolicyNoticeClient';
import LoginButtonClient from '@/app/login/_clientBoundary/LoginButtonClient/LoginButtonClient';
import LoginTrackerClient from '@/app/login/_clientBoundary/LoginTrackerClient/LoginTrackerClient';
import LoginIntroClient from '@/app/login/_clientBoundary/LoginIntroClient/LoginIntroClient';
import { PAGE_TITLE } from './constants';

export default function LoginPage() {
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>

      <LoginTrackerClient />
      <LoginIntroClient />

      <div className={styles.actionSection}>
        <LoginButtonClient />
        <PolicyNoticeClient />
      </div>
    </main>
  );
}
