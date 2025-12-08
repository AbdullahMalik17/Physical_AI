import { test, expect } from '@playwright/test';

test.describe('Chapter Navigation', () => {
  test('navigate from intro to Chapter 1 and verify components', async ({ page }) => {
    // Start at intro page
    await page.goto('/intro');

    // Verify intro page loaded
    await expect(page).toHaveTitle(/Physical AI/);

    // Find and click link to Chapter 1 from the main content area (not pagination)
    const chapter1Link = page.locator('article').getByRole('link', { name: /Chapter 1|Introduction to Embodied Intelligence/i }).first();
    await expect(chapter1Link).toBeVisible();
    await chapter1Link.click();

    // Verify navigation to Chapter 1
    await expect(page).toHaveURL(/.*chapter1-embodied-intelligence/);

    // Verify chapter heading
    const chapterHeading = page.getByRole('heading', { name: /Introduction to Embodied Intelligence/i, level: 1 });
    await expect(chapterHeading).toBeVisible();

    // Verify RobotStatus component renders
    const robotStatus = page.getByText(/Robot Alpha|System Status: Online/i).first();
    await expect(robotStatus).toBeVisible();

    // Verify ChatPlaceholder component renders
    const chatPlaceholder = page.getByText(/Coming Soon/i).first();
    await expect(chatPlaceholder).toBeVisible();
  });

  test('sidebar navigation highlights active chapter', async ({ page }) => {
    await page.goto('/part1-fundamentals/chapter1-embodied-intelligence');

    // Verify sidebar link is active/highlighted (there may be multiple active links in the hierarchy)
    const activeLink = page.locator('.menu__link--active').first();
    await expect(activeLink).toBeVisible();

    // Verify the specific chapter link in the sidebar has the active class
    const chapter1SidebarLink = page.locator('aside').locator('[aria-current="page"]');
    await expect(chapter1SidebarLink).toBeVisible();
  });
});
