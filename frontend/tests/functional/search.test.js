import { test, expect } from 'playwright-test-coverage';
//import { test, expect } from '@playwright/test';

test.describe('FT10: Search Functionality (Backend-bound)', () => {
  test('User searches for items and sees filtered results', async ({ page }) => {
    await page.goto('/');
    console.log('✅ Navigated to front page');

    const searchTerm = 'populated item 2';

    const searchInput = page.locator('nav input[placeholder="Search..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill(searchTerm);
    console.log(`🔍 Typed: "${searchTerm}"`);

    await page.waitForResponse(resp =>
      resp.url().includes('/api/items/search') && resp.status() === 200
    );
    console.log('🌐 Backend search response received');

    const productCards = page.locator('.max-w-sm');
    const count = await productCards.count();
    console.log(`🔍 ${count} search results returned`);
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const title = await productCards.nth(i).locator('.text-xl').innerText(); // ✅ Only the item title
      console.log(`📦 Found title: "${title}"`);

      expect(title.toLowerCase()).toContain(searchTerm.toLowerCase());
    }

    console.log('✅ All search result titles match the query');
  });
});
