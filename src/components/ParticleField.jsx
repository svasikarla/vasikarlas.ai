'use client';

import { useEffect, useRef } from 'react';

const COUNT = 22;

function makeParticle(w, h) {
  return {
    x:            Math.random() * w,
    y:            Math.random() * h,
    r:            0.8 + Math.random() * 1.4,
    speed:        0.12 + Math.random() * 0.25,
    alpha:        0.12 + Math.random() * 0.22,
    depth:        0.008 + Math.random() * 0.035,
    wobbleAmp:    0.4 + Math.random() * 0.8,
    wobbleOffset: Math.random() * Math.PI * 2,
    wobbleSpeed:  0.004 + Math.random() * 0.006,
  };
}

function resolveAccent() {
  // Read --accent as a real rgb() value canvas can use
  const div = document.createElement('div');
  div.style.cssText = 'position:absolute;visibility:hidden;color:var(--accent)';
  document.body.appendChild(div);
  const color = getComputedStyle(div).color;
  document.body.removeChild(div);
  return color || 'rgb(120, 100, 220)';
}

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.v4-hero');

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    let particles = Array.from({ length: COUNT }, () => makeParticle(w, h));
    let accent = resolveAccent();
    let mx = 0, my = 0;
    let t = 0;
    let raf;

    // Refresh accent when theme or hue changes
    const observer = new MutationObserver(() => { accent = resolveAccent(); });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    });

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left - w / 2) / (w / 2);
      my = (e.clientY - rect.top  - h / 2) / (h / 2);
    };

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
      particles = Array.from({ length: COUNT }, () => makeParticle(w, h));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t++;

      for (const p of particles) {
        p.y -= p.speed;
        if (p.y + p.r < 0) { p.y = h + p.r; p.x = Math.random() * w; }

        const px = p.x + mx * p.depth * 80 + Math.sin(t * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp;
        const py = p.y + my * p.depth * 80;

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    (hero || canvas.parentElement)?.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(draw);

    return () => {
      (hero || canvas.parentElement)?.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
