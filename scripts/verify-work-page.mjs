import { chromium } from '@playwright/test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'screenshots', '_verify');
mkdirSync(OUT, { recursive: true });

const CHROMIUM = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1200\\chrome-win64\\chrome.exe';

const browser = await chromium.launch({ headless: true, executablePath: CHROMIUM });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Capture console errors
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));

console.log('Loading /work page...');
await page.goto('http://localhost:3000/work', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

// Screenshot full page
await page.screenshot({ path: join(OUT, 'work-page-full.png'), fullPage: true });
console.log('✓ work-page-full.png');

// Check for iframes
const iframes = await page.evaluate(() => {
  return [...document.querySelectorAll('iframe')].map(f => ({
    src: f.src,
    width: f.offsetWidth,
    height: f.offsetHeight,
    visible: f.offsetHeight > 0
  }));
});
console.log(`\nIframes found: ${iframes.length}`);
iframes.forEach(f => console.log(`  src=${f.src.replace('http://localhost:3000','')}, ${f.width}×${f.height}, visible=${f.visible}`));

// Check flagship cards
const cards = await page.evaluate(() => {
  return [...document.querySelectorAll('.flagship-card')].map(c => ({
    hasIframe: !!c.querySelector('iframe'),
    hasWidget: !!c.querySelector('.widget-mini'),
    name: c.querySelector('.flagship-name')?.innerText,
    iframeSrc: c.querySelector('iframe')?.src?.replace('http://localhost:3000','') || null
  }));
});
console.log(`\nFlagship cards: ${cards.length}`);
cards.forEach(c => console.log(`  ${c.name}: iframe=${c.hasIframe} src=${c.iframeSrc || 'none'}`));

// Scroll to see each card and screenshot
const cardEls = await page.locator('.flagship-card').all();
for (let i = 0; i < cardEls.length; i++) {
  await cardEls[i].scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const box = await cardEls[i].boundingBox();
  if (box) {
    await page.screenshot({
      path: join(OUT, `card-${i}.png`),
      clip: { x: box.x, y: Math.max(0, box.y - 10), width: box.width, height: Math.min(box.height + 20, 900) }
    });
    console.log(`✓ card-${i}.png (${cards[i]?.name})`);
  }
}

// Check for JS errors
console.log(`\nConsole errors: ${errors.length}`);
errors.forEach(e => console.log(`  ✗ ${e}`));

await ctx.close();
await browser.close();
console.log('\nDone. Check public/screenshots/_verify/');
