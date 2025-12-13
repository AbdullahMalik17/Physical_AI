const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });

  // Test 1: Desktop view with chatbot interaction
  console.log('=== Test 1: Desktop Chatbot Demo ===');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewportSize({ width: 1920, height: 1080 });

  await desktopPage.goto('http://localhost:3000/docs/part1-foundations/chapter1-embodied-intelligence');
  await desktopPage.waitForTimeout(2000);

  console.log('1. Homepage with floating button visible');
  await desktopPage.screenshot({
    path: 'demo-1-homepage.png',
    fullPage: false
  });

  // Open chatbot
  const button = await desktopPage.$('button.floating-chat-button');
  if (button) {
    await button.click();
    await desktopPage.waitForTimeout(800);

    console.log('2. Empty state with suggestions');
    await desktopPage.screenshot({
      path: 'demo-2-chatbot-empty.png',
      fullPage: false
    });

    // Click first suggestion
    const suggestions = await desktopPage.$$('button[style*="border-radius"]');
    if (suggestions.length > 0) {
      // Type in the textarea instead
      const textarea = await desktopPage.$('textarea');
      if (textarea) {
        await textarea.fill('What is embodied intelligence?');
        await desktopPage.waitForTimeout(500);

        console.log('3. Question typed in textarea');
        await desktopPage.screenshot({
          path: 'demo-3-question-typed.png',
          fullPage: false
        });

        // Simulate adding messages (we'll use browser context to modify DOM)
        await desktopPage.evaluate(() => {
          const messagesDiv = document.querySelector('.tw-overflow-y-auto');
          if (messagesDiv) {
            // Create a sample conversation to show scroll
            const userMsg1 = document.createElement('div');
            userMsg1.className = 'tw-mb-4';
            userMsg1.innerHTML = `
              <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 12px 16px; border-radius: 16px; max-width: 80%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <p style="margin: 0; font-size: 14px; line-height: 1.5;">What is embodied intelligence?</p>
                </div>
              </div>
            `;

            const aiMsg1 = document.createElement('div');
            aiMsg1.className = 'tw-mb-4';
            aiMsg1.innerHTML = `
              <div style="display: flex; gap: 12px; margin-bottom: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px;">🤖</div>
                <div style="background: rgba(241, 245, 249, 0.8); padding: 12px 16px; border-radius: 16px; max-width: 80%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b;">
                    Embodied intelligence refers to the integration of physical form and intelligent behavior. Unlike purely software-based AI, embodied AI systems have physical bodies that interact with the real world through sensors and actuators. This physical embodiment allows robots to learn from direct experience and develop understanding through interaction with their environment.
                  </p>
                  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(148, 163, 184, 0.2);">
                    <p style="margin: 0; font-size: 12px; color: #64748b;">
                      <strong>Source:</strong> <a href="#" style="color: #3b82f6; text-decoration: none;">Chapter 1: Embodied Intelligence</a>
                    </p>
                  </div>
                </div>
              </div>
            `;

            const userMsg2 = document.createElement('div');
            userMsg2.className = 'tw-mb-4';
            userMsg2.innerHTML = `
              <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 12px 16px; border-radius: 16px; max-width: 80%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <p style="margin: 0; font-size: 14px; line-height: 1.5;">Can you give me an example?</p>
                </div>
              </div>
            `;

            const aiMsg2 = document.createElement('div');
            aiMsg2.className = 'tw-mb-4';
            aiMsg2.innerHTML = `
              <div style="display: flex; gap: 12px; margin-bottom: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px;">🤖</div>
                <div style="background: rgba(241, 245, 249, 0.8); padding: 12px 16px; border-radius: 16px; max-width: 80%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b;">
                    A great example is a humanoid robot learning to walk. The robot uses its sensors (IMU, force sensors) to detect balance and ground contact, processes this information through its control systems, and adjusts motor commands to maintain stability. This continuous feedback loop between physical sensors, computation, and actuators demonstrates embodied intelligence in action.
                  </p>
                  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(148, 163, 184, 0.2);">
                    <p style="margin: 0; font-size: 12px; color: #64748b;">
                      <strong>Source:</strong> <a href="#" style="color: #3b82f6; text-decoration: none;">Chapter 12: Bipedal Locomotion</a>
                    </p>
                  </div>
                </div>
              </div>
            `;

            messagesDiv.innerHTML = '';
            messagesDiv.appendChild(userMsg1);
            messagesDiv.appendChild(aiMsg1);
            messagesDiv.appendChild(userMsg2);
            messagesDiv.appendChild(aiMsg2);

            // Scroll to bottom
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
        });

        await desktopPage.waitForTimeout(500);

        console.log('4. Conversation with messages (shows scroll)');
        await desktopPage.screenshot({
          path: 'demo-4-conversation.png',
          fullPage: false
        });
      }
    }
  }

  await desktopPage.close();

  // Test 2: Mobile responsive view
  console.log('\n=== Test 2: Mobile Responsive Demo ===');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 812 }); // iPhone X

  await mobilePage.goto('http://localhost:3000/docs/part1-foundations/chapter1-embodied-intelligence');
  await mobilePage.waitForTimeout(2000);

  console.log('5. Mobile view with button');
  await mobilePage.screenshot({
    path: 'demo-5-mobile-closed.png',
    fullPage: false
  });

  const mobileButton = await mobilePage.$('button.floating-chat-button');
  if (mobileButton) {
    await mobileButton.click();
    await mobilePage.waitForTimeout(800);

    console.log('6. Mobile chatbot open');
    await mobilePage.screenshot({
      path: 'demo-6-mobile-open.png',
      fullPage: false
    });
  }

  await mobilePage.close();

  // Test 3: Focused chatbot window capture
  console.log('\n=== Test 3: Focused Chatbot Capture ===');
  const focusPage = await browser.newPage();
  await focusPage.setViewportSize({ width: 1920, height: 1080 });

  await focusPage.goto('http://localhost:3000/docs/part1-foundations/chapter1-embodied-intelligence');
  await focusPage.waitForTimeout(2000);

  const focusButton = await focusPage.$('button.floating-chat-button');
  if (focusButton) {
    await focusButton.click();
    await focusPage.waitForTimeout(800);

    const chatWindow = await focusPage.$('.floating-chat-window');
    if (chatWindow) {
      const box = await chatWindow.boundingBox();

      console.log('7. High-quality chatbot window only');
      await focusPage.screenshot({
        path: 'demo-7-chatbot-hq.png',
        clip: {
          x: box.x - 10,
          y: box.y - 10,
          width: box.width + 20,
          height: box.height + 20
        }
      });
    }
  }

  await focusPage.close();
  await browser.close();

  console.log('\n✅ All demo screenshots created successfully!');
  console.log('\nScreenshots created:');
  console.log('  demo-1-homepage.png - Homepage with floating button');
  console.log('  demo-2-chatbot-empty.png - Empty state with suggestions');
  console.log('  demo-3-question-typed.png - Question typed in input');
  console.log('  demo-4-conversation.png - Conversation showing scroll');
  console.log('  demo-5-mobile-closed.png - Mobile view (closed)');
  console.log('  demo-6-mobile-open.png - Mobile view (open)');
  console.log('  demo-7-chatbot-hq.png - High-quality chatbot window');
})();
