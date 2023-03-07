import { test, expect } from '../helpers';

// test('popup page', async ({ page, extensionId }) => {
//   await page.goto(`chrome-extension://${extensionId}/index.html`);
//   await expect(page.locator('body')).toHaveText('my-extension popup');
// });

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
