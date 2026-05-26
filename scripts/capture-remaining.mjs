import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SHOTS = join(ROOT, 'public', 'screenshots');
const CHROMIUM = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1200\\chrome-win64\\chrome.exe';
const EMAIL = 'vasikarla.satish@outlook.com';
const PASS  = 'March@012025';

async function login(page, base) {
  for (const sel of ['a[href*="login"]','a[href*="signin"]','button:has-text("Sign In")','a:has-text("Sign In")']) {
    try { const el = page.locator(sel).first(); if (await el.isVisible({ timeout: 1200 })) { await el.click(); await page.waitForTimeout(1200); break; } } catch {}
  }
  for (const sel of ['input[type="email"]','input[name="email"]']) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.fill(EMAIL);
        for (const p of ['input[type="password"]','input[name="password"]']) {
          try { const pw = page.locator(p).first(); if (await pw.isVisible({ timeout: 1200 })) { await pw.fill(PASS); break; } } catch {}
        }
        for (const s of ['button[type="submit"]','button:has-text("Sign In")','button:has-text("Log in")']) {
          try { const b = page.locator(s).first(); if (await b.isVisible({ timeout: 1200 })) { await b.click(); break; } } catch {}
        }
        break;
      }
    } catch {}
  }
  try { await page.waitForURL(u => !u.includes('/login') && !u.includes('/signin') && !u.includes('/auth'), { timeout: 10000 }); } catch {}
  await page.waitForTimeout(2000);
}

async function shot(page, url, outPath) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: outPath });
  console.log(`  ✓ ${outPath.split('\\').pop()}`);
}

const browser = await chromium.launch({ headless: true, executablePath: CHROMIUM });

// ── BimaBuddy remaining pages ──────────────────────────────────────────────
{
  const dir = join(SHOTS, 'bima-buddy-advanced');
  mkdirSync(dir, { recursive: true });
  console.log('\n▶ BimaBuddy remaining pages');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('https://bima-buddy-advanced.vercel.app', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1500);
  await login(page, 'https://bima-buddy-advanced.vercel.app');
  await shot(page, 'https://bima-buddy-advanced.vercel.app/claim-intelligence', join(dir, 'claim-intelligence.png'));
  await shot(page, 'https://bima-buddy-advanced.vercel.app/voice-assistant',    join(dir, 'voice-assistant.png'));
  await shot(page, 'https://bima-buddy-advanced.vercel.app/wellness',            join(dir, 'wellness.png'));
  await shot(page, 'https://bima-buddy-advanced.vercel.app/analytics',           join(dir, 'analytics.png'));
  await ctx.close();
}

// ── NLSQLPro — navigate via UI ─────────────────────────────────────────────
{
  const dir = join(SHOTS, 'nlsql-pro');
  mkdirSync(dir, { recursive: true });
  console.log('\n▶ NLSQLPro pages via nav');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('https://nlsql-pro.vercel.app', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1500);
  await login(page, 'https://nlsql-pro.vercel.app');
  const curUrl = page.url();
  console.log('  Post-login:', curUrl);
  // Discover nav links
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map(a=>({t:a.innerText?.trim(),h:a.href})).filter(a=>a.t&&a.h.includes('nlsql-pro'))
  );
  console.log('  Nav:', links.slice(0,8).map(l=>`${l.t}→${l.h.split('/').pop()}`).join(', '));
  // Take shot of current page
  await page.screenshot({ path: join(dir, 'post-login.png') });
  // Navigate through nav links
  const base = 'https://nlsql-pro.vercel.app';
  for (const link of links.slice(0,5)) {
    if (!link.h.startsWith(base)) continue;
    const slug = link.h.replace(base,'').replace(/\//g,'-').replace(/^-/,'') || 'home';
    try {
      await page.goto(link.h, { waitUntil: 'domcontentloaded', timeout: 18000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: join(dir, `${slug}.png`) });
      console.log(`  ✓ ${slug}.png  (${link.t})`);
    } catch(e) { console.log(`  ✗ ${slug}: ${e.message.slice(0,60)}`); }
  }
  await ctx.close();
}

// ── CorePragya — content studio ────────────────────────────────────────────
{
  const dir = join(SHOTS, 'core-pragya-advanced');
  mkdirSync(dir, { recursive: true });
  console.log('\n▶ CorePragya content-studio');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('https://core-pragya-advanced.vercel.app', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(1500);
  await login(page, 'https://core-pragya-advanced.vercel.app');
  await shot(page, 'https://core-pragya-advanced.vercel.app/content-creation', join(dir, 'content-studio.png'));
  await shot(page, 'https://core-pragya-advanced.vercel.app/tech-research',    join(dir, 'tech-research.png'));
  await ctx.close();
}

await browser.close();
console.log('\n✅ Done.');
