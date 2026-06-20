'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollProgress — thin accent bar at the top of the viewport
 * showing how far the user has scrolled down the page.
 *
 * Uses GPU-composited transform: scaleX() for 60fps performance.
 * Hidden when prefers-reduced-motion is active.
 */
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      el.style.transform = `scaleX(${pct})`;
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
