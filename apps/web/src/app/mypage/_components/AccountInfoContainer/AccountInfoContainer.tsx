import AccountInfoClient from './_clientBoundary/AccountInfoClient';
import styles from './AccountInfoContainer.module.css';

export default function AccountInfoContainer() {
  return (
    <section className={styles.wrapper}>
      <AccountInfoClient />
    </section>
  );
}
