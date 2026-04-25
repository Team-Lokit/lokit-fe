export const dynamic = 'force-dynamic';

import styles from './page.module.css';
import { PAGE_TITLE } from './constants';
import HeaderClient from '@/app/mypage/policies/HeaderClient/HeaderClient';
import PolicyButtonClient from './PolicyButtonClient/PolicyButtonClient';

export default function PoliciesPage() {
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.srOnly}>{PAGE_TITLE}</h1>
      <HeaderClient />
      <PolicyButtonClient />
    </main>
  );
}
