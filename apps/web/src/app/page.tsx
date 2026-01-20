'use client';

import Button from '@/components/buttons/button/Button';
import Header from '@/components/header/Header';
import { HEADER_TYPE } from '@/components/header/Header.constants';
import styles from './page.module.css';

export default function Home() {
  return (
    <section className={styles.page}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
        <Header
          type={HEADER_TYPE.EXPLORE}
          title="서울특별시 강남구"
          onClickLeft={() => console.log('프로필')}
          onClickRight={() => console.log('탐험')}
        />
      </div>
      <Button text="버튼" onClick={() => {}} />
    </section>
  );
}
