import CustomerSupportClient from './_clientBoundary/CustomerSupportClient';
import styles from './CustomerSupportContainer.module.css';

export default function CustomerSupportContainer() {
  return (
    <section className={styles.wrapper}>
      <CustomerSupportClient />
    </section>
  );
}
