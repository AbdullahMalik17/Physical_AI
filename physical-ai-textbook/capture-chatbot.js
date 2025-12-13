const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1400, height: 1000 });
  
  console.log('1. Navigating to homepage...');
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  
  // Click "Start Learning" button
  console.log('2. Clicking Start Learning...');
  await page.click('text=Start Learning');
  await page.waitForTimeout(3000);
  
  // Should now be on docs page
  console.log('3. On docs page, scrolling to chatbot...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  // Take full page screenshot
  console.log('4. Taking full page screenshot...');
  await page.screenshot({ path: 'docs-full-page.png', fullPage: true });
  
  // Find chatbot specifically
  const textarea = await page.$('textarea[placeholder*="Ask"]');
  if (textarea) {
    console.log('5. Found chatbot! Taking focused screenshot...');
    
    // Scroll chatbot into view
    await textarea.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Get the parent container
    const chatContainer = await page.evaluateHandle(() => {
      const textarea = document.querySelector('textarea[placeholder*="Ask"]');
      // Go up to find the main chat container
      let element = textarea;
      for (let i = 0; i < 10; i++) {
        element = element.parentElement;
        if (element.style.height && element.style.borderRadius) {
          return element;
        }
      }
      return textarea.parentElement;
    });
    
    const box = await chatContainer.asElement().boundingBox();
    if (box) {
      // Capture chatbot container
      await page.screenshot({
        path: 'chatbot-empty.png',
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: Math.min(page.viewportSize().width, box.width + 20),
          height: Math.min(page.viewportSize().height, box.height + 20)
        }
      });
      console.log('   Saved: chatbot-empty.png');
    }
    
    // Type a message
    console.log('6. Typing message...');
    await textarea.fill('What is Physical AI and how does it relate to robotics?');
    await page.waitForTimeout(1000);
    
    // Screenshot with input
    if (box) {
      await page.screenshot({
        path: 'chatbot-with-text.png',
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: Math.min(page.viewportSize().width, box.width + 20),
          height: Math.min(page.viewportSize().height, box.height + 20)
        }
      });
      console.log('   Saved: chatbot-with-text.png');
    }
    
    // Click send
    console.log('7. Sending message...');
    const sendBtn = await page.$('button:has(svg[viewBox="0 0 24 24"])');
    if (sendBtn) {
      await sendBtn.click();
      console.log('   Message sent, waiting for response...');
      await page.waitForTimeout(6000); // Wait for API response
      
      // Screenshot with response
      if (box) {
        // Update box in case it changed
        const newBox = await chatContainer.asElement().boundingBox();
        await page.screenshot({
          path: 'chatbot-with-response.png',
          clip: {
            x: Math.max(0, newBox.x - 10),
            y: Math.max(0, newBox.y - 10),
            width: Math.min(page.viewportSize().width, newBox.width + 20),
            height: Math.min(page.viewportSize().height, newBox.height + 20)
          }
        });
        console.log('   Saved: chatbot-with-response.png');
      }
      
      // Send more messages to test scrolling
      console.log('8. Sending more messages to test scrolling...');
      await textarea.fill('Explain ROS 2 nodes and topics');
      await page.waitForTimeout(500);
      await sendBtn.click();
      await page.waitForTimeout(5000);
      
      await textarea.fill('How does sensor fusion work?');
      await page.waitForTimeout(500);
      await sendBtn.click();
      await page.waitForTimeout(5000);
      
      // Final screenshot showing scroll
      const finalBox = await chatContainer.asElement().boundingBox();
      await page.screenshot({
        path: 'chatbot-scrolling.png',
        clip: {
          x: Math.max(0, finalBox.x - 10),
          y: Math.max(0, finalBox.y - 10),
          width: Math.min(page.viewportSize().width, finalBox.width + 20),
          height: Math.min(page.viewportSize().height, finalBox.height + 20)
        }
      });
      console.log('   Saved: chatbot-scrolling.png');
    }
  } else {
    console.log('ERROR: Could not find chatbot textarea!');
  }
  
  console.log('\n✅ All screenshots captured successfully!');
  console.log('Screenshots:');
  console.log('  - docs-full-page.png (full docs page)');
  console.log('  - chatbot-empty.png (empty state)');
  console.log('  - chatbot-with-text.png (with user input)');
  console.log('  - chatbot-with-response.png (with AI response)');
  console.log('  - chatbot-scrolling.png (multiple messages, scrolling)');
  
  await browser.close();
})();
