/**
 * Playwright screenshot capture for flagship apps.
 * Usage: node scripts/capture-screenshots.mjs
 * Credentials read from environment variables DEMO_EMAIL / DEMO_PASS.
 */
import { chromium } from '@playwright/test';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SHOTS_DIR = join(ROOT, 'public', 'screenshots');

const EMAIL = process.env.DEMO_EMAIL || 'vasikarla.satish@outlook.com';
const PASS  = process.env.DEMO_PASS  || 'March@012025';

// Use the already-installed Chromium since the newer download fails on this network
const CHROMIUM_PATH = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1200\\chrome-win64\\chrome.exe';

const APPS = [
  {
    id: 'core-pragya-advanced',
    url: 'https://core-pragya-advanced.vercel.app',
    name: 'CorePragyaAdvanced',
    // Pages/actions to capture after login
    shots: [
      { label: 'landing',   action: async (page) => { await page.goto('https://core-pragya-advanced.vercel.app', { waitUntil: 'networkidle', timeout: 30000 }); } },
      { label: 'dashboard', action: async (page) => { await gotoAfterLogin(page, 'https://core-pragya-advanced.vercel.app/dashboard'); } },
      { label: 'feed',      action: async (page) => { await gotoAfterLogin(page, 'https://core-pragya-advanced.vercel.app/feed'); } },
      { label: 'research',  action: async (page) => { await gotoAfterLogin(page, 'https://core-pragya-advanced.vercel.app/research'); } },
      { label: 'studio',    action: async (page) => { await gotoAfterLogin(page, 'https://core-pragya-advanced.vercel.app/studio'); } },
    ],
  },
  {
    id: 'bima-buddy-advanced',
    url: 'https://bima-buddy-advanced.vercel.app',
    name: 'BimaBuddyAdvanced',
    shots: [
      { label: 'landing',     action: async (page) => { await page.goto('https://bima-buddy-advanced.vercel.app', { waitUntil: 'networkidle', timeout: 30000 }); } },
      { label: 'dashboard',   action: async (page) => { await gotoAfterLogin(page, 'https://bima-buddy-advanced.vercel.app/dashboard'); } },
      { label: 'compare',     action: async (page) => { await gotoAfterLogin(page, 'https://bima-buddy-advanced.vercel.app/compare'); } },
      { label: 'claim',       action: async (page) => { await gotoAfterLogin(page, 'https://bima-buddy-advanced.vercel.app/claim'); } },
      { label: 'voice',       action: async (page) => { await gotoAfterLogin(page, 'https://bima-buddy-advanced.vercel.app/voice'); } },
    ],
  },
  {
    id: 'igcse-student-guide',
    url: 'https://igcse-student-guide.vercel.app',
    name: 'IGCSEStudentGuide',
    shots: [
      { label: 'landing',   action: async (page) => { await page.goto('https://igcse-student-guide.vercel.app', { waitUntil: 'networkidle', timeout: 30000 }); } },
      { label: 'dashboard', action: async (page) => { await gotoAfterLogin(page, 'https://igcse-student-guide.vercel.app/dashboard'); } },
      { label: 'flashcards',action: async (page) => { await gotoAfterLogin(page, 'https://igcse-student-guide.vercel.app/flashcards'); } },
      { label: 'quiz',      action: async (page) => { await gotoAfterLogin(page, 'https://igcse-student-guide.vercel.app/quiz'); } },
      { label: 'subjects',  action: async (page) => { await gotoAfterLogin(page, 'https://igcse-student-guide.vercel.app/subjects'); } },
    ],
  },
  {
    id: 'nlsql-pro',
    url: 'https://nlsql-pro.vercel.app',
    name: 'NLSQLPro',
    shots: [
      { label: 'landing',   action: async (page) => { await page.goto('https://nlsql-pro.vercel.app', { waitUntil: 'networkidle', timeout: 30000 }); } },
      { label: 'dashboard', action: async (page) => { await gotoAfterLogin(page, 'https://nlsql-pro.vercel.app/dashboard'); } },
      { label: 'query',     action: async (page) => { await gotoAfterLogin(page, 'https://nlsql-pro.vercel.app/query'); } },
      { label: 'glossary',  action: async (page) => { await gotoAfterLogin(page, 'https://nlsql-pro.vercel.app/glossary'); } },
      { label: 'history',   action: async (page) => { await gotoAfterLogin(page, 'https://nlsql-pro.vercel.app/history'); } },
    ],
  },
  {
    id: 'concept-forge',
    url: 'https://concept-forge-iota.vercel.app',
    name: 'ConceptForge',
    shots: [
      { label: 'landing',   action: async (page) => { await page.goto('https://concept-forge-iota.vercel.app', { waitUntil: 'networkidle', timeout: 30000 }); } },
      { label: 'dashboard', action: async (page) => { await gotoAfterLogin(page, 'https://concept-forge-iota.vercel.app/dashboard'); } },
      { label: 'practice',  action: async (page) => { await gotoAfterLogin(page, 'https://concept-forge-iota.vercel.app/practice'); } },
      { label: 'mastery',   action: async (page) => { await gotoAfterLogin(page, 'https://concept-forge-iota.vercel.app/mastery'); } },
      { label: 'subjects',  action: async (page) => { await gotoAfterLogin(page, 'https://concept-forge-iota.vercel.app/subjects'); } },
    ],
  },
];

