// import { test, expect } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';

import { login } from './utils/authHelpers';

test.describe('FT7: Buyer completes checkout flow successfully', () => {
  const buyer = { username: 'testuser3', password: 'pass3' };

  test('User adds item to cart and completes checkout', async ({ page }) => {
    // ✅ Step 1: Login and load homepage
    await login(page, buyer.username, buyer.password);
    await page.goto('/');
    console.log('✅ Logged in as testuser3');

    // ✅ Step 2: Wait and reload to ensure item cards load
    await page.waitForTimeout(3000);
    await page.reload();
    console.log('🔁 Refreshed homepage');

    // ✅ Step 3: Find Add to Cart button for testuser1 items
    const addToCartButtons = page.locator('.max-w-sm:has-text("testuser1") >> button:has-text("Add to Cart")');
    await expect(addToCartButtons.first()).toBeVisible({ timeout: 15000 });

    const buttonCount = await addToCartButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
    const randomIndex = Math.floor(Math.random() * buttonCount);
    const selectedButton = addToCartButtons.nth(randomIndex);
    await selectedButton.click();
    console.log(`🛒 Added item #${randomIndex + 1} to cart`);

    // ✅ Step 4: Wait and go to cart
    await page.waitForTimeout(4000);
    await page.goto('/cart');
    const cartItems = page.locator('h2.text-xl');
    await expect(cartItems.first()).toBeVisible({ timeout: 10000 });

    const cartCount = await cartItems.count();
    expect(cartCount).toBeGreaterThan(0);
    console.log(`🧾 Cart has ${cartCount} item(s)`);

    // ✅ Step 5: Proceed to checkout
    const proceedButton = page.locator('button:has-text("Proceed to Checkout")');
    await expect(proceedButton).toBeVisible({ timeout: 5000 });
    await proceedButton.click();
    await expect(page).toHaveURL('/checkout');
    console.log('➡️ Navigated to checkout page');

    // ✅ Step 6: Click Pay
    const payButton = page.locator('button:has-text("Pay")');
    await expect(payButton).toBeVisible({ timeout: 5000 });
    await payButton.click();
    console.log('💳 Payment triggered');

    // ✅ Step 7: Confirm purchase success
    await page.waitForURL('/purchased', { timeout: 5000 });
    await expect(page.locator('h1')).toHaveText(/Purchase History/i);
    const purchases = page.locator('.text-2xl');
    await expect(purchases.first()).toBeVisible({ timeout: 5000 });
    const purchaseCount = await purchases.count();
    expect(purchaseCount).toBeGreaterThan(0);
    console.log(`🎉 Purchase successful: ${purchaseCount} item(s) in history`);

    // ✅ Step 8: Screenshot
    await page.screenshot({ path: 'ft7-purchase-complete.png' });
  });
});
