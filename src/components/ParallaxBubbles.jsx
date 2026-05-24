'use client';

import { useEffect, useRef } from 'react';

const BUBBLES = [
  { label: '</>', depth: 0.04 },
  { label: '{}',  depth: 0.07 },
  { label: 'fn()', depth: 0.03 },
  { label: 'NLP', depth: 0.09 },
  { label: 'SQL', depth: 0.05 },
  { label: 'AI',  depth: 0.11 },
  { label: 'git', depth: 0.06 },
  { label: '∑',   depth: 0.08 },
  { label: '→',   depth: 0.04 },
  { label: 'API', depth: 0.07 },
  { label: '≈',   depth: 0.10 },
  { label: 'RAG', depth: 0.05 },
  { label: '⚡',  depth: 0.03 },
  { label: 'LLM', depth: 0.08 },
  { label: '///',  depth: 0.06 },
  { label: '∫',   depth: 0.09 },
];

// Deterministic positions — avoids hydration mismatch from Math.random()
const POSITIONS = [
  { x:  8, y: 15 }, { x: 18, y: 72 }, { x: 28, y: 38 },
  { x: 38, y: 85 }, { x: 52, y: 12 }, { x: 62, y: 58 },
  { x: 72, y: 28 }, { x: 82, y: 78 }, { x: 90, y: 45 },
  { x: 14, y: 55 }, { x: 46, y: 92 }, { x: 76, y: 92 },
  { x: 95, y: 18 }, { x: 35, y: 62 }, { x: 55, y: 45 },
  { x: 68, y: 68 },
];

export default function ParallaxBubbles() {
  const containerRef = useRef(null);
  const bubbleRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 0, ty = 0;
    let cx = 0, cy = 0;
    let raf;

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      tx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      ty = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    };

    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      bubbleRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = BUBBLES[i].depth;
        el.style.transform = `translate(calc(-50% + ${cx * d * 60}px), calc(-50% + ${cy * d * 60}px))`;
      });
      raf = requestAnimationFrame(tick);
    };

    container.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="parallax-bubbles" aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={b.label + i}
          ref={el => { bubbleRefs.current[i] = el; }}
          className="bubble"
          style={{ left: `${POSITIONS[i].x}%`, top: `${POSITIONS[i].y}%` }}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}
