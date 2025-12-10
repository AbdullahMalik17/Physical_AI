import { test, expect } from '@playwright/test';

test.describe('Content Improvements - Vocabulary Enhancement', () => {
  test.describe('Intro Page Improvements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/intro');
    });

    test('intro page contains enhanced professional vocabulary', async ({ page }) => {
      // Check for sophisticated terminology
      const content = await page.textContent('main');

      // Verify enhanced vocabulary is present
      expect(content).toContain('comprehensive, interactive learning ecosystem');
      expect(content).toContain('sophisticated journey');
      expect(content).toContain('seamlessly transition');
    });

    test('sim-to-real section has enhanced terminology', async ({ page }) => {
      const content = await page.textContent('main');

      // Check for improved Sim-to-Real section
      expect(content).toContain('Sim-to-Real');
      expect(content).toContain('methodology');
      expect(content).toContain('cornerstone');
      expect(content).toContain('contemporary robotics development');
    });

    test('enhanced pillar descriptions are present', async ({ page }) => {
      const content = await page.textContent('main');

      // ROS 2 enhancement
      expect(content).toContain('middleware framework');
      expect(content).toContain('enterprise-grade');
      expect(content).toContain('orchestrate');

      // Isaac Sim enhancement
      expect(content).toContain('state-of-the-art');
      expect(content).toContain('GPU-accelerated');
      expect(content).toContain('photorealistic simulation');
      expect(content).toContain('physics-accurate');

      // AI-Enhanced Learning
      expect(content).toContain('cutting-edge AI methodologies');
      expect(content).toContain('Retrieval-Augmented Generation');
    });

    test('learning trajectory section has professional vocabulary', async ({ page }) => {
      const content = await page.textContent('main');

      expect(content).toContain('Structured Learning Trajectory');
      expect(content).toContain('carefully architected');
      expect(content).toContain('progressive curriculum');
    });

    test('part descriptions use enhanced terminology', async ({ page }) => {
      const content = await page.textContent('main');

      // Part 1
      expect(content).toContain('Foundational Principles');
      expect(content).toContain('rigorous foundation');
      expect(content).toContain('sensorimotor integration');

      // Part 2
      expect(content).toContain('Simulation Mastery');
      expect(content).toContain('virtual environment engineering');
      expect(content).toContain('physics-based modeling');

      // Part 3
      expect(content).toContain('Real-World Deployment');
      expect(content).toContain('simulation-reality divide');
    });

    test('call-to-action has engaging vocabulary', async ({ page }) => {
      const content = await page.textContent('main');

      expect(content).toContain('transformative journey');
      expect(content).toContain('immerse yourself');
      expect(content).toContain('captivating domain');
      expect(content).toContain('intelligent autonomous systems');
    });
  });

  test.describe('Chapter 1 Improvements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/part1-fundamentals/chapter1-embodied-intelligence');
    });

    test('chapter 1 has enhanced introduction', async ({ page }) => {
      const content = await page.textContent('main');

      expect(content).toContain('Physical AI odyssey');
      expect(content).toContain('comprehensive exploration');
      expect(content).toContain('sophisticated concept');
      expect(content).toContain('fundamentally distinct challenges');
    });

    test('theoretical framework section uses professional terminology', async ({ page }) => {
      const content = await page.textContent('main');

      expect(content).toContain('Theoretical Framework');
      expect(content).toContain('AI architectures');
      expect(content).toContain('corporeal medium');
      expect(content).toContain('computational agents');
    });

    test('characteristics section has sophisticated descriptions', async ({ page }) => {
      const content = await page.textContent('main');

      // Physical Instantiation
      expect(content).toContain('Physical Instantiation');
      expect(content).toContain('tangible physical substrate');
      expect(content).toContain('volumetric space');
      expect(content).toContain('inertial properties');

      // Sensorimotor Coupling
      expect(content).toContain('Sensorimotor Coupling');
      expect(content).toContain('multimodal sensory arrays');
      expect(content).toContain('electromechanical actuators');

      // Physics Compliance
      expect(content).toContain('Physics Compliance');
      expect(content).toContain('immutable physical laws');
      expect(content).toContain('frictional coefficients');
      expect(content).toContain('energy dissipation');

      // Temporal-Causal Dynamics
      expect(content).toContain('Temporal-Causal Dynamics');
      expect(content).toContain('finite time intervals');
      expect(content).toContain('predictive modeling');
      expect(content).toContain('adaptive control');
    });

    test('comparison table has enhanced terminology', async ({ page }) => {
      const content = await page.textContent('main');

      // Check for improved table headers
      expect(content).toContain('Comparative Analysis');
      expect(content).toContain('Disembodied AI Agents');
      expect(content).toContain('Embodied Robotic Systems');

      // Check for sophisticated row labels
      expect(content).toContain('Operating Environment');
      expect(content).toContain('Feedback Latency');
      expect(content).toContain('Failure Consequences');
      expect(content).toContain('State Representation');
    });

    test('transition text uses professional vocabulary', async ({ page }) => {
      const content = await page.textContent('main');

      expect(content).toContain('computational abstraction');
      expect(content).toContain('physical instantiation');
      expect(content).toContain('Sim-to-Real transfer learning');
      expect(content).toContain('systematic techniques');
      expect(content).toContain('effectively navigate');
    });
  });

  test.describe('Overall Content Quality', () => {
    test('all main pages load without errors', async ({ page }) => {
      const pages = [
        '/',
        '/intro',
        '/part1-fundamentals/chapter1-embodied-intelligence',
      ];

      for (const pagePath of pages) {
        const response = await page.goto(pagePath);
        expect(response?.status()).toBe(200);

        // Verify main content is present
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
      }
    });

    test('headings hierarchy is correct on intro page', async ({ page }) => {
      await page.goto('/intro');

      // Check h1 exists
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('Physical AI');

      // Check h2 headings exist
      const h2Headings = page.locator('h2');
      const h2Count = await h2Headings.count();
      expect(h2Count).toBeGreaterThan(0);
    });

    test('no broken links in improved content', async ({ page }) => {
      await page.goto('/intro');

      // Find the link to Chapter 1
      const chapterLink = page.locator('a[href*="chapter1-embodied-intelligence"]');
      await expect(chapterLink).toBeVisible();

      // Click and verify navigation works
      await chapterLink.click();
      await expect(page).toHaveURL(/chapter1-embodied-intelligence/);
    });

    test('content is readable and well-formatted', async ({ page }) => {
      await page.goto('/intro');

      // Check for proper paragraph spacing
      const paragraphs = page.locator('main p');
      const pCount = await paragraphs.count();
      expect(pCount).toBeGreaterThan(3);

      // Verify lists are present
      const lists = page.locator('main ol, main ul');
      const listCount = await lists.count();
      expect(listCount).toBeGreaterThan(0);
    });
  });

  test.describe('SEO and Metadata', () => {
    test('intro page has proper metadata', async ({ page }) => {
      await page.goto('/intro');

      // Check title
      await expect(page).toHaveTitle(/Physical AI/);

      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      expect(await metaDescription.getAttribute('content')).toBeTruthy();
    });

    test('chapter 1 has proper metadata', async ({ page }) => {
      await page.goto('/part1-fundamentals/chapter1-embodied-intelligence');

      // Check title contains chapter name
      await expect(page).toHaveTitle(/Embodied Intelligence/);
    });
  });

  test.describe('Professional Terminology Consistency', () => {
    test('technical terms are consistently used across pages', async ({ page }) => {
      const pages = ['/intro', '/part1-fundamentals/chapter1-embodied-intelligence'];
      const consistentTerms = [
        'Sim-to-Real',
        'embodied intelligence',
        'ROS 2',
        'Isaac Sim',
      ];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const content = await page.textContent('main');

        for (const term of consistentTerms) {
          expect(content).toContain(term);
        }
      }
    });
  });
});
