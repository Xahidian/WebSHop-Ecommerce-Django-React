import { test, expect } from '@playwright/test';
import { login } from './utils/authHelpers';

test.describe('FT11: Remove from Cart', () => {
  const user = { username: 'testuser5', password: 'pass5' };

  test('User can remove an item from the cart and see empty cart message', async ({ page }) => {

    // ✅ Step 1: Login
    await login(page, user.username, user.password);
    await page.goto('/');
    console.log('✅ Logged in and navigated to front page');

    // ✅ Step 2: Refresh and wait for Add to Cart buttons
    await page.waitForTimeout(3000);
    await page.reload();
    console.log('🔁 Refreshed the page after login');

    const addToCartButtons = page.locator('button:has-text("Add to Cart")');
    await expect(addToCartButtons.first()).toBeVisible({ timeout: 25000 });

    const buttonCount = await addToCartButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // ✅ Step 3: Click Add to Cart and wait for page to update
    const index = Math.floor(Math.random() * buttonCount);
    const selectedButton = addToCartButtons.nth(index);
    await selectedButton.click();
    console.log(`🛒 Added item #${index + 1} to cart`);

    await page.waitForTimeout(4000); // ⏳ wait 2 seconds for state update
    // ✅ Step 4: Go to cart and verify the product is there
    await page.goto('/cart');
    const cartItems = page.locator('.text-xl');
    await expect(cartItems.first()).toBeVisible({ timeout: 10000 });

    const cartCount = await cartItems.count();
    expect(cartCount).toBeGreaterThan(0);
    console.log(`🧾 Found ${cartCount} item(s) in cart`);

    // ✅ Step 5: Wait then click Decrease
    await page.waitForTimeout(2000);
    const decreaseButton = page.locator('button:has-text("-")').first();
    await expect(decreaseButton).toBeVisible({ timeout: 5000 });
    await decreaseButton.click();
    console.log('➖ Clicked decrease button');

    // ✅ Verify empty cart message
    const emptyMessage = page.locator('text=Your cart is empty.');
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });
    console.log('✅ Empty cart message shown after item removed');
  });
});
