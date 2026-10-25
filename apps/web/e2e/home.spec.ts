import { ROUTES } from '@/constants';
import { test, expect } from '@playwright/test';

const AUTH_COOKIES = [
  { name: 'dev-accessToken', value: 'mock-token', domain: 'localhost', path: '/' },
  { name: 'dev-coupleStatus', value: 'COUPLED', domain: 'localhost', path: '/' },
];

test.describe('홈', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies(AUTH_COOKIES);
    await page.goto(ROUTES.HOME);
    await expect(page.getByLabel('격자보기')).toBeVisible();
  });

  test.describe('뷰 전환', () => {
    test('지도보기/격자보기 탭 전환', async ({ page }) => {
      await page.getByLabel('격자보기').click();
      await expect(page.getByText('격자보기')).toBeVisible();

      await page.getByLabel('지도보기').click();
      await expect(page.getByText('지도보기')).toBeVisible();
    });

    test('격자뷰에서 사진 상세로 이동 후 뒤로가기 하면 격자뷰가 유지된다', async ({
      page,
    }) => {
      await page.getByLabel('격자보기').click();
      await expect(page).toHaveURL(/viewType=grid/);

      await page.getByRole('button', { name: /사진$/ }).first().click();
      await expect(page).toHaveURL(/\/photo\/\d+/);

      await page.getByLabel('뒤로가기').click();
      await expect(page).toHaveURL(/\/\?.*viewType=grid/);

      await expect(page.getByText('격자보기')).toBeVisible();
      await expect(page.getByText('지도보기')).not.toBeVisible();
    });

    test('격자뷰에서 다른 앨범 상세로 이동해도 격자뷰가 유지된다', async ({ page }) => {
      await page.getByLabel('격자보기').click();
      await expect(page).toHaveURL(/viewType=grid/);

      await page.getByLabel('사이드바 열기').click();
      await page.getByRole('button', { name: /앨범$/ }).nth(1).click();
      await expect(page).toHaveURL(/\/album\/\d+\?.*viewType=grid/);

      await expect(page.getByText('격자보기')).toBeVisible();
      await expect(page.getByText('지도보기')).not.toBeVisible();
    });
  });
});
