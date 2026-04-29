import styles from './page.module.css';
import { PAGE_TITLE } from './constants';
import HeaderClient from './_clientBoundary/HeaderClient/HeaderClient';
import PolicyButtonContainer from '@/app/mypage/policies/_components/PolicyButtonContainer/PolicyButtonContainer';

export default function PoliciesPage() {
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>
      <HeaderClient />
      <PolicyButtonContainer />
    </main>
  );
}
