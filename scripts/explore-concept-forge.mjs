import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'screenshots', 'concept-forge');
mkdirSync(OUT_DIR, { recursive: true });

const EMAIL = 'vasikarla.satish@outlook.com';
const PASS  = 'March@012025';
const CHROMIUM = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1200\\chrome-win64\\chrome.exe';
const BASE = 'https://concept-forge-iota.vercel.app';

const browser = await chromium.launch({ headless: true, executablePath: CHROMIUM });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

console.log('▶ Navigating to ConceptForge landing...');
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

console.log('Current URL:', page.url());
console.log('Page title:', await page.title());

// Take landing screenshot
await page.screenshot({ path: join(OUT_DIR, 'landing.png'), fullPage: false });
console.log('✓ landing.png');

// Look for nav links and buttons
const links = await page.evaluate(() => {
  const anchors = [...document.querySelectorAll('a[href]')];
  return anchors.map(a => ({ text: a.innerText?.trim(), href: a.href })).filter(a => a.text && a.href).slice(0, 30);
});
console.log('Nav links:', JSON.stringify(links, null, 2));

// Look for clickable buttons
const buttons = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  return btns.map(b => b.innerText?.trim()).filter(Boolean).slice(0, 20);
});
console.log('Buttons:', JSON.stringify(buttons));

// Try to find and click sign in
const loginSels = [
  'button:has-text("Sign In")', 'button:has-text("Login")',
  'a:has-text("Sign In")', 'a:has-text("Get Started")',
  'a[href*="login"]', 'a[href*="signin"]',
  'button:has-text("Continue")', 'button:has-text("Enter")',
];
for (const sel of loginSels) {
  try {
    const el = page.locator(sel).first();
    if (await el.isVisible({ timeout: 1000 })) {
      console.log('Found login btn:', sel);
      await el.click();
      await page.waitForTimeout(2000);
      break;
    }
  } catch {}
}

console.log('After click URL:', page.url());
await page.screenshot({ path: join(OUT_DIR, 'after_click.png'), fullPage: false });

// Try email login
const emailInput = page.locator('input[type="email"]').first();
if (await emailInput.isVisible({ timeout: 3000 })) {
  console.log('Found email input, filling...');
  await emailInput.fill(EMAIL);
  const pwInput = page.locator('input[type="password"]').first();
  if (await pwInput.isVisible({ timeout: 2000 })) {
    await pwInput.fill(PASS);
  }
  for (const ss of ['button[type="submit"]','button:has-text("Sign In")','button:has-text("Login")','button:has-text("Continue")']) {
    try {
      const sub = page.locator(ss).first();
      if (await sub.isVisible({ timeout: 1000 })) { await sub.click(); break; }
    } catch {}
  }
  await page.waitForTimeout(4000);
  console.log('After login URL:', page.url());
  await page.screenshot({ path: join(OUT_DIR, 'after_login.png'), fullPage: false });
}

// Now explore navigation
const navLinks2 = await page.evaluate(() => {
  const anchors = [...document.querySelectorAll('a[href], nav a, [role="navigation"] a')];
  return [...new Set(anchors.map(a => a.href).filter(h => h.startsWith('http')))].slice(0, 20);
});
console.log('Post-login links:', JSON.stringify(navLinks2));

await ctx.close();
await browser.close();
console.log('Done exploration');
