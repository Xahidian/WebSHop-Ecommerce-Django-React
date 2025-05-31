// tests/metamorphic/advanced_mrs.test.js
import { test, expect } from '@playwright/test';
import { login, logout } from '../functional/utils/authHelpers';

test.describe('MR Fault Detection: Metamorphic Tests for E-commerce', () => {
  test.describe.configure({ timeout: 60000 });

  //  Reset DB once before all tests
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    console.log(' Resetting DB before test suite...');
    await page.goto('/populate-db');
    await page.click('button:has-text("Clear DB Before Repopulation")');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("Populate DB")');
    await expect(page.locator('text=Database populated successfully')).toBeVisible({ timeout: 10000 });
    console.log(' DB populated');
    await page.close();
  });

 

test('MR1: User cannot edit another user\'s item ', async ({ page }) => {
    console.log(' MR1 starting');

    // 🔹 Seed Input
    console.log(' Seed Input: Login as testuser2 and view testuser1\'s item');
    await login(page, 'testuser2', 'pass2');
    await page.goto('/');
    const seedCard = page.locator('.max-w-sm:has-text("testuser1")').first();
    await expect(seedCard).toBeVisible();

    // Ensure the Edit button is fully rendered
    await page.waitForTimeout(1000);  // Optional: adjust timing as needed
    const editButtonSeed = seedCard.locator('button:has-text("Edit")');
    await page.waitForSelector('button:has-text("Edit")', { timeout: 5000 }).catch(() => {});
    const seedOutput = await editButtonSeed.count();
    console.log(` Seed Output: Edit button count for testuser2 = ${seedOutput}`);

    // 🔹 Transformation (Morphed Input)
   // console.log(' Transformation: Logging out and logging in as testuser3 to view same item');
    await logout(page);
    await page.waitForTimeout(1000);
    await login(page, 'testuser3', 'pass3');
    await page.goto('/');

    // Optional: Print current URL and card HTML for debugging
    const currentURL = page.url();
   //  console.log(` Debug: Current page URL after login as testuser3: ${currentURL}`);

    const morphedCard = page.locator('.max-w-sm:has-text("testuser1")').first();
    await expect(morphedCard).toBeVisible({ timeout: 5000 });

    // Print the HTML of the morphed card for deeper inspection
    const cardHTML = await morphedCard.innerHTML();

    //console.log(` Debug: Morphed Card HTML for testuser3: ${cardHTML}`);

    // Ensure the Edit button is fully rendered
    await page.waitForSelector('button:has-text("Edit")', { timeout: 5000 }).catch(() => {});
    const editButtonMorphed = morphedCard.locator('button:has-text("Edit")');
    const morphedOutput = await editButtonMorphed.count();
    console.log(` Morphed Output: Edit button count for testuser3 = ${morphedOutput}`);

    // 🔹 Updated Relation Check: Both outputs should be 0 (Edit button hidden for non-owners)
    console.log(' Verifying relation: Both outputs should be 0 (Edit button hidden for both users)');
    expect(seedOutput).toBe(0);
    expect(morphedOutput).toBe(0);

    console.log(' MR1 passed: Edit button consistently hidden for both users');
});




test('MR2: Purchase history persists after logout and relogin ', async ({ page }) => {
    console.log(' MR2 starting');

    //  Seed Input: Login as testuser3, purchase an item
    console.log(' Seed Input: Login as testuser3 and purchase item from testuser1');
    await login(page, 'testuser3', 'pass3');
    await page.goto('/');
    const itemCard = page.locator('.max-w-sm:has-text("testuser1")').first();
    await expect(itemCard).toBeVisible({ timeout: 10000 });
    const addToCartButton = itemCard.locator('button:has-text("Add to Cart")');
    await addToCartButton.click();
    await page.waitForTimeout(500);
    await page.goto('/cart');
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Pay")');
    await page.waitForURL('/purchased');
    await page.waitForTimeout(1000);

    //  Seed Output: Count purchases immediately after purchase
    const seedOutput = await page.locator('div:has-text("Total Paid")').count();
    console.log(` Seed Output: Purchase count after checkout = ${seedOutput}`);

    //  Transformation: Log out and log back in as same user (session morph)
    console.log(' Transformation: Logging out and logging in again as testuser3');
    await logout(page);
    await page.waitForTimeout(500);
    await login(page, 'testuser3', 'pass3');
    await page.goto('/myitems');
    await page.click('button:has-text(" Purchased")');
    await page.waitForTimeout(1000);

    //  Morphed Output: Count purchases after relogin
    const morphedOutput = await page.locator('div:has-text("Total")').count();
    console.log(` Morphed Output: Purchase count after relogin = ${morphedOutput}`);

    //  Relation Check: Purchases should persist (outputs must be ≥1 and equal)
    console.log(' Verifying relation: Purchase persisted across session (outputs should be equal)');
    expect(seedOutput).toBeGreaterThan(0);
    expect(morphedOutput).toBe(seedOutput);
    console.log(' MR2 passed: Purchase history persisted after logout and relogin');
});



