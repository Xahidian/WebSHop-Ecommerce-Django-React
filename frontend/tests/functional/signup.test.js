import { test, expect } from '@playwright/test';

test.describe('FT2: User Registration Flow', () => {
  test('Registers a new user and sees confirmation', async ({ page }) => {
    // 1️⃣ Navigate to SignUp page
    await page.goto('/signup');
    console.log('✅ Navigated to /signup');

    // 2️⃣ Fill out the registration form
    const timestamp = Date.now();
    const username = `autouser${timestamp}`;
    const email = `${username}@example.com`;
    const password = 'test1234';

    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    console.log('✍️ Filled signup form');

    // 3️⃣ Submit the form
    await page.click('button[type="submit"]');
    console.log('📨 Submitted signup form');

    // 4️⃣ Confirm success (toast or redirect to login)
    const toast = page.locator('text=Account created successfully');
    await expect(toast).toBeVisible({ timeout: 5000 });
    console.log('✅ Account created toast is visible');

    // 5️⃣ Optionally redirected to login
    await expect(page).toHaveURL('/login', { timeout: 5000 });
    console.log('➡️ Redirected to /login after signup');
  });
});
