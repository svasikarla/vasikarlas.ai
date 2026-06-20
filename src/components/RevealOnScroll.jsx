'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * RevealOnScroll — lightweight scroll-triggered reveal wrapper.
 *
 * Uses IntersectionObserver to fade/slide children into view once.
 * - direction: 'up' | 'left' | 'right' (default 'up')
 * - delay: ms to add as transition-delay (for staggered reveals)
 * - className: additional classes to merge onto the wrapper
 * - as: HTML element tag (default 'div')
 *
 * Respects prefers-reduced-motion — shows content immediately.
 */
export default function RevealOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // One-shot — don't re-hide
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dirClass = `dir-${direction}`;

  return (
    <Tag
      ref={ref}
      className={`reveal ${dirClass} ${visible ? 'reveal-visible' : ''} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
