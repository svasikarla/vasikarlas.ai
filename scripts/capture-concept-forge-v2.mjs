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

// 1. Full landing page
console.log('Landing...');
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: join(OUT_DIR, 'landing.png') });
console.log('✓ landing.png');

// 2. Features section
console.log('Features section...');
await page.evaluate(() => document.querySelector('#features')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(800);
await page.screenshot({ path: join(OUT_DIR, 'features.png') });
console.log('✓ features.png');

// 3. How It Works section
console.log('How It Works...');
await page.evaluate(() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(800);
await page.screenshot({ path: join(OUT_DIR, 'how-it-works.png') });
console.log('✓ how-it-works.png');

// 4. Try login with longer wait
console.log('Attempting login...');
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForTimeout(1000);

const emailEl = page.locator('input[type="email"]').first();
const passEl  = page.locator('input[type="password"]').first();
if (await emailEl.isVisible({ timeout: 3000 })) {
  await emailEl.fill(EMAIL);
  if (await passEl.isVisible({ timeout: 2000 })) await passEl.fill(PASS);
  const btnEl = page.locator('button[type="submit"], button:has-text("Sign In")').first();
  if (await btnEl.isVisible({ timeout: 2000 })) await btnEl.click();
  // Wait up to 12s for redirect
  try {
    await page.waitForURL(url => !url.includes('/login'), { timeout: 12000 });
  } catch {}
  await page.waitForTimeout(2000);
}

const postLoginUrl = page.url();
console.log('Post-login URL:', postLoginUrl);
await page.screenshot({ path: join(OUT_DIR, 'post_login.png') });

if (!postLoginUrl.includes('/login')) {
  console.log('Login succeeded!');
  // Discover nav links
  const navLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="/"]')].map(a => ({ text: a.innerText?.trim(), href: a.href })).filter(a => a.text).slice(0, 20)
  );
  console.log('Nav links:', JSON.stringify(navLinks));

  // Take post-login screenshot
  await page.screenshot({ path: join(OUT_DIR, 'dashboard.png') });
  console.log('✓ dashboard.png');

  // Navigate to any discovered pages
  const internalLinks = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href))]
      .filter(h => h.startsWith('https://concept-forge-iota.vercel.app') && !h.endsWith('/login') && !h.endsWith('/register'))
  );
  console.log('Internal links:', internalLinks.slice(0, 10));

  let shotCount = 0;
  for (const link of internalLinks.slice(0, 4)) {
    if (link === BASE + '/' || link === BASE) continue;
    try {
      await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
      const slug = new URL(link).pathname.replace(/\//g, '_').replace(/^_/, '') || 'page';
      await page.screenshot({ path: join(OUT_DIR, `${slug}.png`) });
      console.log(`✓ ${slug}.png`);
      shotCount++;
      if (shotCount >= 3) break;
    } catch(e) { console.log(`✗ ${link}: ${e.message}`); }
  }
} else {
  console.log('Login failed — using landing page sections only');
}

await ctx.close();
await browser.close();
console.log('Done');
