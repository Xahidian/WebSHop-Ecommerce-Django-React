import { test, expect } from '@playwright/test';
import { login, logout } from '../functional/utils/authHelpers';

// Shared hook to reset the DB before each MR
test.describe('MR13–MR17: Metamorphic Tests for E-commerce', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/populate-db');
    await page.click('button:has-text("Clear DB Before Repopulation")');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("Populate DB")');
    await expect(page.locator('text=Database populated successfully')).toBeVisible({ timeout: 10000 });
  });

  test('MR13: User cannot edit another user\'s item', async ({ page }) => {
    await login(page, 'testuser2', 'pass2');
    await page.goto('/');
    const card = page.locator('.max-w-sm:has-text("testuser1")').first();
    await expect(card).toBeVisible();
    const editButton = card.locator('button:has-text("Edit")');
    await expect(editButton).toHaveCount(0);
  });

  test('MR14: Purchase history persists after logout and relogin', async ({ page }) => {
    await login(page, 'testuser2', 'pass2');
    await page.goto('/');
    const addToCartButtons = page.locator('button:has-text("Add to Cart"):not([disabled])');
    await expect(addToCartButtons.first()).toBeVisible({ timeout: 10000 });
    await addToCartButtons.first().click();
    await page.goto('/cart');
    await expect(page.locator('button:has-text("Proceed to Checkout")')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Proceed to Checkout")');
    await expect(page.locator('button:has-text("Pay")')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Pay")');
    await page.waitForURL('/purchased');
    const countBefore = await page.locator('.text-2xl').count();
    expect(countBefore).toBeGreaterThan(0);
    await logout(page);
    await login(page, 'testuser2', 'pass2');
    await page.goto('/purchased');
    const countAfter = await page.locator('.text-2xl').count();
    expect(countAfter).toBeGreaterThanOrEqual(countBefore);
  });

  test('MR15: Non-numeric quantity input should be rejected', async ({ page }) => {
    await login(page, 'testuser3', 'pass3');
    await page.goto('/');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('/cart');
    await page.evaluate(() => {
      const qtySpan = document.querySelector('span.mx-3.text-lg');
      if (qtySpan) qtySpan.textContent = 'abc';
    });
    const totalText = await page.locator('div:has-text("Total") span').last().innerText();
    expect(totalText).not.toMatch(/NaN|abc/);
  });

  test('MR16: Cart is reset after logout and login as another user', async ({ page }) => {
    await login(page, 'testuser1', 'pass1');
    await page.goto('/');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('/cart');
    const cartCountBefore = await page.locator('.text-xl').count();
    expect(cartCountBefore).toBeGreaterThan(0);
    await logout(page);
    await login(page, 'testuser2', 'pass2');
    await page.goto('/cart');
    const cartCountAfter = await page.locator('.text-xl').count();
    expect(cartCountAfter).toBe(0);
  });

  test('MR17: Search result is consistent on repeated queries', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill('populated item 2');
    await page.waitForTimeout(1000);
    const firstCount = await page.locator('.max-w-sm').count();
    await searchInput.fill('');
    await page.waitForTimeout(1000);
    await searchInput.fill('populated item 2');
    await page.waitForTimeout(1000);
    const secondCount = await page.locator('.max-w-sm').count();
    expect(secondCount).toBe(firstCount);
  });
});
