// data/mockData.ts
// Simulates data from Jira, GitHub PRs, deployment pipelines, and bug trackers

export const DEVELOPER = {
  id: 'dev-001',
  name: 'Arjun Sharma',
  role: 'Software Developer Engineer',
  team: 'Platform Squad',
  avatar: 'AS',
  joinDate: '2022-03-15',
};

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const subDays = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
};

// Map old April days to relative days: April 30 -> 0 days ago, April 1 -> 29 days ago.
// To keep the progression logical, let's say: day of month X => 30 - X days ago.
// 2024-04-01 => subDays(29)
// 2024-04-15 => subDays(15)
// 2024-04-30 => subDays(0)

const d = (dayOfApril: number) => subDays(30 - dayOfApril);

// --- ISSUES (Jira-like) ---
export interface Issue {
  id: string;
  title: string;
  type: 'feature' | 'bug' | 'chore';
  createdAt: string;    // when ticket was opened
  startedAt: string;    // when dev picked it up (in-progress)
  completedAt: string;  // when ticket closed / merged
  deployedAt: string;   // when it went to production
  storyPoints: number;
}

export const ISSUES: Issue[] = [
  { id: 'PLAT-101', title: 'Add OAuth2 login flow', type: 'feature', createdAt: d(1), startedAt: d(3), completedAt: d(7), deployedAt: d(8), storyPoints: 5 },
  { id: 'PLAT-102', title: 'Fix navbar z-index bug', type: 'bug', createdAt: d(2), startedAt: d(2), completedAt: d(3), deployedAt: d(4), storyPoints: 1 },
  { id: 'PLAT-103', title: 'Refactor API client', type: 'chore', createdAt: d(4), startedAt: d(6), completedAt: d(10), deployedAt: d(11), storyPoints: 3 },
  { id: 'PLAT-104', title: 'Dashboard widget layout', type: 'feature', createdAt: d(8), startedAt: d(9), completedAt: d(14), deployedAt: d(15), storyPoints: 5 },
  { id: 'PLAT-105', title: 'Memory leak in event handler', type: 'bug', createdAt: d(10), startedAt: d(11), completedAt: d(12), deployedAt: d(13), storyPoints: 2 },
  { id: 'PLAT-106', title: 'Upgrade React to v18', type: 'chore', createdAt: d(12), startedAt: d(15), completedAt: d(22), deployedAt: d(23), storyPoints: 8 },
  { id: 'PLAT-107', title: 'Export CSV feature', type: 'feature', createdAt: d(14), startedAt: d(16), completedAt: d(19), deployedAt: d(21), storyPoints: 3 },
  { id: 'PLAT-108', title: 'Tooltip alignment bug', type: 'bug', createdAt: d(18), startedAt: d(19), completedAt: d(20), deployedAt: d(21), storyPoints: 1 },
  { id: 'PLAT-109', title: 'Dark mode persistence', type: 'feature', createdAt: d(20), startedAt: d(21), completedAt: d(25), deployedAt: d(26), storyPoints: 3 },
  { id: 'PLAT-110', title: 'Broken pagination on mobile', type: 'bug', createdAt: d(23), startedAt: d(23), completedAt: d(24), deployedAt: d(25), storyPoints: 2 },
  { id: 'PLAT-111', title: 'Search debounce optimization', type: 'feature', createdAt: d(24), startedAt: d(25), completedAt: d(28), deployedAt: d(29), storyPoints: 2 },
  { id: 'PLAT-112', title: 'Stale cache on logout', type: 'bug', createdAt: d(26), startedAt: d(27), completedAt: d(28), deployedAt: d(29), storyPoints: 2 },
  { id: 'PLAT-113', title: 'Enhance form validation', type: 'feature', createdAt: d(27), startedAt: d(27), completedAt: d(29), deployedAt: d(30), storyPoints: 3 },
  { id: 'PLAT-114', title: 'Update dependencies', type: 'chore', createdAt: d(28), startedAt: d(29), completedAt: d(30), deployedAt: d(30), storyPoints: 2 },
];

// --- PULL REQUESTS ---
export interface PullRequest {
  id: string;
  title: string;
  issueId: string;
  openedAt: string;
  firstReviewAt: string | null;
  mergedAt: string | null;
  linesAdded: number;
  linesRemoved: number;
  comments: number;
  approved: boolean;
}

