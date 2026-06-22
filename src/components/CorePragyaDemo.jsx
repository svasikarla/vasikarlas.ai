'use client';

import React, { useState, useTransition } from 'react';
import { SparkleRegular, BranchRegular } from '@fluentui/react-icons';
import { generateContent } from '@/actions/corepragya';
import { CP_EXAMPLES } from '@/data/corePragyaDemo';

const PROVIDERS = [
  { id: 'claude', label: 'Claude', env: 'ANTHROPIC_API_KEY' },
  { id: 'groq', label: 'GROQ', env: 'GROQ_API_KEY' },
];

const ERRORS = {
  empty: 'Type an idea first.',
  too_long: 'Keep it under 240 characters.',
  refused: 'The model declined that request. Try another idea.',
  busy: 'The model is busy right now — give it a few seconds and try again.',
  failed: 'Something went wrong. Try again.',
};

export default function CorePragyaDemo() {
  const [q, setQ] = useState('');
  const [provider, setProvider] = useState('claude');
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();

  const active = PROVIDERS.find((p) => p.id === provider);
  const errorText = (code) =>
    code === 'unconfigured'
      ? `Live demo is offline — set ${active.env} to enable ${active.label}.`
      : ERRORS[code] || ERRORS.failed;

  const run = (text) => {
    const idea = (text ?? q).trim();
    if (!idea || pending) return;
    if (text != null) setQ(text);
    setResult(null);
    startTransition(async () => setResult(await generateContent(idea, provider)));
  };

  const selectProvider = (id) => {
    if (id === provider || pending) return;
    setProvider(id);
    setResult(null);
  };

  return (
    <div className="demo-widget">
      <div className="demo-head">
        <span className="demo-badge"><BranchRegular style={{ fontSize: 13 }} /> Live · Content Studio</span>
        <span className="demo-sub">One idea → platform-native posts, by {active.label}.</span>
      </div>

      <div className="demo-providers" role="group" aria-label="Model provider">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`demo-provider${p.id === provider ? ' is-active' : ''}`}
            aria-pressed={p.id === provider}
            onClick={() => selectProvider(p.id)}
            disabled={pending}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form className="demo-input" onSubmit={(e) => { e.preventDefault(); run(); }}>
        <SparkleRegular style={{ fontSize: 15, flexShrink: 0, opacity: 0.6 }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. Why RAG beats fine-tuning"
          maxLength={240}
          aria-label="Content idea"
        />
        <button type="submit" disabled={pending || !q.trim()}>{pending ? '…' : 'Adapt'}</button>
      </form>

      <div className="demo-examples">
        {CP_EXAMPLES.map((ex) => (
          <button key={ex} type="button" className="demo-chip" onClick={() => run(ex)} disabled={pending}>{ex}</button>
        ))}
      </div>

      <div className="demo-output">
        {pending && <div className="demo-status">Adapting across platforms with {active.label}…</div>}
        {!pending && result?.error && <div className="demo-status demo-error">{errorText(result.error)}</div>}
        {!pending && result?.ok === false && <div className="demo-status">{result.note}</div>}
        {!pending && result?.ok && (
          <div className="cp-formats">
            {result.formats.map((f, i) => (
              <div key={i} className="cp-format">
                <span className="cp-platform">{f.platform}</span>
                <p className="cp-content">{f.content}</p>
              </div>
            ))}
          </div>
        )}
        {!pending && !result && (
          <p className="demo-hint">Curator · Research · Studio — this is the Studio agent, live.</p>
        )}
      </div>
    </div>
  );
}
