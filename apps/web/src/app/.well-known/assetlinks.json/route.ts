import { NextResponse } from 'next/server';

const PACKAGE_NAME = 'com.mobileapp';

/**
 * Android App Links 검증 파일.
 * https://lokit.co.kr/.well-known/assetlinks.json
 *
 * Android가 https://lokit.co.kr 링크 탭 시 LOKIT 앱을 직접 열도록
 * autoVerify를 통과시키는 데 필요. SHA-256 지문은 환경변수로 주입.
 *
 * - 디버그 키스토어 지문: `keytool -list -v -keystore ~/.android/debug.keystore`
 *   (기본 비밀번호: android)
 * - 릴리즈/Play 앱 서명 지문: Google Play Console > 앱 무결성 > 앱 서명
 *
 * 콤마로 여러 지문을 등록할 수 있다 (예: 디버그 + 릴리즈 + Play 서명).
 */
const fingerprints = (process.env.ANDROID_APP_SHA256_FINGERPRINTS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export function GET() {
  return NextResponse.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: PACKAGE_NAME,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ]);
}
