import Image from 'next/image';

import ScreenImage from '@/assets/images/screen.png';
import styles from './LoginIntro.module.css';

export default function LoginIntro() {
  return (
    <section className={styles.wrapper}>
      <p className={styles.title}>
        <span className={styles.mainText}>둘만의 커플지도</span>를 <br /> 지금 바로
        만들어보세요
      </p>

      <div className={styles.imageWrapper}>
        <Image src={ScreenImage} alt="커플지도 화면 미리보기" priority />
      </div>
    </section>
  );
}
