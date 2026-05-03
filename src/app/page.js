"use client";

import React, { useState, useEffect } from 'react';
import V3 from '@/components/V3';
import V4 from '@/components/V4';
import { TickerStrip } from '@/components/V1';

const TWEAKS = {
  variation: "v4",
  theme: "dark",
  accentHue: 235,
  motion: true
};

function loadPref(k, fallback) {
  try { return localStorage.getItem('vsk.' + k) || fallback; } catch { return fallback; }
}
function savePref(k, v) {
  try { localStorage.setItem('vsk.' + k, v); } catch {}
}

function Cmdbar({ variation, setVariation, theme, setTheme, openTweaks }) {
  return (
    <div className="cmdbar">
      <div className="brand"><span className="dot" />VASIKARLA<span style={{color:'var(--fg-3)'}}>·AI</span></div>
      <div className="sep" />
      <TickerStrip />
      <div className="right">
        <div className="seg">
          <button aria-pressed={variation==='v4'} onClick={() => setVariation('v4')}>V4 Hybrid ★</button>
          <button aria-pressed={variation==='v3'} onClick={() => setVariation('v3')}>V3 Console</button>
        </div>
        <button className="icon-btn" aria-label="toggle theme" onClick={() => setTheme(theme==='dark'?'light':'dark')}>
          {theme === 'dark'
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
        </button>
      </div>
    </div>
  );
}

const ACCENTS = [
  { h: 145, name: 'mint' },
  { h: 235, name: 'azure' },
  { h: 65, name: 'amber' },
  { h: 20, name: 'coral' },
  { h: 300, name: 'magenta' },
];

function TweaksPanel({ open, setOpen, variation, setVariation, theme, setTheme, accentHue, setAccentHue, motion, setMotion }) {
  return (
    <div className="tweaks" data-open={open}>
      <div className="tweaks-head">
        <b>Tweaks</b>
        <span style={{cursor:'pointer'}} onClick={() => setOpen(false)}>×</span>
      </div>
      <div className="tweaks-body">
        <div className="tweak-row">
          <label>Variation</label>
          <div style={{display:'flex', gap:4}}>
            {['v4','v3'].map(v => (
              <button key={v} className="slim" aria-pressed={variation===v} onClick={() => setVariation(v)}>{v.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div className="tweak-row">
          <label>Theme</label>
          <div style={{display:'flex', gap:4}}>
            <button className="slim" aria-pressed={theme==='dark'} onClick={() => setTheme('dark')}>Dark</button>
            <button className="slim" aria-pressed={theme==='light'} onClick={() => setTheme('light')}>Light</button>
          </div>
        </div>
        <div className="tweak-row">
          <label>Accent</label>
          <div className="swatches">
            {ACCENTS.map(a => (
              <div key={a.h}
                className="swatch"
                aria-pressed={accentHue===a.h}
                style={{ background: `oklch(0.72 0.17 ${a.h})` }}
                onClick={() => setAccentHue(a.h)} />
            ))}
          </div>
        </div>
        <div className="tweak-row">
          <label>Motion</label>
          <div style={{display:'flex', gap:4}}>
            <button className="slim" aria-pressed={motion} onClick={() => setMotion(true)}>On</button>
            <button className="slim" aria-pressed={!motion} onClick={() => setMotion(false)}>Off</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [variation, setVariation] = useState(TWEAKS.variation);
  const [theme, setTheme] = useState(TWEAKS.theme);
  const [accentHue, setAccentHue] = useState(TWEAKS.accentHue);
  const [motion, setMotion] = useState(TWEAKS.motion);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    let savedVar = loadPref('variation', TWEAKS.variation);
    if (savedVar === 'v1' || savedVar === 'v2') savedVar = 'v4';
    setVariation(savedVar);
    setTheme(loadPref('theme', TWEAKS.theme));
    setAccentHue(parseInt(loadPref('accentHue', String(TWEAKS.accentHue))));
    setMotion(loadPref('motion', String(TWEAKS.motion)) !== 'false');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.setAttribute('data-theme', theme);
    savePref('theme', theme);
  }, [theme, mounted]);

  useEffect(() => { 
    if (mounted) savePref('variation', variation); 
  }, [variation, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty('--accent-h', accentHue);
    document.documentElement.style.setProperty('--accent', `oklch(0.72 0.17 ${accentHue})`);
    document.documentElement.style.setProperty('--accent-dim', `oklch(0.55 0.13 ${accentHue})`);
    savePref('accentHue', accentHue);
  }, [accentHue, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty('--motion', motion ? '1' : '0');
    if (!motion) {
      const style = document.getElementById('motion-kill') || (() => { const s = document.createElement('style'); s.id = 'motion-kill'; document.head.appendChild(s); return s; })();
      style.textContent = '*, *::before, *::after { animation-duration: 0.001s !important; animation-iteration-count: 1 !important; transition-duration: 0.001s !important; }';
    } else {
      const s = document.getElementById('motion-kill'); if (s) s.textContent = '';
    }
    savePref('motion', motion);
  }, [motion, mounted]);

  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    }
    return () => window.removeEventListener('message', onMsg);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <React.Fragment>
      <div className="grid-bg"></div>
      <div id="cmdbar">
        <Cmdbar variation={variation} setVariation={setVariation} theme={theme} setTheme={setTheme} openTweaks={() => setTweaksOpen(true)} />
      </div>
      <div id="tweaks-root">
        <TweaksPanel
          open={tweaksOpen}
          setOpen={setTweaksOpen}
          variation={variation}
          setVariation={(v) => { setVariation(v); window.parent?.postMessage({type:'__edit_mode_set_keys', edits:{variation:v}}, '*'); }}
          theme={theme}
          setTheme={(t) => { setTheme(t); window.parent?.postMessage({type:'__edit_mode_set_keys', edits:{theme:t}}, '*'); }}
          accentHue={accentHue}
          setAccentHue={(h) => { setAccentHue(h); window.parent?.postMessage({type:'__edit_mode_set_keys', edits:{accentHue:h}}, '*'); }}
          motion={motion}
          setMotion={(m) => { setMotion(m); window.parent?.postMessage({type:'__edit_mode_set_keys', edits:{motion:m}}, '*'); }}
        />
      </div>

      <div id="v3-root" className="variation" data-active={variation === 'v3' ? 'true' : 'false'}>
        <V3 />
      </div>
      <div id="v4-root" className="variation" data-active={variation === 'v4' ? 'true' : 'false'}>
        <V4 />
      </div>
    </React.Fragment>
  );
}
