'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  Divider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  WeatherSunnyRegular,
  WeatherMoonRegular,
  SearchRegular,
  NavigationRegular,
  DismissRegular,
} from '@fluentui/react-icons';

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
    flexShrink: 0,
  },
  brandDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent)',
  },
  brandSub: { color: 'var(--fg-3)' },
  navDesktop: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    marginLeft: tokens.spacingHorizontalXL,
    '@media (max-width: 768px)': {
      display: 'none',
    },
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
  searchBtnDesktop: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  contactBtnDesktop: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  hamburger: {
    display: 'none',
    minWidth: '36px',
    height: '36px',
    padding: 0,
    '@media (max-width: 768px)': {
      display: 'inline-flex',
    },
  },
  drawerNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    marginTop: tokens.spacingVerticalM,
  },
  drawerLink: {
    fontFamily: 'var(--f-sans)',
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--fg-2)',
    padding: '12px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'color 0.15s ease, background 0.15s ease',
    ':hover': {
      color: 'var(--fg)',
      backgroundColor: 'var(--bg-1)',
    },
  },
  drawerLinkActive: {
    color: 'var(--fg)',
    backgroundColor: 'var(--bg-1)',
  },
  drawerCta: {
    marginTop: tokens.spacingVerticalL,
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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
    <>
      <header className={styles.root}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandDot} aria-hidden />
          VASIKARLA<span className={styles.brandSub}>·AI</span>
        </Link>
        <nav className={styles.navDesktop} aria-label="Primary">
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
            className={styles.searchBtnDesktop}
            {...{ href: '/projects' }}
          >
            Search
          </Button>
          <Button
            appearance="subtle"
            size="small"
            aria-label="Toggle theme"
            icon={mounted && theme === 'dark' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
            onClick={toggleTheme}
          />
          <Button
            appearance="primary"
            size="small"
            as="a"
            className={styles.contactBtnDesktop}
            {...{ href: '/about#contact' }}
          >
            Contact
          </Button>
          <Button
            appearance="subtle"
            aria-label="Open menu"
            icon={<NavigationRegular />}
            className={styles.hamburger}
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </header>

      <Drawer
        open={drawerOpen}
        onOpenChange={(_, { open }) => setDrawerOpen(open)}
        position="end"
        size="small"
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close menu"
                icon={<DismissRegular />}
                onClick={() => setDrawerOpen(false)}
              />
            }
          >
            Menu
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav className={styles.drawerNav} aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.drawerLink} ${isActive(item.href) ? styles.drawerLinkActive : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Divider style={{ margin: '16px 0' }} />
          <Button
            appearance="primary"
            size="medium"
            as="a"
            className={styles.drawerCta}
            {...{ href: '/about#contact' }}
            onClick={() => setDrawerOpen(false)}
            style={{ width: '100%' }}
          >
            Contact
          </Button>
          <Button
            appearance="subtle"
            size="medium"
            as="a"
            {...{ href: '/projects' }}
            onClick={() => setDrawerOpen(false)}
            style={{ width: '100%', marginTop: '8px' }}
            icon={<SearchRegular />}
          >
            Search projects
          </Button>
        </DrawerBody>
      </Drawer>
    </>
  );
}
