// tests/metamorphic/advanced_mrs.test.js
import { test, expect } from '@playwright/test';
import { login, logout } from '../functional/utils/authHelpers';

test.describe('MR Fault Detection: Metamorphic Tests for E-commerce', () => {
  test.describe.configure({ timeout: 60000 });

  // ✅ Reset DB once before all tests
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    console.log('🔄 Resetting DB before test suite...');
    await page.goto('/populate-db');
    await page.click('button:has-text("Clear DB Before Repopulation")');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("Populate DB")');
    await expect(page.locator('text=Database populated successfully')).toBeVisible({ timeout: 10000 });
    console.log('✅ DB populated');
    await page.close();
  });

  test('MR13: User cannot edit another user\'s item', async ({ page }) => {
    console.log('🔐 MR13 starting: login as testuser2');
    await login(page, 'testuser2', 'pass2');
    await page.goto('/');
    const card = page.locator('.max-w-sm:has-text("testuser1")').first();
    await expect(card).toBeVisible();
    const editButton = card.locator('button:has-text("Edit")');
    await expect(editButton).toHaveCount(0);
    console.log('✅ MR13 passed: Edit button not visible');
  });

  test('MR14: Purchase history persists after logout and relogin', async ({ page }) => {
  console.log('🔐 MR14 starting: login as testuser3');
  await login(page, 'testuser3', 'pass3');
  await page.goto('/');

  // Add item owned by testuser1
  const otherUserCard = page.locator('.max-w-sm:has-text("testuser1")').first();
  await expect(otherUserCard).toBeVisible({ timeout: 10000 });
  const addToCartButton = otherUserCard.locator('button:has-text("Add to Cart")');
  await addToCartButton.click();
  await page.waitForTimeout(500);

  await page.goto('/cart');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Proceed to Checkout")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Pay")');
  await page.waitForURL('/purchased');
  await page.waitForTimeout(1000);

  // ✅ Count purchases immediately after purchase
  const purchaseNow = await page.locator('div:has-text("Total Paid")').count();
  console.log('🧾 Purchases before logout:', purchaseNow);
  expect(purchaseNow).toBeGreaterThan(0);

  // 🔁 Logout and login again
  await logout(page);
  await page.waitForTimeout(500);
  await login(page, 'testuser3', 'pass3');
  await page.goto('/myitems');
  await page.waitForTimeout(500);
  await page.click('button:has-text("🎁 Purchased")');
  await page.waitForTimeout(1000);

  // ✅ Count purchases again after relogin
  const purchaseAfter = await page.locator('div:has-text("Total")').count();
  console.log('🧾 Purchases after relogin (from /myitems):', purchaseAfter);
  expect(purchaseAfter).toBeGreaterThanOrEqual(purchaseNow);
});


  test('MR15: Non-numeric quantity input should be rejected', async ({ page }) => {
    await login(page, 'testuser3', 'pass3');
    await page.goto('/');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForTimeout(500);
    await page.goto('/cart');
    await page.waitForTimeout(500);

    console.log('✏️ Injecting invalid quantity "abc"');
    await page.evaluate(() => {
      const qtySpan = document.querySelector('span.mx-3.text-lg');
      if (qtySpan) qtySpan.textContent = 'abc';
    });

    const totalLocator = page.locator('div.font-bold:has-text("Total") span').last();
    await expect(totalLocator).toBeVisible({ timeout: 10000 });
    const totalText = await totalLocator.innerText();
    console.log('💰 Total after injection:', totalText);
    expect(totalText).not.toMatch(/NaN|abc/);
  });

  // tests/metamorphic/advanced_mrs.test.js (inside describe block)
