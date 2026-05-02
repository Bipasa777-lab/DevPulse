'use client';
// components/charts/SparkChart.tsx
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import type { Status } from '@/lib/metrics';

interface Props {
  label: string;
  data: number[];
  unit: string;
  status: Status;
}

const statusColor = {
  good: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
};

export default function SparkChart({ label, data, unit, status }: Props) {
  const chartData = data.map((v, i) => ({ week: `W${i + 1}`, value: v }));
  const color = statusColor[status];
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const delta = prev ? ((latest - prev) / prev * 100).toFixed(0) : '0';
  const isUp = latest >= prev;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <span
          className="text-xs font-medium"
          style={{
            color: isUp ? 'var(--accent-red)' : 'var(--accent-green)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {isUp ? '↑' : '↓'}{Math.abs(Number(delta))}%
        </span>
      </div>

      <div className="h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                padding: '4px 8px',
              }}
              formatter={(v: number) => [`${v}${unit}`, '']}
              labelFormatter={l => `${l}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${label})`}
              dot={false}
              activeDot={{ r: 3, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-xs"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
        >
          W1 → W7
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          {latest}{unit}
        </span>
      </div>
    </div>
  );
}
