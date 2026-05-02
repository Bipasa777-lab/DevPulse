'use client';
// components/panels/ActionPanel.tsx
import type { Action } from '@/lib/insights';

interface Props {
  actions: Action[];
  expanded?: boolean;
}

const effortColors = {
  low: { bg: 'var(--accent-green-light)', text: 'var(--accent-green)' },
  medium: { bg: 'var(--accent-amber-light)', text: 'var(--accent-amber)' },
  high: { bg: 'var(--accent-red-light)', text: 'var(--accent-red)' },
};

const impactColors = {
  low: { bg: 'var(--bg-surface-2)', text: 'var(--text-tertiary)' },
  medium: { bg: 'var(--accent-blue-light)', text: 'var(--accent-blue)' },
  high: { bg: 'var(--accent-green-light)', text: 'var(--accent-green)' },
};

const categoryIcon = {
  process: '📋',
  technical: '⚙️',
  collaboration: '🤝',
};

export default function ActionPanel({ actions, expanded = false }: Props) {
  const displayActions = expanded ? actions : actions.slice(0, 2);

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
            Recommended Actions
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Practical improvements for this sprint
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {displayActions.map((action, idx) => (
          <div
            key={action.id}
            className="rounded-xl p-4 group"
            style={{ backgroundColor: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}
          >
            {/* Priority badge */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="text-xs font-bold"
                style={{
                  color: idx === 0 ? 'var(--accent-amber)' : 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {idx === 0 ? '⭐ Priority 1' : `Priority ${idx + 1}`}
              </span>
              <span className="text-xs">{categoryIcon[action.category]}</span>
              <span
                className="text-xs capitalize px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: effortColors[action.effort].bg, color: effortColors[action.effort].text }}
              >
                {action.effort} effort
              </span>
              <span
                className="text-xs capitalize px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: impactColors[action.impact].bg, color: impactColors[action.impact].text }}
              >
                {action.impact} impact
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-sm font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {action.title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              {action.description}
            </p>

            {/* Linked metrics */}
            <div className="flex flex-wrap gap-1.5">
              {action.linkedMetrics.map(m => (
                <span
                  key={m}
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-tertiary)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!expanded && actions.length > 2 && (
        <p className="text-xs text-center mt-3" style={{ color: 'var(--text-tertiary)' }}>
          + {actions.length - 2} more actions in Insights tab
        </p>
      )}
    </div>
  );
}
