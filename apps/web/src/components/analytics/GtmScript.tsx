'use client';

import { useSyncExternalStore } from 'react';
import Script from 'next/script';
import { isAnalyticsEnabled } from '@/lib/analytics/enabled';

const subscribe = () => () => {};
// 서버에서는 렌더하지 않고, 하이드레이션 후 접속 도메인이 프로덕션일 때만 로드한다.
const getServerSnapshot = () => false;

export default function GtmScript() {
  const enabled = useSyncExternalStore(subscribe, isAnalyticsEnabled, getServerSnapshot);
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId || !enabled) return null;

  return (
    <Script
      id="gtm-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');
        `,
      }}
    />
  );
}
