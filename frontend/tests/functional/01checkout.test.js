import { test, expect } from '@playwright/test';
import { login } from './utils/authHelpers';

test.describe('FT7: Buyer can complete checkout flow', () => {
  const buyer = { username: 'testuser2', password: 'pass2' };

  test.beforeEach(async ({ page }) => {
    await page.goto('/populate-db');
    await page.click('button:has-text("Clear DB Before Repopulation")');
    await page.waitForSelector('text=Database cleared');
    await page.click('button:has-text("Populate DB")');
    await page.waitForSelector('text=Database populated successfully');
  });

  test(
    'Buyer adds seller item to cart and checks out',
    async ({ page }) => {
      // 1️⃣ Login and navigate to homepage
      await login(page, buyer.username, buyer.password);
      await page.goto('/');
      console.log('✅ Logged in and navigated to front page');

      // 2️⃣ Wait for items to load
      let itemCount = await page.locator('.font-bold').count();
      if (itemCount === 0) {
        console.warn('⚠️ No items loaded, refreshing page...');
        await page.reload();
        await page.waitForTimeout(9000);
        await expect(page.locator('.font-bold').first()).toBeVisible({ timeout: 10000 });
        itemCount = await page.locator('.font-bold').count();
      }
      expect(itemCount).toBeGreaterThan(0);
      console.log(`✅ ${itemCount} items loaded`);

      // 3️⃣ Click a valid Add to Cart button
      const addToCartButtons = page.locator('button:has-text("Add to Cart"):not([disabled])');
      await expect(addToCartButtons.first()).toBeVisible({ timeout: 10000 });
      const buttonCount = await addToCartButtons.count();
      expect(buttonCount).toBeGreaterThan(0);
      const randomIndex = Math.floor(Math.random() * buttonCount);
      const randomButton = addToCartButtons.nth(randomIndex);
      await randomButton.click();
      console.log(`🛒 Clicked "Add to Cart" on item #${randomIndex + 1}`);

      // 4️⃣ Go to Cart Page and verify item
      await page.goto('/cart');
      const cartItems = page.locator('.text-xl');
      await expect(cartItems.first()).toBeVisible({ timeout: 15000 });
      const cartCount = await cartItems.count();
      expect(cartCount).toBeGreaterThan(0);
      console.log('🧾 Item successfully appears in cart');

      // 5️⃣ Proceed to Checkout
      const proceedButton = page.locator('button:has-text("Proceed to Checkout")');
      await expect(proceedButton).toBeVisible({ timeout: 5000 });
      await proceedButton.click();
      await expect(page).toHaveURL('/checkout');
      console.log('➡️ Proceeded to checkout');

      // 6️⃣ Complete Purchase
      const payButton = page.locator('button:has-text("Pay")');
      await expect(payButton).toBeVisible();
      await payButton.click();
      console.log('💳 Clicked Pay');

      // 7️⃣ Verify Purchase
      await page.waitForURL('/purchased', { timeout: 5000 });
      await expect(page.locator('h1')).toHaveText(/Purchase History/i);
      await expect(page.locator('.text-2xl').first()).toBeVisible({ timeout: 5000 });
      const purchasedCount = await page.locator('.text-2xl').count();
      expect(purchasedCount).toBeGreaterThan(0);
      console.log('✅ Redirected to Purchase History');
      console.log(`🎉 Purchase completed and ${purchasedCount} item(s) visible in history`);

      // 8️⃣ Take screenshot
      await page.screenshot({ path: 'purchased-page.png' });
    },
    { timeout: 60000 } // Extended timeout for full flow
  );
});
