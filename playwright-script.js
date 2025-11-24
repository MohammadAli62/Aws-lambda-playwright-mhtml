const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generateMHTML(url, outputPath) {
  const browser = await chromium.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote'
    ],
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  // Use Chrome DevTools Protocol (CDP) to capture MHTML snapshot
  const client = await page.context().newCDPSession(page);
  const { data } = await client.send('Page.captureSnapshot', { format: 'mhtml' });

  fs.writeFileSync(outputPath, data);

  await browser.close();

  return outputPath;
}

module.exports = generateMHTML;