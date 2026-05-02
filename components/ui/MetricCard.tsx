'use client';
// components/ui/MetricCard.tsx
import { useState } from 'react';
import type { MetricResult } from '@/lib/metrics';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  data: MetricResult;
  icon: string;
  description: string;
  benchmark: string;
}

const statusStyles = {
  good: {
    border: 'var(--accent-green)',
    badge: { bg: 'var(--accent-green-light)', text: 'var(--accent-green)' },
    glow: 'rgba(16, 185, 129, 0.08)',
    label: 'On Track',
  },
  warning: {
    border: 'var(--accent-amber)',
    badge: { bg: 'var(--accent-amber-light)', text: 'var(--accent-amber)' },
    glow: 'rgba(245, 158, 11, 0.08)',
    label: 'Watch',
  },
  critical: {
    border: 'var(--accent-red)',
    badge: { bg: 'var(--accent-red-light)', text: 'var(--accent-red)' },
    glow: 'rgba(239, 68, 68, 0.08)',
    label: 'Action Needed',
  },
};

export default function MetricCard({ data, icon, description, benchmark }: Props) {
  const [hovered, setHovered] = useState(false);
  const cfg = statusStyles[data.status];

  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  // For lead time/cycle time/bug rate: down = good. For deploy freq/PR throughput: up = good.
  const isPositiveTrend =
    ['Deployment Frequency', 'PR Throughput'].includes(data.label)
      ? data.trend === 'up'
      : data.trend === 'down';

  const trendColor = isPositiveTrend
    ? 'var(--accent-green)'
    : data.trend === 'stable'
    ? 'var(--text-tertiary)'
    : 'var(--accent-red)';

  return (
    <div
      className="rounded-2xl p-5 cursor-default transition-all duration-200 relative overflow-hidden"
      style={{
        backgroundColor: hovered ? cfg.glow : 'var(--bg-surface)',
        border: `1px solid ${hovered ? cfg.border : 'var(--border)'}`,
        boxShadow: hovered ? `0 4px 20px ${cfg.glow}, var(--shadow-sm)` : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Status stripe at top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-opacity duration-200"
        style={{ backgroundColor: cfg.border, opacity: hovered ? 1 : 0.4 }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{icon}</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: cfg.badge.bg, color: cfg.badge.text }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Value */}
      <div className="mb-1">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
        >
          {data.value}
        </span>
        <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>
          {data.unit}
        </span>
      </div>

      {/* Label */}
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
        {data.label}
      </p>

      {/* Trend */}
      <div className="flex items-center gap-1 mb-3">
        <TrendIcon size={12} style={{ color: trendColor }} />
        <span className="text-xs font-medium" style={{ color: trendColor, fontFamily: 'var(--font-mono)' }}>
          {data.trendValue > 0 ? '+' : ''}{data.trendValue}%
        </span>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>vs last 30d</span>
      </div>

      {/* Divider */}
      <div className="h-px mb-3" style={{ backgroundColor: 'var(--border)' }} />

      {/* Description + Benchmark */}
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
        {description}
      </p>
      <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Target: {benchmark}
      </p>

      {/* Hover: detail tooltip */}
      {hovered && (
        <div
          className="mt-3 p-2 rounded-lg text-xs"
          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}
        >
          {data.details}
        </div>
      )}
    </div>
  );
}