test('MR16: Multiple items stay in cart after logout when cart is not cleared (human-speed)', async ({ page }) => {
  // Step 1: Login as testuser3
  console.log('🔐 Step 1: Logging in as testuser3');
  await login(page, 'testuser3', 'pass3');
  await page.waitForTimeout(3000);

  // Step 2: Add 4–5 items owned by testuser1 to cart
  console.log('🛒 Step 2: Adding 4–5 items to cart');
  await page.goto('/');
  await page.waitForTimeout(3000);

  const itemCards = page.locator('.max-w-sm:has-text("testuser1")');
  const count = await itemCards.count();
  const addLimit = Math.min(count, 5);

  for (let i = 0; i < addLimit; i++) {
    const card = itemCards.nth(i);
    const addBtn = card.locator('button:has-text("Add to Cart")');
    await addBtn.click();
    console.log(`➕ Added item ${i + 1} to cart`);
    await page.waitForTimeout(1000);
  }

  // Step 3: Go to cart and confirm all items are there
  console.log('🧺 Step 3: Verifying cart has multiple items');
  await page.goto('/cart');
  await page.waitForTimeout(3000);

  const cartBefore = await page.evaluate(() => localStorage.getItem('cart'));
  console.log('📦 Cart before logout:', cartBefore);
  expect(cartBefore).not.toBeNull();

  const itemCountBefore = await page.locator('h2.text-xl').count();
  console.log(`🧮 Cart items before logout: ${itemCountBefore}`);
  expect(itemCountBefore).toBeGreaterThanOrEqual(4);

  // Step 4: Logout
  console.log('🚪 Step 4: Logging out (with fault injected)');
  await logout(page);
  await page.waitForTimeout(3000);

  // Step 5: Refresh
  await page.reload();
  await page.waitForTimeout(3000);

  // Step 6: Login as testuser2
  console.log('🔐 Step 6: Logging in as testuser2');
  await login(page, 'testuser2', 'pass2');
  await page.waitForTimeout(3000);

  // Step 7: Go to cart — check if items remained
  await page.goto('/cart');
  await page.waitForTimeout(3000);

  const cartAfter = await page.evaluate(() => localStorage.getItem('cart'));
  console.log('📦 Cart after relogin:', cartAfter);

  // This should fail if the fault is injected (i.e., cart wasn't cleared)
  expect(cartAfter === null || cartAfter === '[]').toBeTruthy(); // ❌ Will fail if cart persisted

  const itemCountAfter = await page.locator('h2.text-xl').count();
  console.log(`🧮 Cart items after relogin: ${itemCountAfter}`);
  expect(itemCountAfter).toBe(0); // ❌ Fails if items leak across sessions
});



  test('MR17: Search result is consistent on repeated queries', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[placeholder="Search..."]');

    await searchInput.fill('populated item 2');
    await page.waitForTimeout(1000);
    const firstCount = await page.locator('.max-w-sm').count();
    console.log('🔍 First search count:', firstCount);

    await searchInput.fill('');
    await page.waitForTimeout(1000);
    await searchInput.fill('populated item 2');
    await page.waitForTimeout(1000);
    const secondCount = await page.locator('.max-w-sm').count();
    console.log('🔍 Second search count:', secondCount);

    expect(secondCount).toBe(firstCount);
  });
test('MR18: Search is case-insensitive (capital vs small)', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.locator('input[placeholder="Search..."]');

  // First search with capitalized input
  const input1 = 'Populated Item 2';
  await searchInput.fill(input1);
  await page.waitForTimeout(1000);
  const upperCount = await page.locator('.max-w-sm').count();
  console.log(`🔍 MR18 - Search with "${input1}":`, upperCount);

  // Second search with mixed-case variation
  const input2 = 'POPuLATED ITEM 2';
  await searchInput.fill('');
  await page.waitForTimeout(500);
  await searchInput.fill(input2);
  await page.waitForTimeout(1000);
  const lowerCount = await page.locator('.max-w-sm').count();
  console.log(`🔍 MR18 - Search with "${input2}":`, lowerCount);

  expect(lowerCount).toBe(upperCount);
});

});
