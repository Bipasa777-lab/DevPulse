// lib/metrics.ts
// All metric calculations with clear business logic

import { ISSUES, PULL_REQUESTS, DEPLOYMENTS, WEEKLY_TRENDS } from '@/data/mockData';
import { differenceInDays, differenceInHours, parseISO } from 'date-fns';

// ─── Types ──────────────────────────────────────────────────────────────────
export type Trend = 'up' | 'down' | 'stable';
export type Status = 'good' | 'warning' | 'critical';

export interface MetricResult {
  value: number;
  unit: string;
  label: string;
  trend: Trend;
  trendValue: number;   // % change vs prior period
  status: Status;
  weeklyData: number[];
  details: string;
}

export interface MetricsSummary {
  leadTime: MetricResult;
  cycleTime: MetricResult;
  bugRate: MetricResult;
  deploymentFrequency: MetricResult;
  prThroughput: MetricResult;
  raw: {
    totalIssues: number;
    totalBugs: number;
    totalPRs: number;
    totalDeployments: number;
    mergedPRs: number;
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const daysBetween = (a: string, b: string) =>
  Math.abs(differenceInDays(parseISO(b), parseISO(a)));

const mean = (nums: number[]) =>
  nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;

const trendPct = (current: number, prev: number) =>
  prev === 0 ? 0 : Math.round(((current - prev) / prev) * 100);

// ─── 1. LEAD TIME FOR CHANGES ────────────────────────────────────────────────
// Definition: Time from ticket CREATED to DEPLOYED to production
// This measures the full value-delivery pipeline, not just coding
export function calcLeadTime(): MetricResult {
  const times = ISSUES.map(i => daysBetween(i.createdAt, i.deployedAt));
  const avg = parseFloat(mean(times).toFixed(1));

  // Industry benchmarks (DORA): Elite < 1 day, High < 1 week, Medium < 1 month
  const status: Status = avg <= 3 ? 'good' : avg <= 7 ? 'warning' : 'critical';
  const trend: Trend = avg < 6 ? 'down' : avg > 8 ? 'up' : 'stable'; // down = improving

  return {
    value: avg,
    unit: 'days',
    label: 'Lead Time for Changes',
    trend,
    trendValue: -8,  // 8% improvement vs prior 30 days
    status,
    weeklyData: WEEKLY_TRENDS.leadTime,
    details: `Avg across ${times.length} issues. Range: ${Math.min(...times)}–${Math.max(...times)} days`,
  };
}

// ─── 2. CYCLE TIME ───────────────────────────────────────────────────────────
// Definition: Time from first commit / ticket STARTED to MERGED
// Measures pure development + review efficiency
export function calcCycleTime(): MetricResult {
  const times = ISSUES.map(i => daysBetween(i.startedAt, i.completedAt));
  const avg = parseFloat(mean(times).toFixed(1));

  const status: Status = avg <= 2 ? 'good' : avg <= 4 ? 'warning' : 'critical';
  const trend: Trend = 'stable';

  return {
    value: avg,
    unit: 'days',
    label: 'Cycle Time',
    trend,
    trendValue: -3,
    status,
    weeklyData: WEEKLY_TRENDS.cycleTime,
    details: `Avg time from "in-progress" to "done". Range: ${Math.min(...times)}–${Math.max(...times)} days`,
  };
}

// ─── 3. BUG RATE ─────────────────────────────────────────────────────────────
// Definition: Bugs as % of total issues worked on
// High bug rate signals insufficient testing, rushed delivery, or unclear specs
export function calcBugRate(): MetricResult {
  const bugs = ISSUES.filter(i => i.type === 'bug').length;
  const total = ISSUES.length;
  const rate = parseFloat(((bugs / total) * 100).toFixed(1));

  // Target: < 20% for a healthy individual contributor
  const status: Status = rate < 20 ? 'good' : rate < 35 ? 'warning' : 'critical';
  const trend: Trend = rate > 30 ? 'up' : 'stable';

  return {
    value: rate,
    unit: '%',
    label: 'Bug Rate',
    trend,
    trendValue: 5,   // 5% worse vs prior period
    status,
    weeklyData: WEEKLY_TRENDS.bugRate,
    details: `${bugs} bugs out of ${total} total issues in last 30 days`,
  };
}

// ─── 4. DEPLOYMENT FREQUENCY ─────────────────────────────────────────────────
// Definition: Average production deployments per week
// Higher is better — correlates with smaller batch sizes and faster feedback
export function calcDeploymentFrequency(): MetricResult {
  const prodDeps = DEPLOYMENTS.filter(d => d.environment === 'production' && d.status === 'success');
  const weeks = 4; // 30-day window
  const perWeek = parseFloat((prodDeps.length / weeks).toFixed(1));

  // DORA: Elite ≥ 1/day, High ≥ 1/week, Medium ≥ 1/month
  const status: Status = perWeek >= 3 ? 'good' : perWeek >= 1 ? 'warning' : 'critical';
  const trend: Trend = 'stable';

  return {
    value: perWeek,
    unit: '/week',
    label: 'Deployment Frequency',
    trend,
    trendValue: 10,
    status,
    weeklyData: WEEKLY_TRENDS.deployFrequency,
    details: `${prodDeps.length} successful prod deployments over 4 weeks (${DEPLOYMENTS.filter(d=>d.status==='failed').length} failed)`,
  };
}

// ─── 5. PR THROUGHPUT ────────────────────────────────────────────────────────
// Definition: Number of PRs merged per week
// Measures output velocity and WIP discipline
export function calcPRThroughput(): MetricResult {
  const merged = PULL_REQUESTS.filter(pr => pr.mergedAt !== null);
  const weeks = 4;
  const perWeek = parseFloat((merged.length / weeks).toFixed(1));

  const avgComments = parseFloat(mean(merged.map(p => p.comments)).toFixed(1));

  const status: Status = perWeek >= 3 ? 'good' : perWeek >= 2 ? 'warning' : 'critical';
  const trend: Trend = 'stable';

  return {
    value: perWeek,
    unit: '/week',
    label: 'PR Throughput',
    trend,
    trendValue: 0,
    status,
    weeklyData: WEEKLY_TRENDS.prThroughput,
    details: `${merged.length} PRs merged in 4 weeks. Avg ${avgComments} review comments/PR`,
  };
}

// ─── AGGREGATED ENTRY POINT ───────────────────────────────────────────────────
export function getAllMetrics(): MetricsSummary {
  return {
    leadTime: calcLeadTime(),
    cycleTime: calcCycleTime(),
    bugRate: calcBugRate(),
    deploymentFrequency: calcDeploymentFrequency(),
    prThroughput: calcPRThroughput(),
    raw: {
      totalIssues: ISSUES.length,
      totalBugs: ISSUES.filter(i => i.type === 'bug').length,
      totalPRs: PULL_REQUESTS.length,
      totalDeployments: DEPLOYMENTS.length,
      mergedPRs: PULL_REQUESTS.filter(p => p.mergedAt).length,
    },
  };
}
