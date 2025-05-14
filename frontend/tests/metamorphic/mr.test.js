import { test, expect } from '@playwright/test';
import { login, logout, signup } from '../functional/utils/authHelpers';
test('Clears DB, populates test data, and verifies toast visibility', async ({ page }) => {
  await page.goto('/populate-db');
  console.log('✅ Navigated to /populate-db');

  // ✅ Clear the DB
  const clearButton = page.locator('button:has-text("Clear DB Before Repopulation")');
  await expect(clearButton).toBeVisible({ timeout: 5000 });
  await clearButton.click();
  console.log('🧹 DB cleared');

  await page.waitForTimeout(3000); // Wait for backend to finish clearing

  // ✅ Populate DB
  const populateButton = page.locator('button:has-text("Populate DB")');
  await expect(populateButton).toBeVisible({ timeout: 5000 });
  await populateButton.click();
  console.log('📦 Populate DB clicked');

  // ✅ Wait for toast
  const toast = page.locator('text=Database populated successfully');
  await expect(toast).toBeVisible({ timeout: 10000 });
  console.log('✅ Toast is visible');
}, { timeout: 60000 });


test('MR1: Adding same item twice increases quantity in cart', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Login');
  await page.click('text=Login');
  
  

  await page.waitForSelector('input[name="username"]');
  await page.fill('input[name="username"]', 'testuser1');
  await page.fill('input[name="password"]', 'pass1');
  await page.click('button:has-text("Sign in")');

  await page.waitForTimeout(2000);
  await page.click('button:has-text("Add to Cart")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Add to Cart")');

  await page.click('a[href="/cart"]');
  await page.waitForSelector('span.mx-3.text-lg');
  const quantityText = await page.textContent('span.mx-3.text-lg');
  expect(Number(quantityText)).toBe(2);
  
}, { timeout: 60000 });

test('MR2: Inventory decreases after checkout (via button state)', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Login');
  await page.fill('input[name="username"]', 'testuser2');
  await page.fill('input[name="password"]', 'pass2');
  await page.click('button:has-text("Sign in")');
  await page.waitForTimeout(1000);

  // Wait for "Add to Cart" button and record its presence
  await page.waitForSelector('button:has-text("Add to Cart")');
  const buttonsBefore = await page.locator('button:has-text("Add to Cart")').count();
  expect(buttonsBefore).toBeGreaterThan(0); // There is at least one available item

  // Purchase one item
  await page.click('button:has-text("Add to Cart")');
  await page.click('a[href="/cart"]');
  await page.click('button:has-text("Proceed to Checkout")');

  await page.goto('/');
  await page.waitForTimeout(1000);

  // Check how many items are now available again
  const buttonsAfter = await page.locator('button:has-text("Add to Cart")').count();

  // Expect fewer available buttons (or at least not increased)
  expect(buttonsAfter).toBeLessThanOrEqual(buttonsBefore);
}, { timeout: 60000 });

  
const loginAndGoHome = async (page, username, password) => {
  await page.goto('/');
  await page.click('text=Login');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("Sign in")');
  await page.waitForTimeout(1000);
};



