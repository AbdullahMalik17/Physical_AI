import { test, expect } from '@playwright/test';

test.describe('Landing Page Navigation', () => {
  test('homepage loads and navigates to intro on Start Learning click', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Verify page loaded
    await expect(page).toHaveTitle(/Physical AI/);

    // Verify hero section is visible
    const heroTitle = page.getByRole('heading', { name: /Physical AI/i });
    await expect(heroTitle).toBeVisible();

    // Find and click "Start Learning" button
    const startButton = page.getByRole('link', { name: /Start Learning/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // Verify navigation to intro page
    await expect(page).toHaveURL(/.*intro/);

    // Verify intro page content loaded
    const introHeading = page.getByRole('heading', { name: /Welcome|Physical AI/i });
    await expect(introHeading).toBeVisible();
  });

  test('feature grid displays three features', async ({ page }) => {
    await page.goto('/');

    // Verify ROS 2 feature
    const rosFeature = page.getByText(/ROS 2/i);
    await expect(rosFeature).toBeVisible();

    // Verify Isaac Sim feature
    const isacFeature = page.getByText(/Isaac Sim/i);
    await expect(isacFeature).toBeVisible();

    // Verify RAG Chatbot feature
    const chatbotFeature = page.getByText(/RAG Chatbot/i);
    await expect(chatbotFeature).toBeVisible();
  });
});
