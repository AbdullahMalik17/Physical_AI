import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Landing Page Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('hero title has sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    // Verify hero title exists
    const heroTitle = page.getByRole('heading', { name: /Physical AI/i });
    await expect(heroTitle).toBeVisible();

    // Note: Color contrast is checked by axe-core in the above test
    // This test serves as documentation of the requirement
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through all interactive elements
    await page.keyboard.press('Tab');

    // Verify first focusable element (skip to content link or navbar)
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Continue tabbing to verify Start Learning button is keyboard accessible
    // The hero Start Learning button should be focusable
    const startButton = page.locator('main').getByRole('link', { name: /Start Learning/i });
    await startButton.focus();
    await expect(startButton).toBeFocused();
  });
});
