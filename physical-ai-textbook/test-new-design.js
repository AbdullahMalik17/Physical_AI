const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('1. Navigating to docs page...');
  await page.goto('http://localhost:3000/docs/part1-foundations/chapter1-embodied-intelligence');
  await page.waitForTimeout(2000);

  console.log('2. Clicking floating button...');
  const button = await page.$('button.floating-chat-button');
  if (button) {
    await button.click();
    await page.waitForTimeout(800);

    console.log('3. Chatbot opened - capturing empty state...');
    await page.screenshot({ path: 'new-design-empty.png', fullPage: false });

    const chatWindow = await page.$('.floating-chat-window');
    if (chatWindow) {
      const box = await chatWindow.boundingBox();
      await page.screenshot({
        path: 'new-design-chatbot-hq.png',
        clip: {
          x: box.x - 5,
          y: box.y - 5,
          width: box.width + 10,
          height: box.height + 10
        }
      });
      console.log('✓ High-quality screenshot saved');

      // Type a question
      const input = await page.$('input[type="text"]');
      if (input) {
        await input.fill('What is ROS 2?');
        await page.waitForTimeout(500);

        console.log('4. Question typed - capturing...');
        await page.screenshot({
          path: 'new-design-with-input.png',
          clip: {
            x: box.x - 5,
            y: box.y - 5,
            width: box.width + 10,
            height: box.height + 10
          }
        });

        // Simulate a conversation
        await page.evaluate(() => {
          const messagesDiv = document.querySelector('.tw-overflow-y-auto');
          if (messagesDiv) {
            messagesDiv.innerHTML = `
              <div class="tw-space-y-3">
                <div class="tw-flex tw-justify-end">
                  <div style="max-width: 85%; background: var(--ifm-color-primary, #2563eb); color: #ffffff; border-radius: 16px; padding: 10px 14px; font-size: 14px;">
                    What is embodied intelligence?
                  </div>
                </div>
                <div class="tw-flex tw-justify-start">
                  <div style="max-width: 85%; background: var(--ifm-background-surface-color, #f1f5f9); color: var(--ifm-font-color-base, #1e293b); border-radius: 16px; padding: 10px 14px; font-size: 14px; line-height: 1.5;">
                    Embodied intelligence refers to the integration of physical form and intelligent behavior. Unlike purely software-based AI, embodied AI systems have physical bodies that interact with the real world through sensors and actuators.
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 12px; color: #64748b;">
                      <strong>Sources:</strong> Chapter 1: Embodied Intelligence
                    </div>
                  </div>
                </div>
                <div class="tw-flex tw-justify-end">
                  <div style="max-width: 85%; background: var(--ifm-color-primary, #2563eb); color: #ffffff; border-radius: 16px; padding: 10px 14px; font-size: 14px;">
                    How does it differ from traditional AI?
                  </div>
                </div>
                <div class="tw-flex tw-justify-start">
                  <div style="max-width: 85%; background: var(--ifm-background-surface-color, #f1f5f9); color: var(--ifm-font-color-base, #1e293b); border-radius: 16px; padding: 10px 14px; font-size: 14px; line-height: 1.5;">
                    Traditional AI operates in purely digital environments, while embodied AI must deal with the complexities of the physical world. This includes sensor noise, actuator limitations, and real-time constraints that don't exist in virtual environments.
                  </div>
                </div>
              </div>
            `;
          }
        });

        await page.waitForTimeout(500);

        console.log('5. Conversation simulated - capturing...');
        await page.screenshot({
          path: 'new-design-conversation.png',
          clip: {
            x: box.x - 5,
            y: box.y - 5,
            width: box.width + 10,
            height: box.height + 10
          }
        });
      }
    }
  }

  await page.waitForTimeout(2000);
  await browser.close();

  console.log('\n✅ All screenshots created!');
  console.log('  new-design-empty.png - Empty state');
  console.log('  new-design-chatbot-hq.png - High-quality focused view');
  console.log('  new-design-with-input.png - With question typed');
  console.log('  new-design-conversation.png - Full conversation');
})();