export const PULL_REQUESTS: PullRequest[] = [
  { id: 'PR-201', title: 'feat: OAuth2 login flow', issueId: 'PLAT-101', openedAt: d(5), firstReviewAt: d(6), mergedAt: d(7), linesAdded: 320, linesRemoved: 45, comments: 8, approved: true },
  { id: 'PR-202', title: 'fix: navbar z-index', issueId: 'PLAT-102', openedAt: d(2), firstReviewAt: d(2), mergedAt: d(3), linesAdded: 12, linesRemoved: 3, comments: 2, approved: true },
  { id: 'PR-203', title: 'chore: refactor API client', issueId: 'PLAT-103', openedAt: d(8), firstReviewAt: d(9), mergedAt: d(10), linesAdded: 180, linesRemoved: 240, comments: 12, approved: true },
  { id: 'PR-204', title: 'feat: dashboard widget layout', issueId: 'PLAT-104', openedAt: d(11), firstReviewAt: d(13), mergedAt: d(14), linesAdded: 450, linesRemoved: 90, comments: 15, approved: true },
  { id: 'PR-205', title: 'fix: memory leak in event handler', issueId: 'PLAT-105', openedAt: d(11), firstReviewAt: d(11), mergedAt: d(12), linesAdded: 34, linesRemoved: 28, comments: 4, approved: true },
  { id: 'PR-206', title: 'chore: upgrade React v18', issueId: 'PLAT-106', openedAt: d(17), firstReviewAt: d(19), mergedAt: d(22), linesAdded: 890, linesRemoved: 420, comments: 23, approved: true },
  { id: 'PR-207', title: 'feat: export CSV', issueId: 'PLAT-107', openedAt: d(17), firstReviewAt: d(18), mergedAt: d(19), linesAdded: 145, linesRemoved: 20, comments: 6, approved: true },
  { id: 'PR-208', title: 'fix: tooltip alignment', issueId: 'PLAT-108', openedAt: d(19), firstReviewAt: d(20), mergedAt: d(20), linesAdded: 8, linesRemoved: 5, comments: 1, approved: true },
  { id: 'PR-209', title: 'feat: dark mode persistence', issueId: 'PLAT-109', openedAt: d(22), firstReviewAt: d(23), mergedAt: d(25), linesAdded: 95, linesRemoved: 30, comments: 7, approved: true },
  { id: 'PR-210', title: 'fix: mobile pagination', issueId: 'PLAT-110', openedAt: d(23), firstReviewAt: d(24), mergedAt: d(24), linesAdded: 55, linesRemoved: 40, comments: 3, approved: true },
  { id: 'PR-211', title: 'feat: search debounce', issueId: 'PLAT-111', openedAt: d(25), firstReviewAt: d(26), mergedAt: d(28), linesAdded: 42, linesRemoved: 18, comments: 5, approved: true },
  { id: 'PR-212', title: 'fix: stale cache logout', issueId: 'PLAT-112', openedAt: d(27), firstReviewAt: d(28), mergedAt: d(28), linesAdded: 28, linesRemoved: 15, comments: 2, approved: true },
  { id: 'PR-213', title: 'feat: form validation', issueId: 'PLAT-113', openedAt: d(28), firstReviewAt: d(28), mergedAt: d(29), linesAdded: 64, linesRemoved: 12, comments: 4, approved: true },
  { id: 'PR-214', title: 'chore: update deps', issueId: 'PLAT-114', openedAt: d(29), firstReviewAt: d(30), mergedAt: d(30), linesAdded: 20, linesRemoved: 20, comments: 1, approved: true },
];

// --- DEPLOYMENTS ---
export interface Deployment {
  id: string;
  issueId: string;
  prId: string;
  deployedAt: string;
  environment: 'staging' | 'production';
  status: 'success' | 'failed' | 'rolled-back';
  durationMinutes: number;
}

