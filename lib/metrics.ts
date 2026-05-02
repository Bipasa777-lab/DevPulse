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
export function calcLeadTime(startDate?: string, endDate?: string): MetricResult {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (end) end.setHours(23, 59, 59, 999);

  const filteredIssues = ISSUES.filter(i => {
    if (!i.deployedAt) return false;
    const dDate = new Date(i.deployedAt);
    return (!start || dDate >= start) && (!end || dDate <= end);
  });

  const times = filteredIssues.map(i => daysBetween(i.createdAt, i.deployedAt));
  const avg = parseFloat(mean(times).toFixed(1));

  const status: Status = avg <= 3 ? 'good' : avg <= 7 ? 'warning' : 'critical';
  const trend: Trend = avg < 6 ? 'down' : avg > 8 ? 'up' : 'stable';

  return {
    value: avg,
    unit: 'days',
    label: 'Lead Time for Changes',
    trend,
    trendValue: -8,
    status,
    weeklyData: WEEKLY_TRENDS.leadTime,
    details: `Avg across ${times.length} issues in range. Range: ${times.length ? Math.min(...times) : 0}–${times.length ? Math.max(...times) : 0} days`,
  };
}

// ─── 2. CYCLE TIME ───────────────────────────────────────────────────────────
// Definition: Time from first commit / ticket STARTED to MERGED
export function calcCycleTime(startDate?: string, endDate?: string): MetricResult {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (end) end.setHours(23, 59, 59, 999);

  const filteredIssues = ISSUES.filter(i => {
    if (!i.completedAt) return false;
    const cDate = new Date(i.completedAt);
    return (!start || cDate >= start) && (!end || cDate <= end);
  });

  const times = filteredIssues.map(i => daysBetween(i.startedAt, i.completedAt));
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
    details: `Avg time for ${times.length} issues. Range: ${times.length ? Math.min(...times) : 0}–${times.length ? Math.max(...times) : 0} days`,
  };
}

// ─── 3. BUG RATE ─────────────────────────────────────────────────────────────
// Definition: Bugs as % of total issues created in range
export function calcBugRate(startDate?: string, endDate?: string): MetricResult {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (end) end.setHours(23, 59, 59, 999);

  const filtered = ISSUES.filter(i => {
    const cDate = new Date(i.createdAt);
    return (!start || cDate >= start) && (!end || cDate <= end);
  });

  const bugs = filtered.filter(i => i.type === 'bug').length;
  const total = filtered.length;
  const rate = total === 0 ? 0 : parseFloat(((bugs / total) * 100).toFixed(1));

  const status: Status = rate < 20 ? 'good' : rate < 35 ? 'warning' : 'critical';
  const trend: Trend = rate > 30 ? 'up' : 'stable';

  return {
    value: rate,
    unit: '%',
    label: 'Bug Rate',
    trend,
    trendValue: 5,
    status,
    weeklyData: WEEKLY_TRENDS.bugRate,
    details: `${bugs} bugs out of ${total} total issues in selected range`,
  };
}

// ─── 4. DEPLOYMENT FREQUENCY ─────────────────────────────────────────────────
export function calcDeploymentFrequency(startDate?: string, endDate?: string): MetricResult {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (end) end.setHours(23, 59, 59, 999);

  const prodDeps = DEPLOYMENTS.filter(d => {
    const dDate = new Date(d.deployedAt);
    return d.environment === 'production' && d.status === 'success' && 
           (!start || dDate >= start) && (!end || dDate <= end);
  });

  let weeks = 4;
  if (start && end) {
    const diff = Math.max(1, differenceInDays(end, start));
    weeks = diff / 7;
  }
  
  const perWeek = parseFloat((prodDeps.length / weeks).toFixed(1));
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
    details: `${prodDeps.length} successful prod deployments over ${weeks.toFixed(1)} weeks`,
  };
}

// ─── 5. PR THROUGHPUT ────────────────────────────────────────────────────────
export function calcPRThroughput(startDate?: string, endDate?: string): MetricResult {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (end) end.setHours(23, 59, 59, 999);

  const merged = PULL_REQUESTS.filter(pr => {
    if (!pr.mergedAt) return false;
    const mDate = new Date(pr.mergedAt);
    return (!start || mDate >= start) && (!end || mDate <= end);
  });

  let weeks = 4;
  if (start && end) {
    const diff = Math.max(1, differenceInDays(end, start));
    weeks = diff / 7;
  }

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
    details: `${merged.length} PRs merged over ${weeks.toFixed(1)} weeks. Avg ${avgComments} comments/PR`,
  };
}

// ─── AGGREGATED ENTRY POINT ───────────────────────────────────────────────────
export function getAllMetrics(startDate?: string, endDate?: string): MetricsSummary {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (end) end.setHours(23, 59, 59, 999);

  const fIssues = ISSUES.filter(i => {
    const cDate = new Date(i.createdAt);
    return (!start || cDate >= start) && (!end || cDate <= end);
  });
  const fPRs = PULL_REQUESTS.filter(pr => {
    if (!pr.mergedAt) return false;
    const mDate = new Date(pr.mergedAt);
    return (!start || mDate >= start) && (!end || mDate <= end);
  });
  const fDeps = DEPLOYMENTS.filter(d => {
    const dDate = new Date(d.deployedAt);
    return (!start || dDate >= start) && (!end || dDate <= end);
  });

  return {
    leadTime: calcLeadTime(startDate, endDate),
    cycleTime: calcCycleTime(startDate, endDate),
    bugRate: calcBugRate(startDate, endDate),
    deploymentFrequency: calcDeploymentFrequency(startDate, endDate),
    prThroughput: calcPRThroughput(startDate, endDate),
    raw: {
      totalIssues: fIssues.length,
      totalBugs: fIssues.filter(i => i.type === 'bug').length,
      totalPRs: fPRs.length,
      totalDeployments: fDeps.length,
      mergedPRs: fPRs.filter(p => p.mergedAt).length,
    },
  };
}
