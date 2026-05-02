'use client';
// components/panels/InsightPanel.tsx
import { useState } from 'react';
import type { Insight } from '@/lib/insights';

interface Props {
  insights: Insight[];
}

const severityConfig = {
  info: {
    border: 'var(--accent-blue)',
    bg: 'var(--accent-blue-light)',
    text: 'var(--accent-blue)',
    label: 'Info',
    dot: '#60a5fa',
  },
  warning: {
    border: 'var(--accent-amber)',
    bg: 'var(--accent-amber-light)',
    text: 'var(--accent-amber)',
    label: 'Warning',
    dot: '#f59e0b',
  },
  critical: {
    border: 'var(--accent-red)',
    bg: 'var(--accent-red-light)',
    text: 'var(--accent-red)',
    label: 'Critical',
    dot: '#ef4444',
  },
};

export default function InsightPanel({ insights }: Props) {
  const [expanded, setExpanded] = useState<string | null>(insights[0]?.id ?? null);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            AI Insights
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            What your metrics are telling you
          </p>
        </div>
        <span
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
        >
          {insights.length} signal{insights.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {insights.map(ins => {
          const cfg = severityConfig[ins.severity];
          const isOpen = expanded === ins.id;

          return (
            <div
              key={ins.id}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: `1px solid ${isOpen ? cfg.border : 'var(--border)'}`,
                backgroundColor: isOpen ? 'var(--bg-surface)' : 'var(--bg-surface-2)',
              }}
            >
              {/* Accordion header */}
              <button
                className="w-full flex items-start gap-4 p-4 text-left"
                onClick={() => setExpanded(isOpen ? null : ins.id)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    {ins.icon}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: cfg.bg, color: cfg.text }}
                    >
                      {cfg.label}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                    >
                      {ins.metric}
                    </span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {ins.signal}
                  </p>
                </div>

                <div
                  className="flex-shrink-0 text-xs mt-1 transition-transform duration-200"
                  style={{
                    color: 'var(--text-tertiary)',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}
                >
                  ▼
                </div>
              </button>

              {/* Expanded interpretation */}
              {isOpen && (
                <div
                  className="px-4 pb-4 pt-0"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div className="pt-3">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                    >
                      Interpretation
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {ins.interpretation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
