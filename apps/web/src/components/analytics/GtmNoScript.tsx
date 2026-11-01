/**
 * @see https://www.analyticsmania.com/post/google-tag-manager-noscript/ **/

export default function GtmNoScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  // noscript는 서버 렌더라 호스트를 알 수 없어 빌드 env로 판단
  if (!gtmId || process.env.NEXT_PUBLIC_APP_ENV !== 'production') return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height={0}
        width={0}
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
