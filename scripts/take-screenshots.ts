import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function takeScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('https://nishantdev.space', { waitUntil: 'networkidle2' });

  const imagesDir = path.join(process.cwd(), 'public', 'images');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (let i = 1; i <= 10; i++) {
    const screenshotPath = path.join(imagesDir, `screenshot-${i}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Screenshot ${i} saved to ${screenshotPath}`);

    // Wait a bit and scroll down for variety
    await page.evaluate(() => {
      window.scrollBy(0, 200);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await browser.close();
  console.log('All screenshots taken!');
}

takeScreenshots().catch(console.error);