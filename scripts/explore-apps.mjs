/**
 * Explore and screenshot actual app routes by navigating the UI.
 * Run this after the initial capture to fix missing/404 screenshots.
 */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SHOTS_DIR = join(ROOT, 'public', 'screenshots');
const CHROMIUM = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1200\\chrome-win64\\chrome.exe';
const EMAIL = 'vasikarla.satish@outlook.com';
const PASS  = 'March@012025';

const APPS = [
  { id: 'bima-buddy-advanced', url: 'https://bima-buddy-advanced.vercel.app' },
  { id: 'nlsql-pro',           url: 'https://nlsql-pro.vercel.app' },
  { id: 'igcse-student-guide', url: 'https://igcse-student-guide.vercel.app' },
  { id: 'core-pragya-advanced',url: 'https://core-pragya-advanced.vercel.app' },
];

async function loginViaForm(page, base) {
  // try to find login link
  for (const sel of ['a[href*="login"]','a[href*="signin"]','button:has-text("Sign In")','button:has-text("Sign in")','a:has-text("Sign In")','a:has-text("Sign in")']) {
    try { const el = page.locator(sel).first(); if (await el.isVisible({ timeout: 1500 })) { await el.click(); await page.waitForTimeout(1500); break; } } catch {}
  }
  for (const sel of ['input[type="email"]','input[name="email"]','input[placeholder*="email" i]']) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.fill(EMAIL);
        for (const ps of ['input[type="password"]','input[name="password"]']) {
          try { const pw = page.locator(ps).first(); if (await pw.isVisible({ timeout: 1500 })) { await pw.fill(PASS); break; } } catch {}
        }
        for (const ss of ['button[type="submit"]','button:has-text("Sign In")','button:has-text("Sign in")','button:has-text("Login")','button:has-text("Continue")']) {
          try { const sub = page.locator(ss).first(); if (await sub.isVisible({ timeout: 1500 })) { await sub.click(); break; } } catch {}
        }
        break;
      }
    } catch {}
  }
  try { await page.waitForURL(url => !url.includes('/login') && !url.includes('/signin') && !url.includes('/auth'), { timeout: 10000 }); } catch {}
  await page.waitForTimeout(2000);
}

const browser = await chromium.launch({ headless: true, executablePath: CHROMIUM });

for (const app of APPS) {
  const outDir = join(SHOTS_DIR, app.id);
  mkdirSync(outDir, { recursive: true });

  console.log(`\n▶ Exploring ${app.id} (${app.url})`);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  await page.goto(app.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await loginViaForm(page, app.url);

  const curUrl = page.url();
  console.log(`  Post-login URL: ${curUrl}`);

  // Take screenshot of current page (home/dashboard after login)
  await page.screenshot({ path: join(outDir, 'home.png') });
  console.log(`  ✓ home.png (${curUrl})`);

  // Discover all navigation links
  const links = await page.evaluate(() => {
    const seen = new Set();
    const result = [];
    for (const a of document.querySelectorAll('a[href], nav a, [role="navigation"] a, header a')) {
      const href = a.href;
      const text = a.innerText?.trim();
      if (href && text && !seen.has(href)) {
        seen.add(href);
        result.push({ text, href });
      }
    }
    return result;
  });

  const base = new URL(app.url).origin;
  const internalLinks = links.filter(l => l.href.startsWith(base) && l.href !== base + '/' && l.href !== base);
  console.log(`  Nav links (${internalLinks.length}):`, internalLinks.slice(0, 8).map(l => `${l.text}→${l.href.replace(base,'')}`).join(', '));

  // Screenshot each nav page
  let count = 0;
  for (const link of internalLinks.slice(0, 6)) {
    try {
      await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2500);
      const slug = new URL(link.href).pathname.replace(/^\//, '').replace(/\//g, '-') || 'home';
      await page.screenshot({ path: join(outDir, `${slug}.png`) });
      console.log(`  ✓ ${slug}.png  ← ${link.text}`);
      count++;
      if (count >= 4) break;
    } catch(e) { console.log(`  ✗ ${link.href}: ${e.message.split('\n')[0]}`); }
  }

  // Also save the nav map for reference
  writeFileSync(join(outDir, '_navmap.json'), JSON.stringify(internalLinks.slice(0, 20), null, 2));
  await ctx.close();
}

await browser.close();
console.log('\n✅ Exploration done. Check public/screenshots/[app]/_navmap.json for routes.');
