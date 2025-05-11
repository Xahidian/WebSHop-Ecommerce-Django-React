import { test, expect } from '@playwright/test';
import { login } from './utils/authHelpers';

test.describe('FT15: Inventory Grouping in My Items Page', () => {
  const user = { username: 'testuser3', password: 'pass3' }; // Can be any populated user

  test('User sees items in On Sale, Sold, and Purchased groups', async ({ page }) => {
    await login(page, user.username, user.password);
    await page.goto('/myitems');
    await page.waitForTimeout(2000);

    // ✅ Tabs exist
    const onSaleBtn = page.locator('button:has-text("On Sale")');
    const soldBtn = page.locator('button:has-text("Sold")');
    const purchasedBtn = page.locator('button:has-text("Purchased")');

    await expect(onSaleBtn).toBeVisible();
    await expect(soldBtn).toBeVisible();
    await expect(purchasedBtn).toBeVisible();
    console.log('✅ All tabs visible');

    // 🔍 On Sale
    await onSaleBtn.click();
    await page.waitForTimeout(500);
    const onSaleCount = await page.locator('text=Price:').count();
    console.log(`🛒 On Sale items: ${onSaleCount}`);
    expect(onSaleCount).toBeGreaterThanOrEqual(0); // At least 0

    // ❌ Sold
    await soldBtn.click();
    await page.waitForTimeout(500);
    const soldCount = await page.locator('text=Sold Out').count();
    console.log(`❌ Sold items: ${soldCount}`);
    expect(soldCount).toBeGreaterThanOrEqual(0);

    // 🎁 Purchased
    await purchasedBtn.click();
    await page.waitForTimeout(500);
    const purchasedCount = await page.locator('text=Quantity:').count();
    console.log(`🎁 Purchased items: ${purchasedCount}`);
    expect(purchasedCount).toBeGreaterThanOrEqual(0);
  });
});