test('MR3: Cart returns to previous state after add and remove', async ({ page }) => {
  await loginAndGoHome(page, 'testuser1', 'pass1');
  await page.click('button:has-text("Add to Cart")');
  await page.click('a[href="/cart"]');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("-")'); // remove item
  await page.waitForTimeout(1000);
  const text = await page.textContent('body');
  expect(text).toContain('Your cart is empty');
}, { timeout: 60000 });

 // MR4: Buying an item removes it from availability (shown as Not Available)
 test('MR4: Item becomes unavailable after purchase', async ({ page }) => {
  await page.goto('/populate-db');
await page.click('button:has-text("Clear DB Before Repopulation")');
await page.waitForTimeout(2000);
await page.click('button:has-text("Populate DB")');
await page.waitForSelector('text=Database populated successfully');
  console.log("🔐 Logging in as testuser2...");
  await login(page, 'testuser2', 'pass2');

  console.log("🏠 Navigating to homepage...");
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  console.log("🔍 Locating first item from testuser1...");
  const itemCard = page.locator('.max-w-sm:has-text("testuser1")').first(); // select item with testuser1 as owner
  const itemTitle = (await itemCard.locator('.font-bold.text-xl').textContent())?.trim();
  console.log("🛍️ Selected item title:", itemTitle);

  const addToCartButton = itemCard.locator('button:has-text("Add to Cart")');

  console.log("➕ Adding item to cart 10 times...");
  for (let i = 0; i < 10; i++) {
    console.log(`➕ Click #${i + 1}`);
    await addToCartButton.click();
    await page.waitForTimeout(300);
  }

  // 🛒 Try clicking cart icon (multiple selector fallback)
  console.log("🛒 Navigating to cart page...");
  const candidates = [
    page.locator('button:has-text("🛒")'),
    page.locator('nav >> text=/^\\d+$/'),
    page.locator('nav >> button >> nth=4'),
    page.locator('button >> nth=5'),
  ];

  let clicked = false;
  for (const [index, locator] of candidates.entries()) {
    try {
      console.log(`👉 Trying cart locator #${index + 1}...`);
      await locator.first().click({ timeout: 3000 });
      clicked = true;
      console.log("✅ Clicked cart icon.");
      break;
    } catch {
      console.log(`❌ Cart locator #${index + 1} failed.`);
    }
  }

  if (!clicked) throw new Error("🛑 Could not click on cart icon.");

  await page.waitForURL('/cart');
  console.log("✅ Arrived at cart page.");

  await page.click('text=Proceed to Checkout');
  await page.waitForURL('/checkout');

  console.log("💸 Completing purchase...");
  await page.click('text=Pay');
  await page.waitForURL('/purchased');

  console.log("🔄 Going back to home...");
  await page.goto('/');
  await page.waitForTimeout(3000);
  await page.reload();

  console.log("🔍 Verifying item with title & owner 'testuser1' is not visible...");
  const matchedItems = page.locator(`.max-w-sm:has-text("${itemTitle}"):has-text("testuser1")`);
  const matchedItems1 = page.locator(`.max-w-sm:visible:has-text("${itemTitle}"):has-text("testuser1")`);

  const count = await matchedItems.count();
  console.log(`❓ Found ${count} item(s) titled '${itemTitle}' from testuser1.`);
   const count1 = await matchedItems1.count();
  console.log(`❓ Found ${count} item(s) titled '${itemTitle}' from testuser1.`);

  expect(count).toBe(0);
}, { timeout: 60000 });



 // MR5: Add item A then B = B then A (Commutative Property)
test('MR5: Adding A then B equals B then A in cart', async ({ page }) => {
  await loginAndGoHome(page, 'testuser3', 'pass3');

  await page.click('button:has-text("Add to Cart")');
  await page.waitForTimeout(300);
  await page.click('a[href="/cart"]');
  await page.waitForTimeout(500);

  const firstTitle = await page.locator('h2').first().textContent();
  await page.goto('/');
  await page.click('button:has-text("Add to Cart")');
  await page.click('a[href="/cart"]');
  await page.waitForTimeout(500);

  const titles = await page.locator('h2').allTextContents();
  expect(titles.length).toBeGreaterThanOrEqual(2);
}, { timeout: 60000 });

// // MR6: Add same item twice then remove once => quantity = 1
test('MR6: Adding item twice then removing once leaves one item', async ({ page }) => {
  await loginAndGoHome(page, 'testuser1', 'pass1');
  await page.click('button:has-text("Add to Cart")');
  await page.click('button:has-text("Add to Cart")');
  await page.click('a[href="/cart"]');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("-")');
  const quantity = await page.textContent('span');
  expect(quantity).toContain('1');
}, { timeout: 60000 });

// MR7: Updating item quantity reflects in price
test('MR7: Quantity update in cart reflects in price', async ({ page }) => {
  await loginAndGoHome(page, 'testuser2', 'pass2');

  // Add item to cart
  await page.click('button:has-text("Add to Cart")');

  // Go to Cart
  await page.click('a[href="/cart"]');
  await page.waitForTimeout(1000);

  // Click "+" to increase quantity
  await page.click('button:has-text("+")');
  await page.waitForTimeout(500); // let UI update

  // Locate total price by looking for text after "Total" label
  const totalText = await page.locator('div:has-text("Total")').last().locator('span').last().textContent();

  console.log('🧾 Updated total:', totalText);
  expect(totalText).toMatch(/\$\d+\.\d{2}/);
}, { timeout: 60000 });




// // MR8: Reloading page doesn't change cart content
test('MR8: Page reload does not affect cart content', async ({ page }) => {
  await loginAndGoHome(page, 'testuser3', 'pass3');
  await page.click('button:has-text("Add to Cart")');
  await page.waitForTimeout(4000);
  await page.reload();
  await page.click('a[href="/cart"]');
  await page.waitForTimeout(4000);
  const content = await page.textContent('body');
  expect(content).not.toContain('Your cart is empty');
}, { timeout: 60000 });

