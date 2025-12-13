const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 900 });
  
  // Try homepage first
  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  
  // Screenshot homepage
  await page.screenshot({ path: 'screenshot-homepage.png', fullPage: true });
  console.log('Screenshot saved: screenshot-homepage.png');
  
  // Try to find docs link
  const docsLink = await page.$('a[href*="docs"]');
  if (docsLink) {
    console.log('Found docs link, clicking...');
    await docsLink.click();
    await page.waitForTimeout(2000);
    
    // Scroll to bottom to see chatbot
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Take screenshot of page with chatbot
    await page.screenshot({ path: 'screenshot-with-chatbot.png', fullPage: true });
    console.log('Screenshot saved: screenshot-with-chatbot.png');
    
    // Try to find chatbot container
    const chatbot = await page.$('[class*="ChatRAG"]') || await page.$('textarea[placeholder*="Ask"]');
    if (chatbot) {
      console.log('Found chatbot!');
      
      // Get bounding box and take focused screenshot
      const box = await chatbot.boundingBox();
      if (box) {
        await page.screenshot({
          path: 'screenshot-chatbot-closeup.png',
          clip: {
            x: Math.max(0, box.x - 20),
            y: Math.max(0, box.y - 100),
            width: Math.min(1280, box.width + 40),
            height: Math.min(800, box.height + 120)
          }
        });
        console.log('Screenshot saved: screenshot-chatbot-closeup.png');
      }
    }
  }
  
  await browser.close();
})();
