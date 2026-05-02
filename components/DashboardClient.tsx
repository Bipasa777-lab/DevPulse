'use client';
// components/DashboardClient.tsx
// The main orchestrator for the entire dashboard UI

import { useState } from 'react';
import type { MetricsSummary } from '@/lib/metrics';
import type { InsightReport } from '@/lib/insights';
import Header from './ui/Header';
import DeveloperProfile from './ui/DeveloperProfile';
import MetricCard from './ui/MetricCard';
import InsightPanel from './panels/InsightPanel';
import ActionPanel from './panels/ActionPanel';
import ActivityFeed from './panels/ActivityFeed';
import HealthScore from './ui/HealthScore';
import SparkChart from './charts/SparkChart';

interface Props {
  developer: { id: string; name: string; role: string; team: string; avatar: string; joinDate: string };
  metrics: MetricsSummary;
  insights: InsightReport;
  recentActivity: Array<{
    id: string; issueId: string; prId: string; deployedAt: string;
    environment: string; status: string; prTitle: string; issueTitle: string;
  }>;
}

export default function DashboardClient({ developer, metrics, insights, recentActivity }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'activity'>('overview');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const metricCards = [
    {
      key: 'leadTime',
      data: metrics.leadTime,
      icon: '⏱',
      description: 'Ticket created → deployed to prod',
      benchmark: '< 3 days (DORA Elite)',
    },
    {
      key: 'cycleTime',
      data: metrics.cycleTime,
      icon: '🔄',
      description: 'Work started → PR merged',
      benchmark: '< 2 days (healthy IC)',
    },
    {
      key: 'bugRate',
      data: metrics.bugRate,
      icon: '🐛',
      description: 'Bugs as % of total issues',
      benchmark: '< 20% (healthy)',
    },
    {
      key: 'deploymentFrequency',
      data: metrics.deploymentFrequency,
      icon: '🚀',
      description: 'Successful prod deploys / week',
      benchmark: '≥ 3/week (DORA High)',
    },
    {
      key: 'prThroughput',
      data: metrics.prThroughput,
      icon: '📬',
      description: 'PRs merged per week',
      benchmark: '≥ 3/week (healthy IC)',
    },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Header theme={theme} onToggleTheme={toggleTheme} developer={developer} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Hero Row ── */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 animate-slide-up">
          <DeveloperProfile developer={developer} metrics={metrics} />
          <HealthScore score={insights.score} health={insights.overallHealth} summary={insights.summary} />
        </div>

        {/* ── Tab Navigation ── */}
        <div
          className="flex gap-1 mb-6 p-1 rounded-xl inline-flex"
          style={{ backgroundColor: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}
        >
          {(['overview', 'insights', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200"
              style={{
                backgroundColor: activeTab === tab ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {tab === 'overview' ? '📊 Overview' : tab === 'insights' ? '🔍 Insights' : '📋 Activity'}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {metricCards.map((m, i) => (
                <div
                  key={m.key}
                  className={`animate-slide-up stagger-${i + 1}`}
                  style={{ animationFillMode: 'both', opacity: 0 }}
                >
                  <MetricCard
                    data={m.data}
                    icon={m.icon}
                    description={m.description}
                    benchmark={m.benchmark}
                  />
                </div>
              ))}
            </div>

            {/* Sparkline Charts Row */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <h2
                className="text-lg font-semibold mb-5"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                4-Week Trends
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {metricCards.map(m => (
                  <SparkChart
                    key={m.key}
                    label={m.data.label.split(' ').slice(0, 2).join(' ')}
                    data={m.data.weeklyData}
                    unit={m.data.unit}
                    status={m.data.status}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Row: Actions + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActionPanel actions={insights.actions} />
              <ActivityFeed activities={recentActivity} />
            </div>
          </div>
        )}

        {/* ── Insights Tab ── */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <InsightPanel insights={insights.insights} />
            <ActionPanel actions={insights.actions} expanded />
          </div>
        )}

        {/* ── Activity Tab ── */}
        {activeTab === 'activity' && (
          <ActivityFeed activities={recentActivity} expanded />
        )}
      </main>

      <footer
        className="mt-16 border-t py-6 text-center text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)' }}>DevPulse</span>
        {' · '}
        Last refreshed: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        {' · '}
        30-day window
      </footer>
    </div>
  );
}
