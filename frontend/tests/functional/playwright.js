import { test, expect } from '@playwright/test';

test('auto-waits for navigation and heading visibility on playwright.dev', async ({ page }) => {
  // Navigate to the Playwright homepage
  await page.goto('https://playwright.dev');

  // Auto-wait for the 'Get started' link and click it
  await page.getByRole('link', { name: 'Get started' }).click();

  // Auto-wait for the 'Installation' heading to be visible
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  // Optionally, auto-wait for a code block to be visible
  await expect(page.locator('text=npm init playwright@latest')).toBeVisible();
});
