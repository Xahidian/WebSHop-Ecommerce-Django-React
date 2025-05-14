// import { test, expect } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { login } from './utils/authHelpers';

test.describe('FT4: Add Item as Authenticated User', () => {
  const itemData = {
    title: 'Playwright Test Product',
    description: 'This is a test item added by Playwright.',
    price: '99.90',
  };

  test('User can add a new item and see it in "My Items"', async ({ page }) => {
    // Login with test user
    await login(page, 'testuser1', 'pass1');

    // Navigate to Add Item page
    await page.goto('/add-item');

    // Fill out the form
    await page.fill('input[placeholder="Item Title"]', itemData.title);
    await page.fill('textarea[placeholder="Item Description"]', itemData.description);
    await page.fill('input[placeholder="Item Price"]', itemData.price);

    // Submit the form
    await page.click('button:has-text("Add Item")');

    // Expect redirect to /items
    await page.waitForURL('/items');

    // Navigate to My Items
    await page.goto('/myitems');

    // Check item appears in On Sale tab
    await expect(page.locator(`text=${itemData.title}`)).toBeVisible();
    await expect(page.locator(`text=${itemData.description}`)).toBeVisible();
    await expect(page.locator(`text=$${itemData.price}`)).toBeVisible();
  });
});


test.describe('FT16: Seller edits item price while it is on sale', () => {
  const seller = { username: 'testuser1', password: 'pass1' };
  const newPrice = '199.99';
  let editedTitle;

  test('Seller updates item price and it appears updated on front page', async ({ page }) => {
    // 1️⃣ Login and go to My Items
    await login(page, seller.username, seller.password);
    await page.goto('/myitems');
    await page.waitForTimeout(2000);

    // 2️⃣ Ensure "On Sale" tab is active
    await page.click('button:has-text("On Sale")');
    await page.waitForTimeout(500);

    // 3️⃣ Edit first item
    const card = page.locator('button:has-text("Edit")').first();
    await expect(card).toBeVisible();
    await card.click();

    // Grab the item title for later verification
    const titleEl = page.locator('h3').first();
    editedTitle = await titleEl.innerText();

    const priceInput = page.locator('input[type="number"]').first();
    await priceInput.fill(newPrice);
    await page.click('button:has-text("Save")');
    console.log(`💾 Edited "${editedTitle}" to €${newPrice}`);

    // 4️⃣ Navigate to front page
    await page.goto('/');
    await page.waitForTimeout(2000);

    // 5️⃣ Locate item by title
    const titleLocator = page.locator(`.font-bold:has-text("${editedTitle}")`).first();
await expect(titleLocator).toBeVisible({ timeout: 5000 });

// 🧭 Traverse to card container
const cardContainer = titleLocator.locator('xpath=ancestor::*[contains(@class, "px-6")]');

// 💶 Confirm price is shown inside the card
await expect(cardContainer.locator(`text=€${newPrice}`)).toBeVisible({ timeout: 15000 });

console.log(`✅ Front page reflects updated price: €${newPrice}`);
  });
});
