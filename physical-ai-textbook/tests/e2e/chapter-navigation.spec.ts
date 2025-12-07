import { test, expect } from '@playwright/test';

test.describe('Chapter Navigation', () => {
  test('navigate from intro to Chapter 1 and verify components', async ({ page }) => {
    // Start at intro page
    await page.goto('/intro');

    // Verify intro page loaded
    await expect(page).toHaveTitle(/Physical AI/);

    // Find and click link to Chapter 1
    const chapter1Link = page.getByRole('link', { name: /Introduction to Embodied Intelligence|Chapter 1/i });
    await expect(chapter1Link).toBeVisible();
    await chapter1Link.click();

    // Verify navigation to Chapter 1
    await expect(page).toHaveURL(/.*chapter1-embodied-intelligence/);

    // Verify chapter heading
    const chapterHeading = page.getByRole('heading', { name: /Introduction to Embodied Intelligence/i });
    await expect(chapterHeading).toBeVisible();

    // Verify RobotStatus component renders
    const robotStatus = page.getByText(/Robot Alpha|System Status: Online/i);
    await expect(robotStatus).toBeVisible();

    // Verify ChatPlaceholder component renders
    const chatPlaceholder = page.getByText(/Coming Soon/i);
    await expect(chatPlaceholder).toBeVisible();
  });

  test('sidebar navigation highlights active chapter', async ({ page }) => {
    await page.goto('/part1-fundamentals/chapter1-embodied-intelligence');

    // Verify sidebar link is active/highlighted
    const activeLink = page.locator('.menu__link--active');
    await expect(activeLink).toBeVisible();
  });
});
