//import { test, expect } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { login } from './utils/authHelpers';
test.describe('FT1: User Prospectrive', () => {

  // Populate DB
  test('Clears DB, populates test data, and verifies user/item visibility', async ({ page }) => {
    await page.goto('/populate-db');
    console.log('✅ Navigated to /populate-db');

    // ✅ Clear the DB
    await page.click('button:has-text("Clear DB Before Repopulation")');
    console.log('🧹 DB cleared');
// 🔄 Add a short pause to let backend finish clearing
await page.waitForTimeout(3000); // 3 second pause (adjust if needed)

    // ✅ Populate DB
    await page.click('button:has-text("Populate DB")');
    console.log('📦 Populate DB clicked');

    // ✅ Wait for toast with exact message
    const toast = page.locator('text=Database populated successfully');
    await expect(toast).toBeVisible({ timeout: 15000 });
    console.log('✅ Toast is visible');

    // ✅ Show Users
    await page.click('button:has-text("Show Users")');
    const userTableRow = page.locator('table td:text("testuser1")').first(); // more precise
    await expect(userTableRow).toBeVisible({ timeout: 15000 });
    const allUsers = await page.locator('table tr >> td:nth-child(1):has-text("testuser")').count();
    expect(allUsers).toBeGreaterThanOrEqual(6);
    console.log(`👤 Verified ${allUsers} test users`);

    // ✅ Show Items
    await page.click('button:has-text("Show Items")');
    const itemCells = page.locator('table td:has-text("Populated Item")');
await expect(itemCells.first()).toBeVisible({ timeout: 15000 });
const itemCount = await itemCells.count();
expect(itemCount).toBeGreaterThanOrEqual(30);
console.log(`📦 Verified ${itemCount} test items`);
  });
});



