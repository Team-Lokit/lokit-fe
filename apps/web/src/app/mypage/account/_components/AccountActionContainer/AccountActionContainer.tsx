import styles from './AccountActionContainer.module.css';
import LogoutClient from '@/app/mypage/account/_clientBoundary/LogoutClient/LogoutClient';
import SignoutClient from '@/app/mypage/account/_clientBoundary/SignoutClient/SignoutClient';

export default function AccountActionContainer() {
  return (
    <div className={styles.wrapper}>
      <LogoutClient />
      <SignoutClient />
    </div>
  );
}
