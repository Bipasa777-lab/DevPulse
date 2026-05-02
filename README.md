# DevPulse — Developer Productivity MVP

> A focused dashboard for Individual Contributors to understand their engineering metrics and take action.

---

## 🚀 Quick Start

```bash
cd devpulse
npm install
npm run dev
# Visit http://localhost:3000
```

---

## 📐 1. Product Thinking

### User Journey (Individual Contributor View)

```
Developer opens DevPulse
        ↓
Sees their profile + health score at a glance (5 seconds)
        ↓
Scans 5 metric cards — status badges signal what needs attention (15 seconds)
        ↓
Reads trend charts — is this getting better or worse? (30 seconds)
        ↓
Opens Insights tab — "why is my lead time high?" (1 minute)
        ↓
Reviews Action panel — picks 1 concrete thing to do this sprint (2 minutes)
        ↓
Checks Activity feed — confirms recent deployments went well
```

### Why This Scope Is Sufficient for an MVP

| Principle | Applied |
|-----------|---------|
| One user, one view | Single IC dashboard — no team aggregation to muddy the signal |
| Signal over noise | 5 industry-standard DORA metrics, not 50 vanity metrics |
| Interpretation included | Every metric has a "why" — not just a number |
| Action-oriented | Every insight maps to ≥1 concrete next step |
| No overengineering | Next.js App Router + in-memory data — no DB needed for MVP |

---

## 🏗️ 2. System Architecture

### Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 14 App Router | SSR + API routes in one repo |
| Styling | Tailwind CSS + CSS variables | Theme switching, responsive |
| Charts | Recharts | Lightweight, React-native |
| Data | TypeScript mock data | Interview-safe, instant |
| Icons | Lucide React | Consistent, tree-shakeable |

### Data Flow

```
mockData.ts (ISSUES, PRs, DEPLOYMENTS)
        ↓
lib/metrics.ts  ← calculates all 5 metrics
        ↓
lib/insights.ts ← rule engine generates insights + actions
        ↓
app/dashboard/page.tsx  ← server component, calls both libs
        ↓
DashboardClient.tsx  ← client component, holds UI state
        ↓
MetricCard | InsightPanel | ActionPanel | ActivityFeed | SparkChart
```

### API Routes (Production-Ready Pattern)

```
GET /api/metrics     → MetricsSummary JSON
GET /api/insights    → InsightReport JSON
GET /api/deployments → Enriched deployment history
```

### Folder Structure

```
devpulse/
├── app/
│   ├── layout.tsx              # Root layout + fonts
│   ├── globals.css             # CSS variables, dark/light theme
│   ├── page.tsx                # Redirect → /dashboard
│   ├── dashboard/
│   │   └── page.tsx            # Server component, data fetching
│   └── api/
│       ├── metrics/route.ts    # GET /api/metrics
│       ├── insights/route.ts   # GET /api/insights
│       └── deployments/route.ts
├── components/
│   ├── DashboardClient.tsx     # Main orchestrator (client)
│   ├── ui/
│   │   ├── Header.tsx          # Top nav + theme toggle
│   │   ├── DeveloperProfile.tsx
│   │   ├── MetricCard.tsx      # Core metric display unit
│   │   └── HealthScore.tsx     # Animated radial score
│   ├── charts/
│   │   └── SparkChart.tsx      # 7-week trend sparkline
│   └── panels/
│       ├── InsightPanel.tsx    # Accordion AI insights
│       ├── ActionPanel.tsx     # Prioritized recommendations
│       └── ActivityFeed.tsx    # Deployment timeline
├── lib/
│   ├── metrics.ts              # All 5 metric calculations
│   └── insights.ts             # Rule-based insight engine
└── data/
    └── mockData.ts             # Typed sample dataset
```

---

## 📊 3. Metric Calculations

### Lead Time for Changes
```
leadTime = avg(deployedAt - createdAt) for all issues in window
```
- Measures **full value chain**: requirements → production
- DORA benchmark: Elite < 1 day, High < 1 week

### Cycle Time
```
cycleTime = avg(completedAt - startedAt) for all issues
```
- Measures **dev efficiency**: first commit → merged
- Shorter = smaller PRs + fast reviews

### Bug Rate
```
bugRate = (bugCount / totalIssues) × 100
```
- Measures **quality discipline**: are features coming back as bugs?
- Healthy threshold: < 20%

### Deployment Frequency
```
deployFrequency = successfulProdDeployments / weeks
```
- DORA core metric: measures CD pipeline health
- Elite: multiple times/day; High: ≥ 1/week

### PR Throughput
```
prThroughput = mergedPRs / weeks
```
- Measures **output velocity** and batch size discipline
- Low throughput + high lead time = PRs are too large

---

## 🤖 4. AI Insight Logic

The insight engine uses **deterministic rule-based logic** — transparent, fast, debuggable.

### Rule Table

| Condition | Interpretation | Action |
|-----------|---------------|--------|
| leadTime > 3d AND prThroughput < 3 | Tickets too large, review bottleneck | Break into smaller slices |
| bugRate > 20% | Testing gap, rushed delivery | Add personal DoD checklist |
| cycleTime > 2d | Review friction or WIP overload | Cap WIP at 2 tickets |
| deployFreq < 3/wk | Batched releases, deploy fear | Feature flags + independent deploys |
| deployFreq = good AND bugRate = bad | Ship fast, break things | Slow down testing, not velocity |
| all good | Healthy! | Document + mentor peers |

### Why Rules > LLM for MVP

1. **Deterministic**: same input → same output (debuggable in interviews)
2. **Explainable**: every insight has a traceable cause
3. **Fast**: zero latency, no API cost
4. **Extensible**: adding a rule is adding an if-statement

In production, you'd layer an LLM on top to generate natural language summaries from the same rule outputs.

---

## 🎨 5. UI Design Decisions

### Theme System
- CSS variables on `:root` and `.dark` — single source of truth
- `transition: background-color 0.3s ease` on `body` — silky toggle
- No FOUC: theme initialized via class on `<html>`

### Typography
- **Fraunces** (display) — editorial, warm serif for headings
- **DM Sans** (body) — clean, modern, readable
- **DM Mono** (numbers) — tabular numerals prevent layout shift

### Color Semantics
- 🟢 Green = good / on track
- 🟡 Amber = warning / watch
- 🔴 Red = critical / action needed
- Consistent across badges, charts, timeline dots

### Interaction Model
- Hover on MetricCard reveals details panel
- Accordion InsightPanel keeps screen clean
- Tab navigation separates Overview / Insights / Activity

---

## 📋 Key Design Decisions Log

| Decision | Alternative | Why This |
|----------|------------|----------|
| Rule-based insights | LLM API | Deterministic, fast, debuggable for demo |
| Server component for data | Client fetch | No loading state, better performance |
| CSS variables for themes | Tailwind dark: classes | Single source of truth, easier to extend |
| 30-day window | Real-time | Enough signal without noise, stable for demo |
| Recharts | D3 / Victory | Easiest React integration, sufficient for MVP |
