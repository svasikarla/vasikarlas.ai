'use client';

import React, { useEffect, useRef } from 'react';

export default function VectorConstellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let tx = width / 2;
    let ty = height / 2;
    let cx = tx;
    let cy = ty;
    let active = false;
    let raf;
    let anchors = [];
    let lastScan = 0;

    // Scan DOM for interactive anchors (cards, buttons, tags, headers)
    const scanAnchors = () => {
      const els = document.querySelectorAll(
        '.flagship-card, .problem-card, .archive-card, .skill-chip, .spec-chip, .btn-primary, .btn-ghost, .section-header h2'
      );
      const list = [];
      const vWidth = window.innerWidth;
      const vHeight = window.innerHeight;

      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (
          rect.bottom > 0 &&
          rect.top < vHeight &&
          rect.right > 0 &&
          rect.left < vWidth
        ) {
          list.push({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            label: el.classList.contains('flagship-card')
              ? 'k-NN :: flagship'
              : el.classList.contains('problem-card')
              ? 'k-NN :: problem'
              : el.classList.contains('skill-chip') || el.classList.contains('spec-chip')
              ? 'vec_chip'
              : 'cos_sim',
          });
        }
      });
      anchors = list;
    };

    const onMouseMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) active = true;
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      scanAnchors();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    scanAnchors();

    const maxDist = 340; // Max connection radius (px)
    const maxK = 3;      // Top-k nearest neighbors

    const render = (now) => {
      // Periodically refresh anchor bounds every 800ms
      if (now - lastScan > 800) {
        scanAnchors();
        lastScan = now;
      }

      ctx.clearRect(0, 0, width, height);

      if (active) {
        // Smooth lerp physics
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;

        // Calculate distances to all visible anchors
        const candidates = [];
        for (let i = 0; i < anchors.length; i++) {
          const a = anchors[i];
          const dx = a.x - cx;
          const dy = a.y - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const similarity = Math.max(0, (1 - dist / maxDist)).toFixed(2);
            candidates.push({ anchor: a, dist, similarity });
          }
        }

        // Sort by nearest distance and take top-k
        candidates.sort((a, b) => a.dist - b.dist);
        const topK = candidates.slice(0, maxK);

        // Draw cursor node
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#8b7cff';
        ctx.shadowColor = '#8b7cff';
        ctx.shadowBlur = 12;
        ctx.fill();

        // Outer query ring
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139, 124, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Render k-NN Vector Lines & Labels
        topK.forEach((item) => {
          const { anchor, similarity } = item;
          const alpha = parseFloat(similarity) * 0.65;

          // Connection line with gradient
          const grad = ctx.createLinearGradient(cx, cy, anchor.x, anchor.y);
          grad.addColorStop(0, `rgba(139, 124, 255, ${alpha})`);
          grad.addColorStop(1, `rgba(56, 189, 248, ${alpha * 0.4})`);

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(anchor.x, anchor.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]); // Dashed vector line
          ctx.stroke();
          ctx.setLineDash([]); // Reset line dash

          // Anchor target node ring
          ctx.beginPath();
          ctx.arc(anchor.x, anchor.y, 5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.9})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Micro Similarity Label near midpoint
          const midX = (cx + anchor.x) / 2;
          const midY = (cy + anchor.y) / 2;

          ctx.font = '500 10px monospace';
          ctx.fillStyle = `rgba(226, 232, 240, ${alpha * 0.9})`;
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(`cos_θ: ${similarity}`, midX + 6, midY - 6);
        });

        // Query node label
        ctx.font = '600 10px monospace';
        ctx.fillStyle = 'rgba(139, 124, 255, 0.85)';
        ctx.fillText(`v_query [${Math.round(cx)}, ${Math.round(cy)}]`, cx + 16, cy + 4);
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="vector-constellation-canvas" aria-hidden="true" />;
}