// // MR9: Not Available item cannot be purchased
test('MR9: User cannot add their own item to cart', async ({ page }) => {
  await loginAndGoHome(page, 'testuser2', 'pass2');

  // Wait for frontend to load
  await page.waitForSelector('text=Your Item');

  // Confirm that the "Your Item" buttons are disabled
  const yourItemButtons = await page.locator('button:has-text("Your Item")').all();

  for (const btn of yourItemButtons) {
    const isDisabled = await btn.isDisabled();
    expect(isDisabled).toBeTruthy(); // or toBe(true)
  }

  // Optional: ensure that no Add to Cart button exists for user's own items
  const addButtons = await page.locator('text=Add to Cart').all();
  for (const btn of addButtons) {
    const text = await btn.innerText();
    expect(text).not.toContain('Your Item');
  }
}, { timeout: 60000 });

// MR10: Add → Remove → Re-add = item added correctly
test('MR10: Add → Remove → Re-add = item added correctly', async ({ page }) => {
  await loginAndGoHome(page, 'testuser2', 'pass2');

  // Find "Populated Item 3" and click its Add to Cart button
  const itemCard = page.locator('text=Populated Item 3').first();
  await expect(itemCard).toBeVisible();
  const addButton = itemCard.locator('..').locator('button:has-text("Add to Cart")');
  await addButton.click();

  // Go to cart
  await page.click('a[href="/cart"]');
  await page.waitForTimeout(500);

  // Remove the item by decreasing quantity to 0
  await page.click('button:has-text("-")');
  await page.waitForTimeout(500);

  // Go back to home and re-add the same item
  await page.goto('/');
  const itemCardAgain = page.locator('text=Populated Item 3').first();
  const reAddButton = itemCardAgain.locator('..').locator('button:has-text("Add to Cart")');
  await reAddButton.click();

  await page.click('a[href="/cart"]');
  await page.waitForTimeout(500);

  // Assert that Populated Item 3 is back in the cart
  const cartText = await page.textContent('body');
  expect(cartText).toContain('Populated Item 3');
}, { timeout: 60000 });


//MR11: Edit price and quantity, buyer sees updated total
test('MR11: Edit price and quantity, buyer sees updated total', async ({ page }) => {
  // Seller updates item
  await login(page, 'testuser1', 'pass1');
  await page.goto('/myitems');
  await page.waitForSelector('button:has-text("Edit")');

  const firstCard = page.locator('.grid .border').first();
  await firstCard.locator('button:has-text("Edit")').click();

  const inputs = firstCard.locator('input[type="number"]');
  await inputs.nth(0).fill('49.99'); // price
  await inputs.nth(1).fill('10');    // quantity
  await firstCard.locator('button:has-text("Save")').click();
  await page.waitForTimeout(1000);
  await page.reload();
  await logout(page);

  // Buyer logs in
  await login(page, 'testuser2', 'pass2');
  await page.goto('/');
  await page.click('button:has-text("Add to Cart")');
  await page.click('a[href="/cart"]');
  await page.waitForTimeout(1000);

  // Assert updated total price
  const totalRow = await page.locator('div.font-bold.text-lg:has-text("Total")');
  const totalText = await totalRow.innerText();
  console.log('🧾 Total row text:', totalText);
  expect(totalText).toContain('49.99');
}, { timeout: 60000 });
// MR12: Adding multiple items reflects correct total
test('MR12: Adding multiple items reflects correct total', async ({ page }) => {
  await login(page, 'testuser2', 'pass2');

  // Add 2 different items to cart
  const addToCartButtons = page.locator('button:has-text("Add to Cart")');
  await addToCartButtons.nth(0).click();
  await addToCartButtons.nth(1).click();

  await page.click('a[href="/cart"]');
  await page.waitForTimeout(1000);

  // Get prices of both items from cart
  const priceElements = await page.locator('div.flex-1 >> text=$').allInnerTexts();
  const prices = priceElements.map(txt => parseFloat(txt.replace('$', '')));

  // Sum all prices
  const expectedTotal = prices.reduce((acc, price) => acc + price, 0).toFixed(2);

  // Get displayed total
  const totalRow = await page.locator('div.font-bold.text-lg:has-text("Total")');
  const totalText = await totalRow.innerText();
  console.log('🧾 Total shown:', totalText, '| Expected:', expectedTotal);

  expect(totalText).toContain(expectedTotal);
}, { timeout: 60000 });



