import { test, expect } from '@playwright/test';
import { login } from './utils/authHelpers';

test.describe('FT14: Change Password in Edit Account', () => {
  const user = {
    username: 'testuser4',
    oldPassword: 'pass4',
    newPassword: 'pass4new'
  };

  test('User changes password and sees success message', async ({ page }) => {
    await login(page, user.username, user.oldPassword);
    await page.goto('/account');
    await expect(page.locator('h1')).toHaveText('My Account');
    console.log('✅ Navigated to Edit Account page');

    await page.fill('input[type="password"]:nth-of-type(1)', user.oldPassword);
    await page.fill('input[type="password"]:nth-of-type(2)', user.newPassword);
    await page.fill('input[type="password"]:nth-of-type(3)', user.newPassword);
    await page.click('button:has-text("Update Password")');
    console.log('🔐 Submitted password change');

    // ✅ Increased timeout to wait for the delayed message
    const allMessages = page.locator('text=Password updated successfully!');
    await expect(allMessages.first()).toBeVisible({ timeout: 50000 });
    console.log('✅ Password update message is visible');
  });
});
