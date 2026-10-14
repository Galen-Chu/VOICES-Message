import { expect, test } from '@playwright/test';

const PATH = '/VOICES-Message/';

test('載入:品牌、標語與 V0 狀態', async ({ page }) => {
  await page.goto(PATH);
  await expect(page).toHaveTitle('VOICES-Message');
  await expect(page.getByText('聲管庫 Voices')).toBeVisible();
  await expect(page.getByText('V0 骨架')).toBeVisible();
  await expect(page.getByText('產品定位')).toBeVisible();
  await expect(page.getByText('資料紅線')).toBeVisible();
});

test('發展路線與家族產品卡', async ({ page }) => {
  await page.goto(PATH);
  // exact:路線標題也出現在狀態卡描述文字裡,非精確匹配會撞 strict mode
  for (const t of ['瀏覽器錄音機', '講稿與 AI(候選)', '音轉影片分發']) {
    await expect(page.getByText(t, { exact: true })).toBeVisible();
  }
  await expect(page.getByText('TEXT-Message 文管庫')).toBeVisible();
  await expect(page.getByText('MEDIA-Message 媒管庫')).toBeVisible();
});
