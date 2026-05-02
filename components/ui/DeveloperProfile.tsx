'use client';
// components/ui/DeveloperProfile.tsx
import type { MetricsSummary } from '@/lib/metrics';
import { GitPullRequest, Bug, Rocket, Calendar } from 'lucide-react';

interface Props {
  developer: { name: string; role: string; team: string; avatar: string; joinDate: string };
  metrics: MetricsSummary;
}

export default function DeveloperProfile({ developer, metrics }: Props) {
  const stats = [
    { icon: <GitPullRequest size={14} />, label: 'PRs Merged', value: metrics.raw.mergedPRs },
    { icon: <Bug size={14} />, label: 'Bugs Fixed', value: metrics.raw.totalBugs },
    { icon: <Rocket size={14} />, label: 'Deployments', value: metrics.raw.totalDeployments },
    { icon: <Calendar size={14} />, label: 'Issues', value: metrics.raw.totalIssues },
  ];

  return (
    <div
      className="flex-1 rounded-2xl p-6"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-start gap-4 mb-5">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1d6fb8 0%, #8b5cf6 100%)' }}
        >
          {developer.avatar}
        </div>

        <div>
          <h1
            className="text-xl font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {developer.name}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {developer.role}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}
            >
              {developer.team}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)' }}
            >
              ● Active
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-xl p-3 text-center"
            style={{ backgroundColor: 'var(--bg-surface-2)' }}
          >
            <div
              className="flex items-center justify-center mb-1"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {s.icon}
            </div>
            <div
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
            >
              {s.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
