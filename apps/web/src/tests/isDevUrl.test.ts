import { describe, expect, it } from 'vitest';
import { isDevUrl } from '@repo/webview-bridge';

describe('isDevUrl', () => {
  it.each([
    'https://develop.lokit.co.kr',
    'https://develop.lokit.co.kr/onboarding/connect',
    'https://local.lokit.co.kr:3000/',
    'http://localhost:3000?foo=bar',
  ])('개발 환경 URL이면 true: %s', (url) => {
    expect(isDevUrl(url)).toBe(true);
  });

  it.each([
    'https://lokit.co.kr',
    'https://www.lokit.co.kr/onboarding',
    'https://develop.lokit.co.kr.evil.com',
    'https://evil.com/develop.lokit.co.kr',
    'https://localhost.evil.com',
  ])('운영/외부 URL이면 false: %s', (url) => {
    expect(isDevUrl(url)).toBe(false);
  });
});
