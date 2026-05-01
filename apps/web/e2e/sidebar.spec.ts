import { test, expect } from '@playwright/test';

const AUTH_COOKIES = [
  { name: 'dev-accessToken', value: 'mock-token', domain: 'localhost', path: '/' },
  { name: 'dev-coupleStatus', value: 'COUPLED', domain: 'localhost', path: '/' },
];

test.describe('Sidebar', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies(AUTH_COOKIES);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('≡ 버튼 클릭 시 사이드바 열림', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await expect(page.getByLabel('사이드바')).toBeVisible();
    await expect(page.getByLabel('사이드바 닫기')).toBeVisible();
  });

  test('✕ 버튼 클릭 시 사이드바 닫힘', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await expect(page.getByLabel('사이드바')).toBeVisible();

    await page.getByLabel('사이드바 닫기').click();
    await expect(page.getByLabel('사이드바')).not.toBeVisible();
  });

  test('backdrop 클릭 시 사이드바 닫힘', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await expect(page.getByLabel('사이드바')).toBeVisible();

    // 사이드바(270px) 오른쪽 영역 클릭
    await page.mouse.click(500, 400);
    await expect(page.getByLabel('사이드바')).not.toBeVisible();
  });

  test('ESC 키 입력 시 사이드바 닫힘', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await expect(page.getByLabel('사이드바')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByLabel('사이드바')).not.toBeVisible();
  });

  test('검색 필터링 동작', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    const searchInput = page.getByPlaceholder('앨범을 검색해보세요...');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('없는앨범');
    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();

    await searchInput.clear();
    await expect(page.getByText('전체사진')).toBeVisible();
  });

  test('탐색 메뉴 클릭 시 탐색 페이지 이동', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await page.getByText('탐색').click();
    await expect(page).toHaveURL(/\/explore/);
  });

  test('새 앨범 클릭 시 앨범 추가 모달 열림', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await page.getByText('새 앨범').click();
    // 모달이 열리면 사이드바 위에 표시됨
    await expect(page.getByPlaceholder('앨범 이름을 입력하세요')).toBeVisible();
  });
});

test.describe('ViewSwitcher', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies(AUTH_COOKIES);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('지도보기/격자보기 탭 전환', async ({ page }) => {
    const viewSwitcher = page.getByLabel('격자보기');
    await expect(viewSwitcher).toBeVisible();
    await viewSwitcher.click();
    await expect(page.getByText('격자보기')).toBeVisible();

    await page.getByLabel('지도보기').click();
    await expect(page.getByText('지도보기')).toBeVisible();
  });
});