// ── Auth helpers ─────────────────────────────────────────────────────────────

async function tryLogin(page, baseUrl) {
  const loginSelectors = [
    'a[href*="login"]', 'a[href*="signin"]', 'a[href*="sign-in"]',
    'button:has-text("Sign in")', 'button:has-text("Log in")',
    'button:has-text("Get Started")', 'a:has-text("Sign in")',
    'a:has-text("Login")', 'a:has-text("Log in")',
  ];

  // Click login/signin link if present
  for (const sel of loginSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.click();
        await page.waitForTimeout(2000);
        break;
      }
    } catch {}
  }

  // Try email + password form
  const emailInputs = ['input[type="email"]', 'input[name="email"]', 'input[placeholder*="email" i]'];
  for (const sel of emailInputs) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.fill(EMAIL);
        // Try password field
        const pwSel = ['input[type="password"]', 'input[name="password"]'];
        for (const ps of pwSel) {
          try {
            const pw = page.locator(ps).first();
            if (await pw.isVisible({ timeout: 2000 })) {
              await pw.fill(PASS);
              break;
            }
          } catch {}
        }
        // Submit
        const submitSel = ['button[type="submit"]', 'button:has-text("Sign in")', 'button:has-text("Log in")', 'button:has-text("Continue")'];
        for (const ss of submitSel) {
          try {
            const sub = page.locator(ss).first();
            if (await sub.isVisible({ timeout: 2000 })) {
              await sub.click();
              await page.waitForTimeout(3000);
              break;
            }
          } catch {}
        }
        break;
      }
    } catch {}
  }

  await page.waitForTimeout(2000);
}

let loggedInUrls = new Set();

async function gotoAfterLogin(page, url) {
  const base = new URL(url).origin;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);

  // If redirected to auth page, try to login
  const currentUrl = page.url();
  if (
    currentUrl.includes('login') ||
    currentUrl.includes('signin') ||
    currentUrl.includes('auth') ||
    currentUrl.includes('sign-in')
  ) {
    await tryLogin(page, base);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
  }
}

// ── Screenshot helpers ────────────────────────────────────────────────────────

async function scrollAndShot(page, outPath) {
  // Dismiss cookie banners / modals
  const dismissSel = [
    'button:has-text("Accept")', 'button:has-text("OK")', 'button:has-text("Got it")',
    'button:has-text("Close")', '[aria-label="Close"]',
  ];
  for (const sel of dismissSel) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 800 })) await el.click();
    } catch {}
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`  ✓ ${outPath}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: CHROMIUM_PATH });

  for (const app of APPS) {
    const appDir = join(SHOTS_DIR, app.id);
    mkdirSync(appDir, { recursive: true });

    console.log(`\n▶ ${app.name} (${app.url})`);
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
    });
    const page = await ctx.newPage();

    // Land on home and try login first
    try {
      await page.goto(app.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);
      await tryLogin(page, app.url);
    } catch (e) {
      console.log(`  ! login attempt error: ${e.message}`);
    }

    // Capture each shot
    for (const shot of app.shots) {
      try {
        await shot.action(page);
        const outPath = join(appDir, `${shot.label}.png`);
        await scrollAndShot(page, outPath);
      } catch (e) {
        console.log(`  ✗ ${shot.label}: ${e.message}`);
      }
    }

    await ctx.close();
  }

  await browser.close();
  console.log('\n✅ All screenshots done. Check public/screenshots/');
}

run().catch(console.error);
