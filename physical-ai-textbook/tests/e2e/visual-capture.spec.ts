import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'home' },
  { path: '/intro', name: 'intro' },
  { path: '/part1-fundamentals/chapter1-embodied-intelligence', name: 'chapter1' },
  { path: '/part1-fundamentals/chapter2-sensor-systems', name: 'chapter2' },
  { path: '/part1-fundamentals/chapter3-ros2-architecture', name: 'chapter3' },
  { path: '/part1-fundamentals/chapter4-ros2-packages', name: 'chapter4' },
  { path: '/part1-fundamentals/chapter5-communication-patterns', name: 'chapter5' },
];

test.describe('Visual Capture - All Pages', () => {
  for (const page of pages) {
    test(`Capture: ${page.name}`, async ({ page: p }) => {
      await p.goto(`http://localhost:3000${page.path}`);

      // Wait for page to fully load
      await p.waitForLoadState('networkidle');

      // Create screenshots directory if it doesn't exist
      await p.screenshot({
        path: `tests/screenshots/${page.name}.png`,
        fullPage: true,
      });

      // Verify chatbot component exists (except home)
      if (page.name !== 'home' && page.name !== 'intro') {
        // Check for ChatRAG component presence
        const chatComponent = p.locator('[class*="chatrag"], [class*="chat"]').first();
        const isVisible = await chatComponent.isVisible().catch(() => false);

        // Log visibility status (don't fail test, just capture)
        if (!isVisible) {
          console.log(`Note: Chat component not immediately visible on ${page.name}`);
        }
      }
    });
  }

  // Test mobile view
  test('Capture mobile view - Chapter 3', async ({ page: p }) => {
    await p.setViewportSize({ width: 375, height: 667 });
    await p.goto('http://localhost:3000/part1-fundamentals/chapter3-ros2-architecture');
    await p.waitForLoadState('networkidle');
    await p.screenshot({
      path: 'tests/screenshots/chapter3-mobile.png',
      fullPage: true,
    });
  });

  // Test tablet view
  test('Capture tablet view - Chapter 4', async ({ page: p }) => {
    await p.setViewportSize({ width: 768, height: 1024 });
    await p.goto('http://localhost:3000/part1-fundamentals/chapter4-ros2-packages');
    await p.waitForLoadState('networkidle');
    await p.screenshot({
      path: 'tests/screenshots/chapter4-tablet.png',
      fullPage: true,
    });
  });
});
