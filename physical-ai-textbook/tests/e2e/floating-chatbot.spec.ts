import { test, expect } from '@playwright/test';

test.describe('Floating Chatbot Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('floating chatbot button is visible on homepage', async ({ page }) => {
    // Check if the floating chatbot button exists
    const chatButton = page.locator('.floating-chat-button');
    await expect(chatButton).toBeVisible();

    // Verify button has robot emoji
    await expect(chatButton).toContainText('🤖');

    // Check button positioning (fixed bottom-right)
    const buttonStyles = await chatButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        bottom: styles.bottom,
        right: styles.right,
      };
    });

    expect(buttonStyles.position).toBe('fixed');
  });

  test('floating chatbot appears on all pages', async ({ page }) => {
    const pages = ['/', '/intro', '/part1-fundamentals/chapter1-embodied-intelligence'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      const chatButton = page.locator('.floating-chat-button');
      await expect(chatButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('chatbot opens and closes on button click', async ({ page }) => {
    const chatButton = page.locator('.floating-chat-button');
    const chatWindow = page.locator('.floating-chat-window');

    // Initially, chat window should not be visible
    await expect(chatWindow).not.toBeVisible();

    // Click to open
    await chatButton.click();
    await expect(chatWindow).toBeVisible();

    // Verify chat window contains AI Assistant header
    await expect(chatWindow).toContainText('AI Assistant');

    // Click button again to close
    await chatButton.click();
    await expect(chatWindow).not.toBeVisible();
  });

  test('chatbot close button works', async ({ page }) => {
    const chatButton = page.locator('.floating-chat-button');
    const chatWindow = page.locator('.floating-chat-window');

    // Open chatbot
    await chatButton.click();
    await expect(chatWindow).toBeVisible();

    // Find and click the close button in the header
    const closeButton = chatWindow.locator('button[aria-label="Close chat"]');
    await closeButton.click();
    await expect(chatWindow).not.toBeVisible();
  });

  test('chatbot displays message limit counter', async ({ page }) => {
    const chatButton = page.locator('.floating-chat-button');
    await chatButton.click();

    const chatWindow = page.locator('.floating-chat-window');

    // Check for message counter (should show remaining messages)
    const messageCounter = chatWindow.locator('text=/\\d+.*\\/.*\\d+/');
    await expect(messageCounter).toBeVisible({ timeout: 3000 });
  });

  test('chatbot has proper accessibility attributes', async ({ page }) => {
    const chatButton = page.locator('.floating-chat-button');

    // Check aria-label
    const ariaLabel = await chatButton.getAttribute('aria-label');
    expect(ariaLabel).toMatch(/chatbot|chat/i);

    // Open chatbot
    await chatButton.click();

    // Verify input field exists and is accessible
    const input = page.locator('.floating-chat-window input[type="text"]');
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
  });

  test('chatbot input accepts text', async ({ page }) => {
    const chatButton = page.locator('.floating-chat-button');
    await chatButton.click();

    const input = page.locator('.floating-chat-window input[type="text"]');
    const testMessage = 'What is embodied intelligence?';

    await input.fill(testMessage);
    await expect(input).toHaveValue(testMessage);
  });

  test('chatbot has send button', async ({ page }) => {
    const chatButton = page.locator('.floating-chat-button');
    await chatButton.click();

    const sendButton = page.locator('.floating-chat-window button:has-text("Send")');
    await expect(sendButton).toBeVisible();
  });

  test('chatbot is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const chatButton = page.locator('.floating-chat-button');
    await expect(chatButton).toBeVisible();

    // Open chatbot
    await chatButton.click();
    const chatWindow = page.locator('.floating-chat-window');
    await expect(chatWindow).toBeVisible();

    // Verify window adapts to mobile width
    const windowWidth = await chatWindow.evaluate((el) => el.offsetWidth);
    expect(windowWidth).toBeLessThan(400); // Should be responsive
  });

  test('chatbot button has hover effect', async ({ page }) => {
    const chatButton = page.locator('.floating-chat-button');

    // Get initial transform
    const initialTransform = await chatButton.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    // Hover over button
    await chatButton.hover();

    // Wait for animation
    await page.waitForTimeout(500);

    // Check if transform changed (scale effect)
    const hoverTransform = await chatButton.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    // Transform should change on hover (scale effect)
    expect(hoverTransform).not.toBe(initialTransform);
  });

  test('chatbot persists across page navigation', async ({ page }) => {
    // Open chatbot on homepage
    const chatButton = page.locator('.floating-chat-button');
    await chatButton.click();

    let chatWindow = page.locator('.floating-chat-window');
    await expect(chatWindow).toBeVisible();

    // Navigate to another page
    await page.goto('/intro');

    // Chatbot button should still be visible
    await expect(chatButton).toBeVisible();

    // But window should be closed (fresh state)
    chatWindow = page.locator('.floating-chat-window');
    await expect(chatWindow).not.toBeVisible();
  });
});
