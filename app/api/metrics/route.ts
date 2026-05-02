// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import { getAllMetrics } from '@/lib/metrics';

export async function GET() {
  try {
    const metrics = getAllMetrics();
    return NextResponse.json({ success: true, data: metrics, generatedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to compute metrics' }, { status: 500 });
  }
}
