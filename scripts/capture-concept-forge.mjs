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

async function tryLogin(page) {
  const loginSels = [
    'a[href*="login"]','a[href*="signin"]','button:has-text("Sign in")',
    'button:has-text("Log in")','button:has-text("Get Started")','a:has-text("Sign in")',
  ];
  for (const sel of loginSels) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) { await el.click(); await page.waitForTimeout(1500); break; }
    } catch {}
  }
  const emailSels = ['input[type="email"]','input[name="email"]','input[placeholder*="email" i]'];
  for (const sel of emailSels) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.fill(EMAIL);
        for (const ps of ['input[type="password"]','input[name="password"]']) {
          try { const pw = page.locator(ps).first(); if (await pw.isVisible({ timeout: 1500 })) { await pw.fill(PASS); break; } } catch {}
        }
        for (const ss of ['button[type="submit"]','button:has-text("Sign in")','button:has-text("Log in")','button:has-text("Continue")']) {
          try { const sub = page.locator(ss).first(); if (await sub.isVisible({ timeout: 1500 })) { await sub.click(); await page.waitForTimeout(3000); break; } } catch {}
        }
        break;
      }
    } catch {}
  }
}

async function shot(page, url, name) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2000);
    const cur = page.url();
    if (cur.includes('login') || cur.includes('signin') || cur.includes('auth')) {
      await tryLogin(page);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: join(OUT_DIR, `${name}.png`), fullPage: false });
    console.log(`  ✓ ${name}.png`);
  } catch(e) { console.log(`  ✗ ${name}: ${e.message}`); }
}

const browser = await chromium.launch({ headless: true, executablePath: CHROMIUM });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

console.log('▶ ConceptForge');
await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(1500);
await tryLogin(page);

await shot(page, BASE, 'landing');
await shot(page, BASE + '/dashboard', 'dashboard');
await shot(page, BASE + '/practice', 'practice');
await shot(page, BASE + '/mastery', 'mastery');
await shot(page, BASE + '/subjects', 'subjects');

await ctx.close();
await browser.close();
console.log('Done');
