'use client';

import { Suspense } from 'react';
import { NotificationResponseType } from '@repo/api-client';
import NotificationSettingRowClient from './_clientBoundary/NotificationSettingRowClient/NotificationSettingRowClient';
import NotificationSettingsFallback from '@/app/mypage/notification/_components/NotificationSettingsFallback/NotificationSettingsFallback';
import styles from './NotificationSettingsContainer.module.css';

const NOTIFICATION_ROWS: {
  title: string;
  description: string;
  types: NotificationResponseType[];
}[] = [
  {
    title: '댓글 및 반응',
    description: '상대방이 반응을 남기면 알려드려요.',
    types: [NotificationResponseType.COMMENT, NotificationResponseType.REACTION],
  },
  {
    title: '새로운 추억',
    description: '상대방이 새 사진을 올리면 알려드려요.',
    types: [NotificationResponseType.UPLOAD],
  },
];

export default function NotificationSettingsContainer() {
  return (
    <section className={styles.wrapper}>
      <Suspense fallback={<NotificationSettingsFallback />}>
        {NOTIFICATION_ROWS.map(({ title, description, types }) => (
          <NotificationSettingRowClient
            key={title}
            title={title}
            description={description}
            types={types}
          />
        ))}
      </Suspense>
    </section>
  );
}
