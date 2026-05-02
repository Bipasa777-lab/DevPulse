// app/api/insights/route.ts
import { NextResponse } from 'next/server';
import { getAllMetrics } from '@/lib/metrics';
import { generateInsights } from '@/lib/insights';

export async function GET() {
  try {
    const metrics = getAllMetrics();
    const insights = generateInsights(metrics);
    return NextResponse.json({ success: true, data: insights, generatedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to generate insights' }, { status: 500 });
  }
}
