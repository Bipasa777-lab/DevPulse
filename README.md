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

## 💼 7. Interview Q&A

### Q1: Why only 5 metrics?
**A:** These are the DORA (DevOps Research & Assessment) industry-standard metrics validated across thousands of engineering teams. They cover the complete delivery lifecycle: speed (lead time, cycle time), throughput (PR throughput, deploy frequency), and quality (bug rate). Adding more metrics without action paths creates noise. MVP principle: fewer, deeper metrics beat many shallow ones.

### Q2: How would you handle real data instead of mocks?
**A:** The architecture is already designed for this. `mockData.ts` is the only file that changes. In production: (1) Jira API for issues with `created`, `started`, `done` timestamps; (2) GitHub/GitLab API for PR open/merge times; (3) CI/CD webhooks (GitHub Actions, Jenkins) to record deployment events in a Postgres table. The `lib/metrics.ts` calculations remain identical — only the data source swaps.

### Q3: How does the insight engine scale?
**A:** The current rule engine has O(n) complexity on number of rules — fast and cheap. To scale: (1) Add more rules as patterns emerge from user feedback; (2) Layer a probabilistic model that weights rule confidence; (3) In production, pass rule outputs + metric values to an LLM with a structured prompt to generate personalized narratives. The rules provide the signal; the LLM provides the language.

### Q4: How would you make this multi-user / team view?
**A:** Currently scoped to one IC. To extend: (1) Add a `developerId` param to all API routes; (2) A team dashboard aggregates individual metrics with `avg()` and `p75()`; (3) Anonymize individual metrics for managers to preserve psychological safety. The data model already has `DEVELOPER.id` as the key — it just needs a developer registry.

### Q5: How do you prevent metric gaming?
**A:** Great question. Metrics can be gamed: e.g., a dev closes tickets prematurely to lower cycle time. Mitigations: (1) Combine multiple metrics — you can't simultaneously game lead time, bug rate, AND deployment frequency; (2) Track reversal rates (bugs re-opened, rollbacks); (3) Make metrics a conversation tool, not a performance review input. The dashboard frames metrics as "how can I improve?" not "am I being watched?"

### Q6: Why Next.js App Router vs Pages Router?
**A:** App Router enables React Server Components, which means metric calculations run on the server — zero client-side JS for data fetching. The dashboard page is a server component that pre-computes metrics and passes serialized data to client components. This gives better performance (no loading spinners) and keeps sensitive business logic server-side.

### Q7: How would you test this application?
**A:** Three layers: (1) **Unit tests** for `lib/metrics.ts` and `lib/insights.ts` — pure functions with deterministic outputs, easy to test with Jest; (2) **Component tests** using React Testing Library for MetricCard render states (good/warning/critical); (3) **E2E tests** with Playwright to assert the dashboard renders correct values for given mock data. The separation of data (mockData.ts), calculation (metrics.ts), and UI makes each layer independently testable.

### Q8: What's missing for production readiness?
**A:** (1) **Auth** — NextAuth.js with GitHub OAuth to identify the developer; (2) **Database** — Postgres with Prisma ORM to store historical snapshots for trend calculation; (3) **Caching** — Redis or Next.js `unstable_cache` to avoid recomputing metrics on every request; (4) **Error boundaries** — graceful degradation when Jira/GitHub APIs are down; (5) **Data refresh** — a cron job or webhook that re-fetches metrics every 15 minutes; (6) **Mobile responsiveness** — current grid collapses but needs testing.

### Q9: How do you calculate lead time accurately when tickets span multiple states?
**A:** The current implementation uses `createdAt` → `deployedAt` as the full lead time. A more accurate model uses state transition logs: `sum(time_in_state)` for each state (backlog, in-progress, code review, QA, deploy). This requires tracking state-change events, not just timestamps. For MVP, the simplified model is sufficient and explains the concept. In production, I'd add a `StateTransition` table with `(issueId, fromState, toState, timestamp)` and sum the in-progress durations.

### Q10: Why is Cycle Time different from Lead Time?
**A:** Lead time is a **business metric** — it answers "how long does a user's request take to reach them?" It includes everything: waiting in backlog, design, planning. Cycle time is an **engineering metric** — it answers "how fast does Alex code and ship?" It starts when the developer picks up work. Both matter: high lead time with low cycle time means the bottleneck is upstream (requirements, prioritization), not the developer. High cycle time means the developer's process needs improvement. Together, they pinpoint where in the system the slowdown lives.

---

## 📋 Key Design Decisions Log

| Decision | Alternative | Why This |
|----------|------------|----------|
| Rule-based insights | LLM API | Deterministic, fast, debuggable for demo |
| Server component for data | Client fetch | No loading state, better performance |
| CSS variables for themes | Tailwind dark: classes | Single source of truth, easier to extend |
| 30-day window | Real-time | Enough signal without noise, stable for demo |
| Recharts | D3 / Victory | Easiest React integration, sufficient for MVP |
