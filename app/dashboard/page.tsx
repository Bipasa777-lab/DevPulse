// app/dashboard/page.tsx
import { getAllMetrics } from '@/lib/metrics';
import { generateInsights } from '@/lib/insights';
import { DEVELOPER, ISSUES, PULL_REQUESTS, DEPLOYMENTS } from '@/data/mockData';
import DashboardClient from '@/components/DashboardClient';

// Server component: compute data at render time (or swap for fetch() in production)
export default function DashboardPage() {
  const metrics = getAllMetrics();
  const insights = generateInsights(metrics);

  const recentActivity = DEPLOYMENTS
    .sort((a, b) => b.deployedAt.localeCompare(a.deployedAt))
    .map(dep => {
      const pr = PULL_REQUESTS.find(p => p.id === dep.prId);
      const issue = ISSUES.find(i => i.id === dep.issueId);
      return { ...dep, prTitle: pr?.title ?? '', issueTitle: issue?.title ?? '' };
    });

  return (
    <DashboardClient
      developer={DEVELOPER}
      initialMetrics={metrics}
      initialInsights={insights}
      recentActivity={recentActivity}
    />
  );
}
