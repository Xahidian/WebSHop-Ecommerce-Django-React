import { test, expect } from '@playwright/test';
import { login } from './utils/authHelpers';

test.describe('FT6: Prevent Self-Purchase (Seller cannot buy own item)', () => {
  const seller = { username: 'testuser1', password: 'pass1' };

  const itemData = {
    title: 'FT6 Blocked Purchase',
    description: 'This item is added by seller to test FT6.',
    price: '29.90',
  };

  test('FT6: Seller cannot buy own item (create + verify)', async ({ page }) => {
    // ✅ Setup: Populate DB
    await page.goto('/populate-db');
    await page.click('button:has-text("Clear DB Before Repopulation")');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("Populate DB")');
    await page.waitForTimeout(9000);

    // ✅ Login
    await login(page, seller.username, seller.password);

    const timestamp = Date.now();
    const createdItemTitle = `${itemData.title} ${timestamp}`;

    await test.step('Add item as seller', async () => {
      await page.goto('/add-item');
      await page.fill('input[placeholder="Item Title"]', createdItemTitle);
      await page.fill('textarea[placeholder="Item Description"]', itemData.description);
      await page.fill('input[placeholder="Item Price"]', itemData.price);
      await page.click('button:has-text("Add Item")');
      await page.waitForURL('/items', { timeout: 9000 });
      await expect(page.locator(`text=${createdItemTitle}`)).toBeVisible({ timeout: 9000 });
    });

    await test.step('Verify "Your Item" button is disabled on homepage', async () => {
      await page.goto('/');
      const itemTitle = page.locator(`.font-bold:has-text("${createdItemTitle}")`).first();
      await expect(itemTitle).toBeVisible();
      const itemCard = itemTitle.locator('..').locator('..');
      const yourItemButton = itemCard.locator('button:has-text("Your Item")');
      await expect(yourItemButton).toBeVisible();
      await expect(yourItemButton).toBeDisabled();
    });
  });
});
