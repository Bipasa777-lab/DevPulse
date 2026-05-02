// app/api/deployments/route.ts
import { NextResponse } from 'next/server';
import { DEPLOYMENTS, PULL_REQUESTS, ISSUES } from '@/data/mockData';

export async function GET() {
  const enriched = DEPLOYMENTS.map(dep => {
    const pr = PULL_REQUESTS.find(p => p.id === dep.prId);
    const issue = ISSUES.find(i => i.id === dep.issueId);
    return { ...dep, prTitle: pr?.title ?? '', issueTitle: issue?.title ?? '' };
  }).sort((a, b) => b.deployedAt.localeCompare(a.deployedAt));

  return NextResponse.json({ success: true, data: enriched });
}
