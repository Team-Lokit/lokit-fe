import type { Metadata } from 'next';
import { AppProviders } from './providers';
import { pretendard } from '@/theme/font';
import EmotionRegistry from './emotion-registry';
import LayoutClient from '@/components/layout/Layout.client';
import Script from 'next/script';
import GtmScript from '@/components/analytics/GtmScript';
import GtmNoScript from '@/components/analytics/GtmNoScript';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://develop.lokit.co.kr',
  ),
  title: '우리만의 이야기를, 지도에 Lokit.',
  description: '함께 기록하고, 함께 쌓아가는 커플 아카이빙 앱.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '우리만의 이야기를, 지도에 Lokit.',
    description: '함께 기록하고, 함께 쌓아가는 커플 아카이빙 앱.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lokit - 커플 아카이빙 앱',
      },
    ],
  },
};

const enableMocking = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true';

// 첫 API 요청 전에 API 서버와 TCP/TLS 핸드셰이크를 미리 맺어둔다.
// API 호출이 credentials: 'include'라 같은 커넥션 풀을 쓰도록 use-credentials로 맞춘다.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiOrigin = apiBaseUrl?.startsWith('http') ? new URL(apiBaseUrl).origin : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const beusableId = process.env.NEXT_PUBLIC_BEUSABLE_ID;

  return (
    <html lang="ko">
      <head>
        {apiOrigin && (
          <link rel="preconnect" href={apiOrigin} crossOrigin="use-credentials" />
        )}
        <GtmScript />
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={pretendard.variable}>
        <GtmNoScript />
        <AppProviders enableMocking={enableMocking}>
          <EmotionRegistry>
            <LayoutClient>{children}</LayoutClient>
          </EmotionRegistry>
        </AppProviders>
        <div id="modal-root" />
        <div id="toast-root" />
        {beusableId && (
          <Script
            id="beusable-rum"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w, d, a){
                  w.beusablerumclient = {
                      load : function(src){
                          var b = d.createElement("script");
                          b.src = src; b.async=true; b.type = "text/javascript";
                          d.getElementsByTagName("head")[0].appendChild(b);
                      }
                  };
                  w.beusablerumclient.load(a + "?url=" + encodeURIComponent(d.URL));
                })(window, document, "//rum.beusable.net/load/${beusableId}");
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
