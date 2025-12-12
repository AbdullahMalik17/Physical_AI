import { test, expect } from '@playwright/test';

test.describe('Part 2: Simulation Chapters', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
  });

  test('Chapter 6: Gazebo Simulation - navigation and content', async ({ page }) => {
    // Navigate to Chapter 6
    await page.goto('/part2-simulation/chapter6-gazebo');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify page title
    await expect(page).toHaveTitle(/Chapter 6.*Gazebo/i);

    // Verify main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Chapter 6: Gazebo Simulation Environment');

    // Verify RobotStatus component
    const robotStatus = page.locator('text=/Gazebo Simulator|simulating/i');
    await expect(robotStatus).toBeVisible();

    // Verify ChatRAG component
    const chatbot = page.locator('textarea[placeholder*="Gazebo"]');
    await expect(chatbot).toBeVisible();

    // Verify key sections exist
    await expect(page.locator('text=/Introduction/i').first()).toBeVisible();
    await expect(page.locator('text=/URDF/i').first()).toBeVisible();
    await expect(page.locator('text=/SDF/i').first()).toBeVisible();
    await expect(page.locator('text=/Sensor Simulation/i').first()).toBeVisible();

    // Verify code blocks exist (at least 8)
    const codeBlocks = page.locator('pre code');
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThanOrEqual(8);

    // Verify further resources section
    await expect(page.locator('text=/Further Resources/i')).toBeVisible();
  });

  test('Chapter 7: Unity - navigation and content', async ({ page }) => {
    // Navigate to Chapter 7
    await page.goto('/part2-simulation/chapter7-unity');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify page title
    await expect(page).toHaveTitle(/Chapter 7.*Unity/i);

    // Verify main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Chapter 7: Unity for Robot Visualization');

    // Verify RobotStatus component
    const robotStatus = page.locator('text=/Unity Renderer|online/i');
    await expect(robotStatus).toBeVisible();

    // Verify ChatRAG component
    const chatbot = page.locator('textarea[placeholder*="Unity"]');
    await expect(chatbot).toBeVisible();

    // Verify key sections exist
    await expect(page.locator('text=/Introduction/i').first()).toBeVisible();
    await expect(page.locator('text=/Unity Robotics Hub/i').first()).toBeVisible();
    await expect(page.locator('text=/ROS.*Connection/i').first()).toBeVisible();
    await expect(page.locator('text=/VR Integration/i').first()).toBeVisible();

    // Verify code blocks exist (at least 8)
    const codeBlocks = page.locator('pre code');
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThanOrEqual(8);

    // Verify further resources section
    await expect(page.locator('text=/Further Resources/i')).toBeVisible();
  });

  test('Sidebar shows Part 2: Simulation category', async ({ page }) => {
    await page.goto('/part2-simulation/chapter6-gazebo');

    // Verify sidebar category
    const sidebar = page.locator('nav');
    await expect(sidebar.locator('text=Part 2: Simulation')).toBeVisible();

    // Verify both chapters in sidebar
    await expect(sidebar.locator('text=/Chapter 6.*Gazebo/i')).toBeVisible();
    await expect(sidebar.locator('text=/Chapter 7.*Unity/i')).toBeVisible();
  });

  test('Navigation between simulation chapters', async ({ page }) => {
    // Start at Chapter 6
    await page.goto('/part2-simulation/chapter6-gazebo');
    await expect(page.locator('h1')).toContainText('Chapter 6');

    // Click next to go to Chapter 7
    const nextButton = page.locator('a:has-text("Next")').or(page.locator('[aria-label="Next page"]'));
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page.locator('h1')).toContainText('Chapter 7');
    }

    // Click previous to go back to Chapter 6
    const prevButton = page.locator('a:has-text("Previous")').or(page.locator('[aria-label="Previous page"]'));
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await expect(page.locator('h1')).toContainText('Chapter 6');
    }
  });

  test('ChatRAG interaction in Chapter 6', async ({ page }) => {
    await page.goto('/part2-simulation/chapter6-gazebo');

    // Find chatbot textarea
    const chatInput = page.locator('textarea[placeholder*="Gazebo"]');
    await expect(chatInput).toBeVisible();

    // Type a test question
    await chatInput.fill('What is URDF?');

    // Find and click send button
    const sendButton = page.locator('button:has-text("Send")').or(page.locator('button[aria-label="Send message"]'));
    if (await sendButton.isVisible()) {
      await sendButton.click();

      // Wait for response (simulated or real)
      await page.waitForTimeout(1000);

      // Verify some response appears (could be simulated or real)
      const chatMessages = page.locator('.chat-message, [class*="message"]');
      const messageCount = await chatMessages.count();
      expect(messageCount).toBeGreaterThan(0);
    }
  });

  test('Responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to Chapter 6
    await page.goto('/part2-simulation/chapter6-gazebo');
    await page.waitForLoadState('networkidle');

    // Verify main content is visible
    await expect(page.locator('h1')).toBeVisible();

    // Verify ChatRAG is visible
    const chatbot = page.locator('textarea[placeholder*="Gazebo"]');
    await expect(chatbot).toBeVisible();
  });

  test('Accessibility - landmarks and ARIA', async ({ page }) => {
    await page.goto('/part2-simulation/chapter6-gazebo');

    // Verify main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify navigation landmark
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Verify heading hierarchy (h1 exists)
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('Search functionality includes simulation chapters', async ({ page }) => {
    await page.goto('/');

    // Find search input (various implementations)
    const searchInput = page.locator('input[type="search"]')
      .or(page.locator('input[placeholder*="Search"]'))
      .or(page.locator('[aria-label="Search"]'));

    if (await searchInput.isVisible()) {
      await searchInput.fill('Gazebo');
      await page.waitForTimeout(500);

      // Verify search results include Chapter 6
      const searchResults = page.locator('[class*="search"]');
      await expect(searchResults.locator('text=/Chapter 6|Gazebo/i')).toBeVisible();
    }
  });

  test('Locale switching maintains navigation', async ({ page }) => {
    await page.goto('/part2-simulation/chapter6-gazebo');

    // Find locale switcher
    const localeSwitcher = page.locator('[class*="locale"], [aria-label*="language"]');

    if (await localeSwitcher.isVisible()) {
      await localeSwitcher.click();

      // Switch to Urdu (if available)
      const urduOption = page.locator('text=/اردو|Urdu/i');
      if (await urduOption.isVisible()) {
        await urduOption.click();

        // Verify we're still on Chapter 6 (Urdu version)
        await expect(page).toHaveURL(/.*part2-simulation\/chapter6-gazebo/);
      }
    }
  });
});
