'use client';

import { ExploreHeader } from '@/components/header';

export default function Home() {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      <ExploreHeader
        title="서울특별시 강남구"
        onClickProfile={() => console.log('프로필')}
        onClickExplore={() => console.log('탐험')}
      />
    </div>
  );
}
