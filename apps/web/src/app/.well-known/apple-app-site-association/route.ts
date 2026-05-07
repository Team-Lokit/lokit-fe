import { NextResponse } from 'next/server';

const APP_ID = '2QSV74S93J.com.lokit';

/**
 * iOS Universal Links 검증 파일.
 * https://lokit.co.kr/.well-known/apple-app-site-association
 *
 * iOS가 LOKIT 앱 설치 시 이 파일을 가져와 appIDs를 검증하고,
 * 통과하면 lokit.co.kr 링크 탭 시 앱이 직접 열린다.
 */
export function GET() {
  return NextResponse.json({
    applinks: {
      details: [
        {
          appIDs: [APP_ID],
          components: [{ '/': '/*' }],
        },
      ],
    },
  });
}
