import { test, expect } from '@playwright/test';

test.describe('ROS 2 Fundamentals Chapters Navigation', () => {
  test('should navigate to Chapter 3: ROS 2 Architecture', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Navigate to Chapter 3
    await page.click('text=Chapter 3: ROS 2 Architecture & Core Concepts');

    // Verify page loaded
    await expect(page).toHaveURL(/.*chapter3-ros2-architecture/);

    // Verify chapter title
    await expect(page.locator('h1')).toContainText('Chapter 3: ROS 2 Architecture');

    // Verify key content sections exist
    await expect(page.locator('text=ROS 2 vs ROS 1')).toBeVisible();
    await expect(page.locator('text=The DDS Foundation')).toBeVisible();
    await expect(page.locator('text=Nodes: The Building Blocks')).toBeVisible();

    // Verify RobotStatus component renders
    await expect(page.locator('text=ROS 2 System')).toBeVisible();

    // Verify ChatPlaceholder component renders
    await expect(page.locator('text=Ask me anything')).toBeVisible();
  });

  test('should navigate to Chapter 4: Building ROS 2 Packages', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Navigate to Chapter 4
    await page.click('text=Chapter 4: Building ROS 2 Packages with Python');

    // Verify page loaded
    await expect(page).toHaveURL(/.*chapter4-ros2-packages/);

    // Verify chapter title
    await expect(page.locator('h1')).toContainText('Chapter 4: Building ROS 2 Packages');

    // Verify key content sections exist
    await expect(page.locator('text=Understanding Package Structure')).toBeVisible();
    await expect(page.locator('text=Creating a Package from Scratch')).toBeVisible();
    await expect(page.locator('text=Creating Custom Messages')).toBeVisible();

    // Verify code examples exist
    await expect(page.locator('code').first()).toBeVisible();

    // Verify RobotStatus component renders
    await expect(page.locator('text=Package Builder')).toBeVisible();
  });

  test('should navigate to Chapter 5: Communication Patterns', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Navigate to Chapter 5
    await page.click('text=Chapter 5: ROS 2 Communication Patterns');

    // Verify page loaded
    await expect(page).toHaveURL(/.*chapter5-communication-patterns/);

    // Verify chapter title
    await expect(page.locator('h1')).toContainText('Chapter 5: ROS 2 Communication Patterns');

    // Verify key content sections exist
    await expect(page.locator('text=Pattern 1: Topics')).toBeVisible();
    await expect(page.locator('text=Pattern 2: Services')).toBeVisible();
    await expect(page.locator('text=Pattern 3: Actions')).toBeVisible();

    // Verify decision tree section
    await expect(page.locator('text=Communication Pattern Decision Tree')).toBeVisible();

    // Verify RobotStatus component renders
    await expect(page.locator('text=Communication Hub')).toBeVisible();
  });

  test('should navigate sequentially through all ROS 2 chapters', async ({ page }) => {
    await page.goto('http://localhost:3000/part1-fundamentals/chapter3-ros2-architecture');

    // Verify we're on Chapter 3
    await expect(page.locator('h1')).toContainText('Chapter 3');

    // Click "Next" to go to Chapter 4
    const nextButton = page.locator('a[class*="pagination-nav__link--next"]').first();
    await nextButton.click();

    // Verify we're on Chapter 4
    await expect(page).toHaveURL(/.*chapter4-ros2-packages/);
    await expect(page.locator('h1')).toContainText('Chapter 4');

    // Click "Next" to go to Chapter 5
    await page.locator('a[class*="pagination-nav__link--next"]').first().click();

    // Verify we're on Chapter 5
    await expect(page).toHaveURL(/.*chapter5-communication-patterns/);
    await expect(page.locator('h1')).toContainText('Chapter 5');
  });

  test('should display code examples with syntax highlighting', async ({ page }) => {
    await page.goto('http://localhost:3000/part1-fundamentals/chapter3-ros2-architecture');

    // Verify code blocks exist
    const codeBlocks = page.locator('pre code');
    await expect(codeBlocks.first()).toBeVisible();

    // Verify syntax highlighting is applied (check for language class)
    const firstCodeBlock = codeBlocks.first();
    const classes = await firstCodeBlock.getAttribute('class');
    expect(classes).toContain('language-');

    // Verify Python code examples exist
    await expect(page.locator('code').filter({ hasText: 'import rclpy' })).toBeVisible();
  });

  test('should render interactive components in all chapters', async ({ page }) => {
    const chapters = [
      'chapter3-ros2-architecture',
      'chapter4-ros2-packages',
      'chapter5-communication-patterns'
    ];

    for (const chapter of chapters) {
      await page.goto(`http://localhost:3000/part1-fundamentals/${chapter}`);

      // Verify RobotStatus component
      const robotStatus = page.locator('[class*="robotStatus"]').or(page.locator('text=/online|offline|simulating/i')).first();
      await expect(robotStatus).toBeVisible();

      // Verify ChatPlaceholder component
      const chatPlaceholder = page.locator('text=/Ask me|Coming Soon/i').first();
      await expect(chatPlaceholder).toBeVisible();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:3000/part1-fundamentals/chapter3-ros2-architecture');

    // Verify h1 exists (main title)
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCount(1); // Only one h1 per page

    // Verify h2 headings exist (sections)
    const h2Elements = page.locator('h2');
    await expect(h2Elements.first()).toBeVisible();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('http://localhost:3000/part1-fundamentals/chapter3-ros2-architecture');

    // Verify page renders
    await expect(page.locator('h1')).toBeVisible();

    // Verify sidebar toggle exists on mobile
    const sidebarToggle = page.locator('button[aria-label*="Navigation bar toggle"]').or(
      page.locator('[class*="navbar__toggle"]')
    ).first();
    await expect(sidebarToggle).toBeVisible();
  });
});