test('MR3: Item quantity consistency across sequential purchases', async ({ page, request }) => {
    console.log('--- MR3: Item quantity consistency across sequential purchases ---');

    const API_BASE_URL = 'http://127.0.0.1:8000';

    // Reset DB to ensure a clean state
    const resetPage = await page.context().newPage();
    console.log(' Resetting database...');
    await resetPage.goto('/populate-db');
    await resetPage.click('button:has-text("Clear DB Before Repopulation")');
    await resetPage.waitForTimeout(3000);
    await resetPage.click('button:has-text("Populate DB")');
    await expect(resetPage.locator('text=Database populated successfully')).toBeVisible({ timeout: 10000 });
    await resetPage.close();
    console.log(' Database reset and populated.');

    // Helper: Fetch current stock from backend
    const fetchCurrentStock = async (itemId) => {
        const response = await request.get(`${API_BASE_URL}/api/items/${itemId}/latest/`);
        const data = await response.json();
        return data.quantity;
    };

    // 🔹 Seed Input
    console.log('🔹 Seed Input: Logging in and adding item to cart');
    await login(page, 'testuser3', 'pass3');
    await page.goto('/');
    const itemCard = page.locator('.max-w-sm:has-text("testuser1")').first();
    await expect(itemCard).toBeVisible({ timeout: 10000 });

    const itemId = await itemCard.getAttribute('data-item-id');
    const initialStock = await fetchCurrentStock(itemId);
    console.log(`🔹 Seed Input: Initial stock = ${initialStock}`);
    expect(initialStock).toBeGreaterThanOrEqual(10);

    const quantitySeed = 6; // Seed Input: Buy 6 items
    for (let i = 0; i < quantitySeed; i++) {
        const addToCartButton = itemCard.locator('button:has-text("Add to Cart")');
        await addToCartButton.click();
        await page.waitForTimeout(200);
    }
    await page.goto('/cart');

    // 🔹 Seed Output
    console.log(` Seed Output: Purchasing ${quantitySeed} units...`);
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Pay")');
    await page.waitForURL('/purchased');
    await page.waitForTimeout(1000);
    console.log(' Seed Output: First purchase completed successfully.');

    const stockAfterSeed = await fetchCurrentStock(itemId);
    console.log(`🔹 Seed Output: Stock after purchase = ${stockAfterSeed}`);
    if (stockAfterSeed !== initialStock - quantitySeed) {
        console.error(` Unexpected stock after seed: Expected ${initialStock - quantitySeed}, got ${stockAfterSeed}`);
    }
    expect(stockAfterSeed).toBe(initialStock - quantitySeed);

    // Transformation: Attempt to over-purchase
    console.log(' Transformation: Changing input to exceed remaining stock');

    // 🔹 Morphed Input
    console.log(' Morphed Input: Retrying with quantity 10 (exceeds remaining stock)');
    await page.goto('/');
    await expect(itemCard).toBeVisible();
    const quantityMorphed = 10; 
    for (let i = 0; i < quantityMorphed; i++) {
        const addToCartButton = itemCard.locator('button:has-text("Add to Cart")');
        await addToCartButton.click();
        await page.waitForTimeout(200);
    }
    await page.goto('/cart');

    // 🔹 Morphed Output
    console.log(' Morphed Output: Attempting checkout expecting rejection...');
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Pay")');

    //  Relation Check: The morphed output must show an "Only X pieces available" error
    const toastLocator = page.locator('text=/Only.*available/i');
    try {
        await expect(toastLocator).toBeVisible({ timeout: 5000 });
        const errorMessage = await toastLocator.textContent();
        console.log(` Morphed Output: Error message received = "${errorMessage}"`);
        expect(errorMessage).toMatch(/Only.*available/i);
        console.log(' MR3 passed: Item quantity consistency enforced.');
    } catch (error) {
        console.error(' Morphed Output: Expected "Only X pieces available" toast not found.');
        const stockNow = await fetchCurrentStock(itemId);
        console.error(`🔍 Current stock (after morphed attempt) = ${stockNow}`);
        throw new Error(' MR3 failed: No error message on over-purchase; possible concurrency or stock validation fault.');
    }
});












test('MR4: Search is case-insensitive ', async ({ page }) => {
    console.log(' MR4 starting');

    //  Seed Input: Search for an item with a specific casing
    const seedSearch = 'Populated Item 2';
    console.log(` Seed Input: Searching for "${seedSearch}"`);
    await page.goto('/');
    const searchInput = page.locator('input[placeholder="Search..."]');
    await searchInput.fill(seedSearch);
    await page.waitForTimeout(1000);

    //  Seed Output: Count number of search results
    const seedOutput = await page.locator('.max-w-sm').count();
    console.log(` Seed Output: Search result count for "${seedSearch}" = ${seedOutput}`);

    //  Transformation (Morphed Input): Change the casing of the search term
    const morphedSearch = 'POPuLATED ITEM 2';
    console.log(` Morphed Input: Searching for "${morphedSearch}" (case variation)`);
    await searchInput.fill('');
    await page.waitForTimeout(500);
    await searchInput.fill(morphedSearch);
    await page.waitForTimeout(1000);

    //  Morphed Output: Count number of search results with morphed casing
    const morphedOutput = await page.locator('.max-w-sm').count();
    console.log(` Morphed Output: Search result count for "${morphedSearch}" = ${morphedOutput}`);

    //  Relation Check: Result counts should be equal (case-insensitive search)
    console.log(' Verifying relation: Seed Output === Morphed Output (case-insensitive match)');
    expect(morphedOutput).toBe(seedOutput);
    console.log(' MR4 passed: Search results are case-insensitive');
});


});
