'use client';

import React, { useEffect, useState } from 'react';
import { FluentProvider, createDarkTheme, createLightTheme } from '@fluentui/react-components';

/**
 * Bridges our oklch accent + dark-glassmorphic identity into Fluent UI v9.
 *
 * Strategy:
 * - Fluent BrandVariants ramp is generated from the current --accent-h oklch hue
 *   so Fluent components (Button, Tab, Badge, etc.) pick up our brand color.
 * - Fluent theme overrides remap colorNeutralBackground/Foreground tokens to our
 *   existing CSS vars (--bg, --bg-1, --fg, --fg-2, --line) so Fluent surfaces
 *   blend with our custom sections instead of looking pasted on.
 */

function buildBrandRamp(hue) {
  // 16-stop ramp from light tint → deep shade using the active accent hue.
  // Approximate mapping from oklch lightness/chroma to hex via a fixed table.
  const stops = [
    [97, 0.02], [94, 0.04], [88, 0.06], [82, 0.08],
    [76, 0.10], [70, 0.12], [64, 0.14], [58, 0.15],
    [52, 0.16], [46, 0.16], [40, 0.15], [34, 0.13],
    [28, 0.11], [22, 0.09], [16, 0.07], [10, 0.05],
  ];
  const ramp = {};
  const keys = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160];
  stops.forEach(([L, C], i) => {
    ramp[keys[i]] = `oklch(${L / 100} ${C} ${hue})`;
  });
  return ramp;
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const compute = () => {
      const html = document.documentElement;
      const mode = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const hue = parseInt(html.style.getPropertyValue('--accent-h') || '258', 10);
      const brand = buildBrandRamp(hue);
      const base = mode === 'light' ? createLightTheme(brand) : createDarkTheme(brand);
      // Override neutral surface tokens to our CSS variables so Fluent surfaces
      // inherit the existing dark-glassmorphic look.
      const bridged = {
        ...base,
        colorNeutralBackground1: 'var(--bg)',
        colorNeutralBackground2: 'var(--bg-1)',
        colorNeutralBackground3: 'var(--bg-2)',
        colorNeutralBackground4: 'var(--bg-3)',
        colorNeutralForeground1: 'var(--fg)',
        colorNeutralForeground2: 'var(--fg-2)',
        colorNeutralForeground3: 'var(--fg-3)',
        colorNeutralForeground4: 'var(--fg-4)',
        colorNeutralStroke1: 'var(--line)',
        colorNeutralStroke2: 'var(--line-soft, var(--line))',
        fontFamilyBase: 'var(--f-sans)',
        fontFamilyMonospace: 'var(--f-mono)',
      };
      setTheme(bridged);
    };
    compute();
    const observer = new MutationObserver(compute);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    return () => observer.disconnect();
  }, []);

  if (!theme) return <>{children}</>;
  return <FluentProvider theme={theme}>{children}</FluentProvider>;
}
