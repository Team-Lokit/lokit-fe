import { test, expect, type Page } from '@playwright/test';

const getSidebar = (page: Page) => page.getByRole('complementary', { name: '사이드바' });

const AUTH_COOKIES = [
  { name: 'dev-accessToken', value: 'mock-token', domain: 'localhost', path: '/' },
  { name: 'dev-coupleStatus', value: 'COUPLED', domain: 'localhost', path: '/' },
];

test.describe('Sidebar', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies(AUTH_COOKIES);
    await page.goto('/');
    await expect(page.getByLabel('사이드바 열기')).toBeVisible();
  });

  test('≡ 버튼 클릭 시 사이드바 열림', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await expect(getSidebar(page)).toBeVisible();
    await expect(page.getByLabel('사이드바 닫기')).toBeVisible();
  });

  test('✕ 버튼 클릭 시 사이드바 닫힘', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await expect(getSidebar(page)).toBeVisible();

    await page.getByLabel('사이드바 닫기').click();
    await expect(getSidebar(page)).not.toBeVisible();
  });

  test('backdrop 클릭 시 사이드바 닫힘', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    const sidebar = getSidebar(page);
    await expect(sidebar).toBeVisible();

    // 슬라이드 애니메이션 종료 대기
    await sidebar.evaluate((el) =>
      Promise.all(el.getAnimations().map((a) => a.finished)),
    );

    // 사이드바 오른쪽 바깥(backdrop) 클릭
    const box = (await sidebar.boundingBox())!;
    await page.mouse.click(box.x + box.width + 40, box.y + box.height / 2);
    await expect(sidebar).not.toBeVisible();
  });

  test('ESC 키 입력 시 사이드바 닫힘', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await expect(getSidebar(page)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(getSidebar(page)).not.toBeVisible();
  });

  test('검색 필터링 동작', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    const searchInput = page.getByPlaceholder('앨범을 검색해보세요...');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('없는앨범');
    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();

    await searchInput.clear();
    await expect(getSidebar(page).getByText('전체사진')).toBeVisible();
  });

  test('탐색 메뉴 클릭 시 탐색 페이지 이동', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await getSidebar(page).getByText('탐색').click();
    await expect(page).toHaveURL(/\/explore/);
  });

  test('새 앨범 클릭 시 앨범 추가 모달 열림', async ({ page }) => {
    await page.getByLabel('사이드바 열기').click();
    await getSidebar(page).getByText('새 앨범').click();
    // 모달이 열리면 사이드바 위에 표시됨
    await expect(page.getByPlaceholder('앨범명을 입력하세요')).toBeVisible();
  });
});
