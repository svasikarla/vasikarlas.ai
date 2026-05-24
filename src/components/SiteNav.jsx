'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { WeatherSunnyRegular, WeatherMoonRegular, SearchRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalXL}`,
    backgroundColor: 'color-mix(in oklab, var(--bg) 80%, transparent)',
    backdropFilter: 'blur(14px)',
    borderBottom: '1px solid var(--line)',
    fontFamily: 'var(--f-sans)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--f-mono)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: 'var(--fg)',
    textDecoration: 'none',
    textTransform: 'uppercase',
  },
  brandDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent)',
  },
  brandSub: { color: 'var(--fg-3)' },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    marginLeft: tokens.spacingHorizontalXL,
  },
  navLink: {
    fontFamily: 'var(--f-sans)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--fg-2)',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'color 0.15s ease, background 0.15s ease',
    ':hover': {
      color: 'var(--fg)',
      backgroundColor: 'var(--bg-1)',
    },
  },
  navLinkActive: {
    color: 'var(--fg)',
    backgroundColor: 'var(--bg-1)',
  },
  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  iconBtn: {
    minWidth: '32px',
    height: '32px',
    padding: 0,
  },
});

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export default function SiteNav() {
  const styles = useStyles();
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('vsk.theme', next); } catch {}
    setTheme(next);
  };

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className={styles.root}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandDot} aria-hidden />
        VASIKARLA<span className={styles.brandSub}>·AI</span>
      </Link>
      <nav className={styles.nav} aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.right}>
        <Button
          appearance="subtle"
          size="small"
          icon={<SearchRegular />}
          aria-label="Search projects"
          as="a"
          {...{ href: '/projects' }}
        >
          Search
        </Button>
        <Button
          appearance="subtle"
          size="small"
          aria-label="Toggle theme"
          className={styles.iconBtn}
          icon={mounted && theme === 'dark' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
          onClick={toggleTheme}
        />
        <Button appearance="primary" size="small" as="a" {...{ href: '/about#contact' }}>
          Contact
        </Button>
      </div>
    </header>
  );
}
