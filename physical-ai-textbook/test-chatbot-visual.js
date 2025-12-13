const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewportSize({ width: 1280, height: 900 });
  
  console.log('Navigating to Chapter 1...');
  await page.goto('http://localhost:3000/docs/part1-fundamentals/chapter1-embodied-intelligence');
  await page.waitForTimeout(2000);
  
  // Scroll to chatbot
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1000);
  
  // Screenshot 1: Empty state
  console.log('Taking screenshot 1: Empty state...');
  await page.screenshot({ path: 'chatbot-empty-state.png', fullPage: false });
  
  // Find and click a suggestion button if exists
  const suggestionButton = await page.$('button:has-text("What is ROS 2?")');
  if (suggestionButton) {
    console.log('Clicking suggestion button...');
    await suggestionButton.click();
    await page.waitForTimeout(500);
  }
  
  // Type a question
  console.log('Typing question...');
  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.fill('What is embodied intelligence?');
    await page.waitForTimeout(500);
    
    // Screenshot 2: With input
    console.log('Taking screenshot 2: With input...');
    await page.screenshot({ path: 'chatbot-with-input.png', fullPage: false });
    
    // Click send button
    const sendButton = await page.$('button:has(svg)');
    if (sendButton) {
      console.log('Sending message...');
      await sendButton.click();
      await page.waitForTimeout(5000); // Wait for response
      
      // Screenshot 3: With response
      console.log('Taking screenshot 3: With response...');
      await page.screenshot({ path: 'chatbot-with-response.png', fullPage: false });
      
      // Send another message to test scrolling
      await textarea.fill('Tell me more about sensors');
      await page.waitForTimeout(500);
      await sendButton.click();
      await page.waitForTimeout(5000);
      
      // Send one more
      await textarea.fill('Explain ROS 2 topics');
      await page.waitForTimeout(500);
      await sendButton.click();
      await page.waitForTimeout(5000);
      
      // Screenshot 4: Multiple messages (test scroll)
      console.log('Taking screenshot 4: Multiple messages...');
      await page.screenshot({ path: 'chatbot-multiple-messages.png', fullPage: false });
    }
  }
  
  console.log('Screenshots saved to physical-ai-textbook/');
  console.log('- chatbot-empty-state.png');
  console.log('- chatbot-with-input.png');
  console.log('- chatbot-with-response.png');
  console.log('- chatbot-multiple-messages.png');
  
  await browser.close();
})();
