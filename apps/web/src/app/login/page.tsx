import styles from './page.module.css';
import LoginButtonClient from '@/app/login/_clientBoundary/LoginButtonClient/LoginButtonClient';
import LoginTrackerClient from '@/app/login/_clientBoundary/LoginTrackerClient/LoginTrackerClient';
import { PAGE_TITLE } from './constants';
import LoginIntro from './_components/LoginIntro/LoginIntro';
import PolicyNotice from './_components/PolicyNotice/PolicyNotice';

export default function LoginPage() {
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>

      <LoginTrackerClient />
      <LoginIntro />

      <div className={styles.actionSection}>
        <LoginButtonClient />
        <PolicyNotice />
      </div>
    </main>
  );
}
