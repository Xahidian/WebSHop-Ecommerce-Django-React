import { test, expect } from 'playwright-test-coverage';
//import { test, expect } from '@playwright/test';

test.describe('FT3: Login and Logout Flow', () => {
  const username = 'testuser1';
  const password = 'pass1';

  test('Logs in with valid credentials and logs out successfully', async ({ page }) => {
    // 1️⃣ Navigate to /login
    await page.goto('/login');
    console.log('✅ Navigated to /login');

    // 2️⃣ Fill in credentials
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    console.log('✍️ Filled login credentials');

    // 3️⃣ Submit the login form
    await page.click('button[type="submit"]');
    console.log('📨 Submitted login form');

    // 4️⃣ Wait for the success toast
    const toast = page.locator('text=Logged in successfully');
    await expect(toast).toBeVisible({ timeout: 5000 });
    console.log('✅ Login success toast visible');

    // 5️⃣ Check if username appears in the navbar
    // Using a more specific selector to target: "Hello, testuser1"
    const navText = page.locator(`span:has-text("Hello, ${username}")`);
    await expect(navText).toBeVisible();
    console.log('👤 Username visible in navbar');

    // 6️⃣ Logout
    const logoutButton = page.locator('text=Logout');
    await logoutButton.click();
    console.log('🚪 Clicked logout');

    // 7️⃣ Confirm that login/signup options appear after logout
    const loginOption = page.locator('text=Login');
    const signupOption = page.locator('text=Sign up');
    await expect(loginOption).toBeVisible();
    await expect(signupOption).toBeVisible();
    console.log('✅ Successfully logged out and returned to public state');
  });
});
