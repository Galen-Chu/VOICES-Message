import { expect, test } from '@playwright/test';

const PATH = '/VOICES-Message/';

test('載入:品牌、頁籤與 Dashboard 內容', async ({ page }) => {
  await page.goto(PATH);
  await expect(page).toHaveTitle('VOICES-Message');
  await expect(page.getByText('聲管庫 Voices').first()).toBeVisible();
  // 三頁籤(側欄)
  await expect(page.getByRole('button', { name: '聲管 Dashboard' })).toBeVisible();
  await expect(page.getByRole('button', { name: '編發器 Voices' })).toBeVisible();
  await expect(page.getByRole('button', { name: '錄音記錄 Records' })).toBeVisible();
  // V1 狀態與紅線
  await expect(page.getByText('V1 錄音機')).toBeVisible();
  await expect(page.getByText('產品定位')).toBeVisible();
  await expect(page.getByText('資料紅線')).toBeVisible();
});

test('編發器:頁面與誠實降級(CI 無麥克風權限→錯誤提示不炸)', async ({ page }) => {
  await page.goto(`${PATH}#record`);
  // 頁首標題(側欄頁籤同名,scope 到 main 避免 strict mode 撞雙;2026-11-20 更名,key/hash 仍 #record)
  await expect(page.getByRole('main').getByText('編發器 Voices', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /開始錄音/ }).click();
  // headless 環境 getUserMedia 拒絕→role=alert 錯誤卡(可行動文案)
  await expect(page.getByRole('alert')).toBeVisible();
  // 誠實標示(音檔只存在記憶體)
  await expect(page.getByText(/音檔只存在這個分頁的記憶體/)).toBeVisible();
});

test('錄音記錄:紅線標示與空狀態', async ({ page }) => {
  await page.goto(`${PATH}#records`);
  await expect(page.getByRole('main').getByText('錄音記錄 Records', { exact: true })).toBeVisible();
  await expect(page.getByText('🔒 音檔紅線')).toBeVisible();
  await expect(page.getByText('還沒有錄音記錄')).toBeVisible();
});

test('家族產品卡(Dashboard)', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByText('TEXT-Message 文管庫')).toBeVisible();
  await expect(page.getByText('MEDIA-Message 媒管庫')).toBeVisible();
});

test('側欄家族切換連結(2026-11-20 三方互連):寬窄螢幕皆可按', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole('link', { name: '文管庫 ↗', exact: true })).toHaveAttribute(
    'href',
    'https://galen-chu.github.io/TEXT-Message/',
  );
  await expect(page.getByRole('link', { name: '媒管庫 ↗', exact: true })).toHaveAttribute(
    'href',
    'https://galen-chu.github.io/MEDIA-Message/',
  );
  // ≤720px:識別塊整塊隱藏,連結仍在(只留圖示,名稱改由 title 提供)
  await page.setViewportSize({ width: 640, height: 800 });
  await expect(page.locator('.sidebar-family-link').first()).toBeVisible();
  await expect(page.locator('.sidebar-footer')).toBeHidden();
});
