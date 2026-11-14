'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { OPEN_PALETTE_EVENT } from './CommandPalette';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
];

/* The theme lives on <html data-theme>, set before first paint by the inline
   script in the root layout. Subscribing to it keeps this component in sync
   without setting state in an effect. */
function subscribeTheme(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';
const getServerTheme = () => 'dark';

function Icon({ d }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  search: 'M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z',
  sun: 'M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
};

export default function SiteNav() {
  const pathname = usePathname();
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('vsk.theme', next); } catch {}
  };

  const openSearch = () => {
    setMenuOpen(false);
    window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
  };

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="site-nav">
      <div className="site-nav-bar">
        <Link href="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          <span className="site-brand-dot" aria-hidden="true" />
          VASIKARLA<span className="site-brand-sub">·AI</span>
        </Link>

        <nav className="site-nav-links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav-link ${isActive(item.href) ? 'active' : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-nav-right">
          <button type="button" className="site-nav-btn site-nav-search" onClick={openSearch} aria-label="Search projects">
            <Icon d={ICONS.search} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <button type="button" className="site-nav-btn" onClick={toggleTheme} aria-label="Toggle colour theme">
            <Icon d={theme === 'dark' ? ICONS.sun : ICONS.moon} />
          </button>
          <Link href="/about#contact" className="btn-primary small site-nav-contact">Contact</Link>
          <button
            type="button"
            className="site-nav-btn site-nav-menu"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-nav-drawer"
          >
            <Icon d={menuOpen ? ICONS.close : ICONS.menu} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="site-nav-drawer" className="site-nav-drawer" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav-link ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button type="button" className="site-nav-link" onClick={openSearch}>Search projects</button>
          <Link href="/about#contact" className="btn-primary" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>
      )}
    </header>
  );
}
