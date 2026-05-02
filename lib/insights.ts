// lib/insights.ts
// Rule-based AI interpretation engine
// Reads metric signals and generates contextual narratives + action recommendations

import type { MetricsSummary, Status } from './metrics';

export interface Insight {
  id: string;
  signal: string;          // What the data says
  interpretation: string;  // WHY this might be happening
  severity: 'info' | 'warning' | 'critical';
  metric: string;
  icon: string;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  category: 'process' | 'technical' | 'collaboration';
  linkedMetrics: string[];
}

export interface InsightReport {
  summary: string;
  insights: Insight[];
  actions: Action[];
  overallHealth: 'healthy' | 'needs-attention' | 'at-risk';
  score: number;  // 0–100
}

// ─── Scoring ─────────────────────────────────────────────────────────────────
function statusScore(s: Status): number {
  return s === 'good' ? 100 : s === 'warning' ? 60 : 20;
}

function computeScore(m: MetricsSummary): number {
  const scores = [
    statusScore(m.leadTime.status),
    statusScore(m.cycleTime.status),
    statusScore(m.bugRate.status),
    statusScore(m.deploymentFrequency.status),
    statusScore(m.prThroughput.status),
  ];
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ─── Rule Engine ─────────────────────────────────────────────────────────────
export function generateInsights(m: MetricsSummary): InsightReport {
  const insights: Insight[] = [];
  const actions: Action[] = [];

  // ── Rule 1: High Lead Time + Low PR Throughput → Queue/Review Bottleneck
  if (m.leadTime.status !== 'good' && m.prThroughput.value < 3) {
    insights.push({
      id: 'INS-001',
      signal: `Lead time averaging ${m.leadTime.value} days with only ${m.prThroughput.value} PRs merged/week`,
      interpretation:
        'Work items are taking a long time from creation to deployment. Combined with lower PR throughput, this often indicates large batch sizes — tickets are too big, causing PRs to linger in review queues longer. Alternatively, there may be upstream delays (unclear requirements, blocked dependencies) before coding even begins.',
      severity: 'warning',
      metric: 'Lead Time / PR Throughput',
      icon: '⏳',
    });
    actions.push({
      id: 'ACT-001',
      title: 'Break tickets into smaller, shippable slices',
      description:
        'Aim for tickets completable in 1–2 days. A feature taking 8 days is likely 4–5 independent deliverables. Smaller PRs (< 300 lines) get reviewed 2× faster and have fewer bugs.',
      effort: 'low',
      impact: 'high',
      category: 'process',
      linkedMetrics: ['Lead Time', 'PR Throughput', 'Cycle Time'],
    });
  }

  // ── Rule 2: High Bug Rate → Testing Gap
  if (m.bugRate.status === 'warning' || m.bugRate.status === 'critical') {
    insights.push({
      id: 'INS-002',
      signal: `${m.bugRate.value}% of your issues are bugs — above the 20% healthy threshold`,
      interpretation:
        'A rising bug rate usually signals one of three things: (1) features are being shipped without adequate test coverage, (2) regression tests are missing for edge cases, or (3) the definition-of-done doesn\'t include testing. Given your deployment frequency looks healthy, bugs are likely escaping during rapid delivery cycles.',
      severity: m.bugRate.status === 'critical' ? 'critical' : 'warning',
      metric: 'Bug Rate',
      icon: '🐛',
    });
    actions.push({
      id: 'ACT-002',
      title: 'Add a personal "definition of done" checklist',
      description:
        'Before opening any PR, run through: unit tests written, edge cases handled, tested in staging. Even a 5-minute self-review reduces escaped bugs by ~40%. Consider adding a PR template that enforces this.',
      effort: 'low',
      impact: 'high',
      category: 'process',
      linkedMetrics: ['Bug Rate', 'Cycle Time'],
    });
  }

  // ── Rule 3: Long Cycle Time → Review Friction or WIP Overload
  if (m.cycleTime.status !== 'good') {
    insights.push({
      id: 'INS-003',
      signal: `Average cycle time is ${m.cycleTime.value} days from start to merge`,
      interpretation:
        'Cycle time measures your coding-to-merged window. When it\'s elevated, there are two likely causes: PRs waiting for reviewers (social friction) or you\'re juggling too many tickets simultaneously (context switching). Working on more than 2 tickets in parallel significantly degrades per-ticket throughput.',
      severity: 'warning',
      metric: 'Cycle Time',
      icon: '🔄',
    });
    actions.push({
      id: 'ACT-003',
      title: 'Limit work-in-progress (WIP) to 2 active tickets',
      description:
        'Every additional ticket in flight adds cognitive overhead. Enforce a personal WIP limit: finish and merge before picking up new work. Use your standup to flag stalled PRs that need reviewer attention.',
      effort: 'low',
      impact: 'medium',
      category: 'process',
      linkedMetrics: ['Cycle Time', 'PR Throughput'],
    });
  }

  // ── Rule 4: Low Deployment Frequency → Batch Size Problem
  if (m.deploymentFrequency.status !== 'good') {
    insights.push({
      id: 'INS-004',
      signal: `Deploying ${m.deploymentFrequency.value} times/week — below the 3/week target`,
      interpretation:
        'Low deployment frequency usually means changes are being batched into larger releases. This increases risk per deployment and delays user feedback. It can also indicate manual deployment gates that slow the pipeline, or fear of deploying — which itself is a signal of insufficient automated testing.',
      severity: 'info',
      metric: 'Deployment Frequency',
      icon: '🚀',
    });
    actions.push({
      id: 'ACT-004',
      title: 'Deploy every merged PR independently',
      description:
        'Separate deployment from feature release using feature flags. This lets you merge and deploy safely, then flip the flag when ready. Smaller deploys are easier to roll back and faster to debug.',
      effort: 'medium',
      impact: 'high',
      category: 'technical',
      linkedMetrics: ['Deployment Frequency', 'Lead Time'],
    });
    actions.push({
      id: 'ACT-004B',
      title: 'Automate manual testing steps',
      description:
        'If deployments are delayed by manual QA, look into automating the most common critical paths with Playwright or Cypress to build confidence in faster releases.',
      effort: 'high',
      impact: 'high',
      category: 'technical',
      linkedMetrics: ['Deployment Frequency'],
    });
  }

  // ── Rule 5: Good deployment + High Bug Rate → Ship fast, break things
  if (m.deploymentFrequency.status === 'good' && m.bugRate.status !== 'good') {
    insights.push({
      id: 'INS-005',
      signal: 'High velocity but elevated bug rate — speed without stability',
      interpretation:
        'You\'re shipping frequently, which is great! But the bug rate suggests testing isn\'t keeping pace with delivery speed. This is a classic "move fast, break things" pattern. At scale, it creates technical debt and erodes user trust.',
      severity: 'warning',
      metric: 'Deployment Frequency + Bug Rate',
      icon: '⚡',
    });
    actions.push({
      id: 'ACT-005',
      title: 'Implement pre-commit hooks for linting & tests',
      description:
        'Add Husky to run basic unit tests and linters before allowing a commit. Catching basic errors locally speeds up the PR pipeline and reduces obvious bugs.',
      effort: 'low',
      impact: 'medium',
      category: 'technical',
      linkedMetrics: ['Bug Rate'],
    });
  }

  // ── Rule 6: General Tech Debt Action (Always applied to ensure rich suggestions)
  actions.push({
    id: 'ACT-GEN-01',
    title: 'Schedule a tech debt Friday',
    description: 'Dedicate the last 2 hours of every Friday to refactoring messy components, updating dependencies, or writing missing tests. Consistent small investments compound over time.',
    effort: 'low',
    impact: 'medium',
    category: 'process',
    linkedMetrics: ['Cycle Time', 'Bug Rate'],
  });

  // ── Rule 6: Everything looks good
  if (insights.length === 0) {
    insights.push({
      id: 'INS-OK',
      signal: 'All metrics within healthy ranges',
      interpretation:
        'Your DORA metrics are performing well. Lead time is low, bugs are under control, and you\'re shipping consistently. Focus on maintaining this baseline and look for opportunities to mentor peers or tackle technical debt proactively.',
      severity: 'info',
      metric: 'All Metrics',
      icon: '✅',
    });
    actions.push({
      id: 'ACT-OK',
      title: 'Invest in documentation and knowledge sharing',
      description:
        'When your personal metrics are healthy, the highest-leverage activity is lifting the team. Write runbooks for your recent features, or offer to review PRs for teammates with higher cycle times.',
      effort: 'low',
      impact: 'medium',
      category: 'collaboration',
      linkedMetrics: ['Team Velocity'],
    });
  }

  const score = computeScore(m);
  const overallHealth =
    score >= 75 ? 'healthy' : score >= 45 ? 'needs-attention' : 'at-risk';

  const summary =
    score >= 75
      ? `Strong performance across all metrics. Alex is shipping consistently with controlled quality.`
      : score >= 45
      ? `Solid velocity with a few areas to watch. Addressing bug rate and lead time will unlock the next level.`
      : `Several metrics need attention. Focus on smaller batches, testing discipline, and reducing WIP.`;

  return { summary, insights, actions, overallHealth, score };
}
