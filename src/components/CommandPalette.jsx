'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROJECTS } from '@/data/projects';

export const OPEN_PALETTE_EVENT = 'vsk:open-palette';

const PAGES = [
  { id: 'page-home', name: 'Home', hint: 'Page', href: '/' },
  { id: 'page-work', name: 'Work', hint: 'Page', href: '/work' },
  { id: 'page-about', name: 'About & contact', hint: 'Page', href: '/about' },
];

const ITEMS = [
  ...PROJECTS.map((p) => ({
    id: p.id,
    name: p.name,
    hint: p.domain,
    href: `/work/${p.id}`,
    text: `${p.name} ${p.tagline} ${p.domain} ${p.stack.join(' ')}`.toLowerCase(),
  })),
  ...PAGES.map((p) => ({ ...p, text: p.name.toLowerCase() })),
];

/* Global ⌘K / Ctrl+K search. Mounted once in the root layout; the nav's
   Search button opens it by dispatching OPEN_PALETTE_EVENT. */
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const show = () => { setQ(''); setIdx(0); setOpen(true); };
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => { if (!v) { setQ(''); setIdx(0); } return !v; });
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const needle = q.trim().toLowerCase();
  const results = (needle ? ITEMS.filter((i) => i.text.includes(needle)) : ITEMS).slice(0, 8);

  const go = (item) => {
    setOpen(false);
    router.push(item.href);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter' && results[idx]) go(results[idx]);
  };

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search projects" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search projects and pages…"
            aria-label="Search projects and pages"
          />
          <kbd>ESC</kbd>
        </div>
        <div className="cmdk-list" role="listbox">
          {results.length === 0 && <div className="cmdk-empty">No matches</div>}
          {results.map((item, i) => (
            <div
              key={item.id}
              role="option"
              aria-selected={i === idx}
              className={`cmdk-row ${i === idx ? 'sel' : ''}`}
              onMouseEnter={() => setIdx(i)}
              onClick={() => go(item)}
            >
              <div className="cmdk-name">
                {item.name}
                <span className="cmdk-cat">{item.hint}</span>
              </div>
              <div className="cmdk-meta">Open →</div>
            </div>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>⌘K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}
