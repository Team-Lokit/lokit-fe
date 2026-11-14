import { ROUTES } from '@/constants';
import { COUPLE_STATUS, type CoupleStatus } from '@/constants/coupleStatus';
import { test, expect, type BrowserContext } from '@playwright/test';

const CONNECT_BANNER_TITLE = '함께할 사람과 연결하기';

const loginAs = (context: BrowserContext, coupleStatus: CoupleStatus) =>
  context.addCookies([
    { name: 'dev-accessToken', value: 'mock-token', domain: 'localhost', path: '/' },
    { name: 'dev-coupleStatus', value: coupleStatus, domain: 'localhost', path: '/' },
  ]);

test.describe('온보딩 퍼널 - 커플 연결 없이 서비스 이용', () => {
  const NOT_COUPLED_STATUSES: CoupleStatus[] = [
    COUPLE_STATUS.NOT_COUPLED,
    COUPLE_STATUS.DISCONNECTED_BY_ME,
    COUPLE_STATUS.DISCONNECTED_EXPIRED,
  ];

  for (const coupleStatus of NOT_COUPLED_STATUSES) {
    test(`${coupleStatus} 상태에서도 홈에 접근할 수 있다`, async ({ page, context }) => {
      await loginAs(context, coupleStatus);
      await page.goto(ROUTES.HOME);

      await expect(page).toHaveURL(ROUTES.HOME);
      await expect(page.getByLabel('격자보기')).toBeVisible();
    });
  }

  test('로그인된 사용자가 로그인 페이지에 접근하면 홈으로 이동한다', async ({
    page,
    context,
  }) => {
    await loginAs(context, COUPLE_STATUS.NOT_COUPLED);
    await page.goto(ROUTES.LOGIN);

    await expect(page).toHaveURL(ROUTES.HOME);
  });

  test('없어진 온보딩 시작 페이지에 접근하면 홈으로 이동한다', async ({
    page,
    context,
  }) => {
    await loginAs(context, COUPLE_STATUS.NOT_COUPLED);
    await page.goto(ROUTES.ONBOARDING.START);

    await expect(page).toHaveURL(ROUTES.HOME);
  });
});

test.describe('마이페이지 - 파트너 연결 배너', () => {
  test('미연결 상태에서는 연결 배너가 보이고, 누르면 파트너 연결 페이지로 이동한다', async ({
    page,
    context,
  }) => {
    await loginAs(context, COUPLE_STATUS.NOT_COUPLED);
    await page.goto(ROUTES.MYPAGE);

    const banner = page.getByRole('button', { name: new RegExp(CONNECT_BANNER_TITLE) });
    await expect(banner).toBeVisible();

    await banner.click();
    await expect(page).toHaveURL(ROUTES.ONBOARDING.CONNECT);
  });

  test('상대가 연결을 끊은 상태에서는 연결 배너를 누르면 재연결 페이지로 이동한다', async ({
    page,
    context,
  }) => {
    await loginAs(context, COUPLE_STATUS.DISCONNECTED_BY_PARTNER);
    await page.goto(ROUTES.MYPAGE);

    const banner = page.getByRole('button', { name: new RegExp(CONNECT_BANNER_TITLE) });
    await expect(banner).toBeVisible();

    await banner.click();
    await expect(page).toHaveURL(ROUTES.RECONNECT);
  });

  test('커플 상태에서는 연결 배너가 보이지 않는다', async ({ page, context }) => {
    await loginAs(context, COUPLE_STATUS.COUPLED);
    await page.goto(ROUTES.MYPAGE);

    await expect(page.getByText('계정 정보 관리')).toBeVisible();
    await expect(page.getByText(CONNECT_BANNER_TITLE)).toHaveCount(0);
  });
});
