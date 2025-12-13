const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Set to false to see what's happening
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('1. Navigating to docs page...');
  await page.goto('http://localhost:3000/docs/part1-foundations/chapter1-embodied-intelligence');
  await page.waitForTimeout(3000);

  console.log('2. Taking screenshot of page before opening chatbot...');
  await page.screenshot({ path: 'screenshot-before-chatbot.png', fullPage: false });

  console.log('3. Looking for floating chatbot button...');
  const floatingButton = await page.$('button.floating-chat-button');

  if (floatingButton) {
    console.log('✓ Found floating chatbot button!');

    // Take screenshot showing the button
    await page.screenshot({ path: 'screenshot-with-button.png', fullPage: false });

    console.log('4. Clicking floating button to open chatbot...');
    await floatingButton.click();
    await page.waitForTimeout(1000); // Wait for animation

    console.log('5. Taking screenshot of opened chatbot...');
    await page.screenshot({ path: 'screenshot-chatbot-open.png', fullPage: false });

    // Check if chat window is now visible
    const chatWindow = await page.$('.floating-chat-window');
    if (chatWindow) {
      console.log('✓ Chat window is open!');

      // Get the bounding box of the chat window for a focused screenshot
      const box = await chatWindow.boundingBox();
      if (box) {
        await page.screenshot({
          path: 'screenshot-chatbot-focused.png',
          clip: {
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height
          }
        });
        console.log('✓ Saved focused screenshot of chat window');
      }

      // Check for the textarea
      const textarea = await page.$('textarea[placeholder*="Ask"]');
      if (textarea) {
        console.log('✓ Found textarea input!');

        // Type a sample question
        console.log('6. Typing sample question...');
        await textarea.fill('What is ROS 2?');
        await page.waitForTimeout(500);

        await page.screenshot({ path: 'screenshot-with-question.png', fullPage: false });
        console.log('✓ Screenshot saved with question typed');

        // Check for suggestion pills in empty state
        const suggestions = await page.$$('button[style*="border-radius"]');
        console.log(`✓ Found ${suggestions.length} suggestion pills`);

      } else {
        console.log('✗ Textarea not found in chat window');
      }

      // Get chat window dimensions
      console.log(`\nChat Window Dimensions:
  Width: ${box?.width}px
  Height: ${box?.height}px
  Position: (${box?.x}, ${box?.y})`);

    } else {
      console.log('✗ Chat window did not open');
    }

  } else {
    console.log('✗ Floating chatbot button not found!');
    console.log('Checking for any buttons on the page...');
    const allButtons = await page.$$('button');
    console.log(`Found ${allButtons.length} buttons total`);
  }

  console.log('\n7. Waiting 3 seconds before closing...');
  await page.waitForTimeout(3000);

  await browser.close();
  console.log('\n✓ Test complete! Check the screenshots.');
})();
