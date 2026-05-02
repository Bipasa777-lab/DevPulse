// data/mockData.ts
// Simulates data from Jira, GitHub PRs, deployment pipelines, and bug trackers
// Covers last 30 days for one developer: "Alex Chen"

export const DEVELOPER = {
  id: 'dev-001',
  name: 'Alex Chen',
  role: 'Senior Frontend Engineer',
  team: 'Platform Squad',
  avatar: 'AC',
  joinDate: '2022-03-15',
};

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
  { id: 'PLAT-101', title: 'Add OAuth2 login flow', type: 'feature', createdAt: '2024-04-01', startedAt: '2024-04-03', completedAt: '2024-04-07', deployedAt: '2024-04-08', storyPoints: 5 },
  { id: 'PLAT-102', title: 'Fix navbar z-index bug', type: 'bug', createdAt: '2024-04-02', startedAt: '2024-04-02', completedAt: '2024-04-03', deployedAt: '2024-04-04', storyPoints: 1 },
  { id: 'PLAT-103', title: 'Refactor API client', type: 'chore', createdAt: '2024-04-04', startedAt: '2024-04-06', completedAt: '2024-04-10', deployedAt: '2024-04-11', storyPoints: 3 },
  { id: 'PLAT-104', title: 'Dashboard widget layout', type: 'feature', createdAt: '2024-04-08', startedAt: '2024-04-09', completedAt: '2024-04-14', deployedAt: '2024-04-15', storyPoints: 5 },
  { id: 'PLAT-105', title: 'Memory leak in event handler', type: 'bug', createdAt: '2024-04-10', startedAt: '2024-04-11', completedAt: '2024-04-12', deployedAt: '2024-04-13', storyPoints: 2 },
  { id: 'PLAT-106', title: 'Upgrade React to v18', type: 'chore', createdAt: '2024-04-12', startedAt: '2024-04-15', completedAt: '2024-04-22', deployedAt: '2024-04-23', storyPoints: 8 },
  { id: 'PLAT-107', title: 'Export CSV feature', type: 'feature', createdAt: '2024-04-14', startedAt: '2024-04-16', completedAt: '2024-04-19', deployedAt: '2024-04-21', storyPoints: 3 },
  { id: 'PLAT-108', title: 'Tooltip alignment bug', type: 'bug', createdAt: '2024-04-18', startedAt: '2024-04-19', completedAt: '2024-04-20', deployedAt: '2024-04-21', storyPoints: 1 },
  { id: 'PLAT-109', title: 'Dark mode persistence', type: 'feature', createdAt: '2024-04-20', startedAt: '2024-04-21', completedAt: '2024-04-25', deployedAt: '2024-04-26', storyPoints: 3 },
  { id: 'PLAT-110', title: 'Broken pagination on mobile', type: 'bug', createdAt: '2024-04-23', startedAt: '2024-04-23', completedAt: '2024-04-24', deployedAt: '2024-04-25', storyPoints: 2 },
  { id: 'PLAT-111', title: 'Search debounce optimization', type: 'feature', createdAt: '2024-04-24', startedAt: '2024-04-25', completedAt: '2024-04-28', deployedAt: '2024-04-29', storyPoints: 2 },
  { id: 'PLAT-112', title: 'Stale cache on logout', type: 'bug', createdAt: '2024-04-26', startedAt: '2024-04-27', completedAt: '2024-04-28', deployedAt: '2024-04-29', storyPoints: 2 },
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
  { id: 'PR-201', title: 'feat: OAuth2 login flow', issueId: 'PLAT-101', openedAt: '2024-04-05', firstReviewAt: '2024-04-06', mergedAt: '2024-04-07', linesAdded: 320, linesRemoved: 45, comments: 8, approved: true },
  { id: 'PR-202', title: 'fix: navbar z-index', issueId: 'PLAT-102', openedAt: '2024-04-02', firstReviewAt: '2024-04-02', mergedAt: '2024-04-03', linesAdded: 12, linesRemoved: 3, comments: 2, approved: true },
  { id: 'PR-203', title: 'chore: refactor API client', issueId: 'PLAT-103', openedAt: '2024-04-08', firstReviewAt: '2024-04-09', mergedAt: '2024-04-10', linesAdded: 180, linesRemoved: 240, comments: 12, approved: true },
  { id: 'PR-204', title: 'feat: dashboard widget layout', issueId: 'PLAT-104', openedAt: '2024-04-11', firstReviewAt: '2024-04-13', mergedAt: '2024-04-14', linesAdded: 450, linesRemoved: 90, comments: 15, approved: true },
  { id: 'PR-205', title: 'fix: memory leak in event handler', issueId: 'PLAT-105', openedAt: '2024-04-11', firstReviewAt: '2024-04-11', mergedAt: '2024-04-12', linesAdded: 34, linesRemoved: 28, comments: 4, approved: true },
  { id: 'PR-206', title: 'chore: upgrade React v18', issueId: 'PLAT-106', openedAt: '2024-04-17', firstReviewAt: '2024-04-19', mergedAt: '2024-04-22', linesAdded: 890, linesRemoved: 420, comments: 23, approved: true },
  { id: 'PR-207', title: 'feat: export CSV', issueId: 'PLAT-107', openedAt: '2024-04-17', firstReviewAt: '2024-04-18', mergedAt: '2024-04-19', linesAdded: 145, linesRemoved: 20, comments: 6, approved: true },
  { id: 'PR-208', title: 'fix: tooltip alignment', issueId: 'PLAT-108', openedAt: '2024-04-19', firstReviewAt: '2024-04-20', mergedAt: '2024-04-20', linesAdded: 8, linesRemoved: 5, comments: 1, approved: true },
  { id: 'PR-209', title: 'feat: dark mode persistence', issueId: 'PLAT-109', openedAt: '2024-04-22', firstReviewAt: '2024-04-23', mergedAt: '2024-04-25', linesAdded: 95, linesRemoved: 30, comments: 7, approved: true },
  { id: 'PR-210', title: 'fix: mobile pagination', issueId: 'PLAT-110', openedAt: '2024-04-23', firstReviewAt: '2024-04-24', mergedAt: '2024-04-24', linesAdded: 55, linesRemoved: 40, comments: 3, approved: true },
  { id: 'PR-211', title: 'feat: search debounce', issueId: 'PLAT-111', openedAt: '2024-04-25', firstReviewAt: '2024-04-26', mergedAt: '2024-04-28', linesAdded: 42, linesRemoved: 18, comments: 5, approved: true },
  { id: 'PR-212', title: 'fix: stale cache logout', issueId: 'PLAT-112', openedAt: '2024-04-27', firstReviewAt: '2024-04-28', mergedAt: '2024-04-28', linesAdded: 28, linesRemoved: 15, comments: 2, approved: true },
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
  { id: 'DEP-301', issueId: 'PLAT-101', prId: 'PR-201', deployedAt: '2024-04-08', environment: 'production', status: 'success', durationMinutes: 8 },
  { id: 'DEP-302', issueId: 'PLAT-102', prId: 'PR-202', deployedAt: '2024-04-04', environment: 'production', status: 'success', durationMinutes: 4 },
  { id: 'DEP-303', issueId: 'PLAT-103', prId: 'PR-203', deployedAt: '2024-04-11', environment: 'production', status: 'success', durationMinutes: 12 },
  { id: 'DEP-304', issueId: 'PLAT-104', prId: 'PR-204', deployedAt: '2024-04-15', environment: 'production', status: 'success', durationMinutes: 9 },
  { id: 'DEP-305', issueId: 'PLAT-105', prId: 'PR-205', deployedAt: '2024-04-13', environment: 'production', status: 'success', durationMinutes: 5 },
  { id: 'DEP-306', issueId: 'PLAT-106', prId: 'PR-206', deployedAt: '2024-04-23', environment: 'production', status: 'failed', durationMinutes: 15 },
  { id: 'DEP-306B', issueId: 'PLAT-106', prId: 'PR-206', deployedAt: '2024-04-24', environment: 'production', status: 'success', durationMinutes: 11 },
  { id: 'DEP-307', issueId: 'PLAT-107', prId: 'PR-207', deployedAt: '2024-04-21', environment: 'production', status: 'success', durationMinutes: 7 },
  { id: 'DEP-308', issueId: 'PLAT-108', prId: 'PR-208', deployedAt: '2024-04-21', environment: 'production', status: 'success', durationMinutes: 4 },
  { id: 'DEP-309', issueId: 'PLAT-109', prId: 'PR-209', deployedAt: '2024-04-26', environment: 'production', status: 'success', durationMinutes: 8 },
  { id: 'DEP-310', issueId: 'PLAT-110', prId: 'PR-210', deployedAt: '2024-04-25', environment: 'production', status: 'success', durationMinutes: 6 },
  { id: 'DEP-311', issueId: 'PLAT-111', prId: 'PR-211', deployedAt: '2024-04-29', environment: 'production', status: 'success', durationMinutes: 7 },
  { id: 'DEP-312', issueId: 'PLAT-112', prId: 'PR-212', deployedAt: '2024-04-29', environment: 'production', status: 'success', durationMinutes: 5 },
];

// Weekly trend data for sparklines
export const WEEKLY_TRENDS = {
  leadTime:          [5.2, 6.8, 4.9, 7.1, 5.5, 6.2, 5.8],
  cycleTime:         [2.1, 2.8, 1.9, 3.2, 2.4, 2.6, 2.3],
  bugRate:           [25, 30, 22, 35, 28, 33, 31],
  deployFrequency:   [2, 3, 2, 1, 3, 2, 3],
  prThroughput:      [3, 2, 4, 2, 3, 3, 2],
};
