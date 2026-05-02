'use client';
// components/ui/HealthScore.tsx
import { useEffect, useState } from 'react';

interface Props {
  score: number;
  health: 'healthy' | 'needs-attention' | 'at-risk';
  summary: string;
}

const healthConfig = {
  healthy: { label: 'Healthy', color: '#10b981', bg: 'var(--accent-green-light)', text: 'var(--accent-green)' },
  'needs-attention': { label: 'Needs Attention', color: '#f59e0b', bg: 'var(--accent-amber-light)', text: 'var(--accent-amber)' },
  'at-risk': { label: 'At Risk', color: '#ef4444', bg: 'var(--accent-red-light)', text: 'var(--accent-red)' },
};

export default function HealthScore({ score, health, summary }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const cfg = healthConfig[health];

  // Animate the score counter
  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const duration = 1200;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div
      className="lg:w-72 rounded-2xl p-6 flex flex-col"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Health Score
        </h2>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: cfg.bg, color: cfg.text }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Radial progress */}
      <div className="flex items-center gap-5 mb-4">
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" className="-rotate-90">
            {/* Track */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-surface-3)" strokeWidth="8" />
            {/* Progress */}
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={cfg.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-2xl font-bold leading-none"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
            >
              {displayScore}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>/100</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {summary}
          </p>
        </div>
      </div>

      {/* Score bar breakdown */}
      <div
        className="mt-auto pt-4 text-xs"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
      >
        DORA benchmark: {score >= 75 ? 'High Performer' : score >= 45 ? 'Medium Performer' : 'Low Performer'}
      </div>
    </div>
  );
}
