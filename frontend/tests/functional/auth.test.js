import { test, expect } from '@playwright/test';
import { login, signup } from './utils/authHelpers';

test.describe('FT2: Signup and Login', () => {
  const uniqueUsername = `user_${Date.now()}`;
  const email = `${uniqueUsername}@shop.com`;
  const password = 'pass123';

  test('Sign up a new user', async ({ page }) => {
    await signup(page, uniqueUsername, email, password);
    await expect(page).toHaveURL('/login');
  });

  test('Log in with signed up user', async ({ page }) => {
    await login(page, uniqueUsername, password);
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Logout')).toBeVisible();
  });
});
