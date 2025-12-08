import { test, expect } from '@playwright/test';

test.describe('Locale Toggle', () => {
  test('locale dropdown is visible in navbar', async ({ page }) => {
    await page.goto('/');

    // Verify locale dropdown exists in navbar
    const localeDropdown = page.locator('.navbar__item.dropdown');
    await expect(localeDropdown).toBeVisible();
  });

  test('locale dropdown shows English and Urdu options', async ({ page }) => {
    await page.goto('/');

    // Click on locale dropdown trigger (the button with English text)
    const dropdownTrigger = page.locator('.navbar__item.dropdown').getByRole('button', { name: /English/i });
    await dropdownTrigger.click();

    // Verify English option in dropdown menu
    const englishOption = page.locator('.dropdown__menu').getByRole('link', { name: 'English' });
    await expect(englishOption).toBeVisible();

    // Verify Urdu option in dropdown menu
    const urduOption = page.locator('.dropdown__menu').getByText(/اردو/);
    await expect(urduOption).toBeVisible();
  });

  test('selecting Urdu changes URL to /ur/', async ({ page }) => {
    await page.goto('/');

    // Open locale dropdown
    const dropdownTrigger = page.locator('.navbar__item.dropdown').getByRole('button', { name: /English/i });
    await dropdownTrigger.click();

    // Click on Urdu option in dropdown menu
    const urduOption = page.locator('.dropdown__menu').getByText(/اردو/);
    await urduOption.click();

    // Verify URL changed to Urdu locale
    await expect(page).toHaveURL(/.*\/ur\//);
  });

  test('Urdu locale maintains accessibility', async ({ page }) => {
    await page.goto('/ur/');

    // Verify page loaded
    await expect(page).toHaveTitle(/Physical AI/);

    // Verify RTL direction is applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });
});
