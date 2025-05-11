import { test, expect } from '@playwright/test';
import { login } from './utils/authHelpers';

test.describe('FT13: Routing & SPA Navigation', () => {
  const user = { username: 'testuser1', password: 'pass1' };

  test('Public routes work as expected', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/Webshop/i);
    console.log('🏠 / loads successfully');

    await page.goto('/signup');
    await expect(page.locator('h2')).toContainText(/sign up/i);
    console.log('📝 /signup loads');

    await page.goto('/login');
    await expect(page.locator('h2')).toContainText(/sign in/i);
    console.log('🔐 /login loads');
  });

  test('Authenticated routes redirect properly', async ({ page }) => {
    await login(page, user.username, user.password);

    await page.goto('/account');
    await expect(page.locator('h1')).toHaveText(/My Account/i);
    console.log('👤 /account loads');

    await page.goto('/myitems');
    await expect(page.locator('h1')).toContainText(/My Items/i);
    console.log('📦 /myitems loads');
  });
});