export const DEPLOYMENTS: Deployment[] = [
  { id: 'DEP-301', issueId: 'PLAT-101', prId: 'PR-201', deployedAt: d(8), environment: 'production', status: 'success', durationMinutes: 8 },
  { id: 'DEP-302', issueId: 'PLAT-102', prId: 'PR-202', deployedAt: d(4), environment: 'production', status: 'success', durationMinutes: 4 },
  { id: 'DEP-303', issueId: 'PLAT-103', prId: 'PR-203', deployedAt: d(11), environment: 'production', status: 'success', durationMinutes: 12 },
  { id: 'DEP-304', issueId: 'PLAT-104', prId: 'PR-204', deployedAt: d(15), environment: 'production', status: 'success', durationMinutes: 9 },
  { id: 'DEP-305', issueId: 'PLAT-105', prId: 'PR-205', deployedAt: d(13), environment: 'production', status: 'success', durationMinutes: 5 },
  { id: 'DEP-306', issueId: 'PLAT-106', prId: 'PR-206', deployedAt: d(23), environment: 'production', status: 'failed', durationMinutes: 15 },
  { id: 'DEP-306B', issueId: 'PLAT-106', prId: 'PR-206', deployedAt: d(24), environment: 'production', status: 'success', durationMinutes: 11 },
  { id: 'DEP-307', issueId: 'PLAT-107', prId: 'PR-207', deployedAt: d(21), environment: 'production', status: 'success', durationMinutes: 7 },
  { id: 'DEP-308', issueId: 'PLAT-108', prId: 'PR-208', deployedAt: d(21), environment: 'production', status: 'success', durationMinutes: 4 },
  { id: 'DEP-309', issueId: 'PLAT-109', prId: 'PR-209', deployedAt: d(26), environment: 'production', status: 'success', durationMinutes: 8 },
  { id: 'DEP-310', issueId: 'PLAT-110', prId: 'PR-210', deployedAt: d(20), environment: 'production', status: 'success', durationMinutes: 6 },
  { id: 'DEP-311', issueId: 'PLAT-111', prId: 'PR-211', deployedAt: d(21), environment: 'production', status: 'success', durationMinutes: 7 },
  { id: 'DEP-312', issueId: 'PLAT-112', prId: 'PR-212', deployedAt: d(22), environment: 'production', status: 'success', durationMinutes: 5 },
  { id: 'DEP-313', issueId: 'PLAT-113', prId: 'PR-213', deployedAt: d(22), environment: 'production', status: 'success', durationMinutes: 6 },
  { id: 'DEP-314', issueId: 'PLAT-114', prId: 'PR-214', deployedAt: d(23), environment: 'production', status: 'success', durationMinutes: 3 },
  { id: 'DEP-315', issueId: 'PLAT-100', prId: 'PR-200', deployedAt: d(24), environment: 'staging', status: 'success', durationMinutes: 4 },
  { id: 'DEP-316', issueId: 'PLAT-100', prId: 'PR-200', deployedAt: d(24), environment: 'staging', status: 'failed', durationMinutes: 2 },
  { id: 'DEP-317', issueId: 'PLAT-115', prId: 'PR-215', deployedAt: d(25), environment: 'production', status: 'success', durationMinutes: 6 },
  { id: 'DEP-318', issueId: 'PLAT-116', prId: 'PR-216', deployedAt: d(26), environment: 'production', status: 'success', durationMinutes: 3 },
  { id: 'DEP-319', issueId: 'PLAT-117', prId: 'PR-217', deployedAt: d(27), environment: 'production', status: 'success', durationMinutes: 5 },
  { id: 'DEP-320', issueId: 'PLAT-118', prId: 'PR-218', deployedAt: d(27), environment: 'production', status: 'rolled-back', durationMinutes: 8 },
  { id: 'DEP-321', issueId: 'PLAT-119', prId: 'PR-219', deployedAt: d(28), environment: 'production', status: 'success', durationMinutes: 4 },
  { id: 'DEP-322', issueId: 'PLAT-120', prId: 'PR-220', deployedAt: d(28), environment: 'staging', status: 'success', durationMinutes: 2 },
  { id: 'DEP-323', issueId: 'PLAT-121', prId: 'PR-221', deployedAt: d(29), environment: 'production', status: 'success', durationMinutes: 7 },
  { id: 'DEP-324', issueId: 'PLAT-122', prId: 'PR-222', deployedAt: d(29), environment: 'staging', status: 'failed', durationMinutes: 1 },
  { id: 'DEP-325', issueId: 'PLAT-123', prId: 'PR-223', deployedAt: d(30), environment: 'production', status: 'success', durationMinutes: 5 },
  { id: 'DEP-326', issueId: 'PLAT-124', prId: 'PR-224', deployedAt: d(30), environment: 'production', status: 'success', durationMinutes: 3 },
  { id: 'DEP-327', issueId: 'PLAT-125', prId: 'PR-225', deployedAt: d(27), environment: 'staging', status: 'success', durationMinutes: 6 },
  { id: 'DEP-328', issueId: 'PLAT-126', prId: 'PR-226', deployedAt: d(28), environment: 'production', status: 'success', durationMinutes: 4 },
  { id: 'DEP-329', issueId: 'PLAT-127', prId: 'PR-227', deployedAt: d(29), environment: 'production', status: 'rolled-back', durationMinutes: 2 },
  { id: 'DEP-330', issueId: 'PLAT-128', prId: 'PR-228', deployedAt: d(30), environment: 'production', status: 'success', durationMinutes: 8 },
  { id: 'DEP-331', issueId: 'PLAT-129', prId: 'PR-229', deployedAt: d(29), environment: 'staging', status: 'success', durationMinutes: 4 },
  { id: 'DEP-332', issueId: 'PLAT-130', prId: 'PR-230', deployedAt: d(28), environment: 'production', status: 'success', durationMinutes: 5 },
  { id: 'DEP-333', issueId: 'PLAT-131', prId: 'PR-231', deployedAt: d(27), environment: 'staging', status: 'failed', durationMinutes: 1 },
  { id: 'DEP-334', issueId: 'PLAT-132', prId: 'PR-232', deployedAt: d(26), environment: 'production', status: 'success', durationMinutes: 6 },
  { id: 'DEP-335', issueId: 'PLAT-133', prId: 'PR-233', deployedAt: d(30), environment: 'production', status: 'success', durationMinutes: 3 },
];

// Weekly trend data for sparklines
export const WEEKLY_TRENDS = {
  leadTime:          [5.2, 6.8, 4.9, 7.1, 5.5, 6.2, 5.8],
  cycleTime:         [2.1, 2.8, 1.9, 3.2, 2.4, 2.6, 2.3],
  bugRate:           [25, 30, 22, 35, 28, 33, 31],
  deployFrequency:   [2, 3, 2, 1, 3, 2, 4],
  prThroughput:      [3, 2, 4, 2, 3, 3, 4],
};
