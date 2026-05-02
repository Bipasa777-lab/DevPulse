'use client';
// components/panels/ActivityFeed.tsx
interface ActivityItem {
  id: string;
  deployedAt: string;
  environment: string;
  status: string;
  prTitle: string;
  issueTitle: string;
  prId: string;
  issueId: string;
}

interface Props {
  activities: ActivityItem[];
  expanded?: boolean;
}

const statusConfig = {
  success: { icon: '✅', label: 'Deployed', color: 'var(--accent-green)', bg: 'var(--accent-green-light)' },
  failed: { icon: '❌', label: 'Failed', color: 'var(--accent-red)', bg: 'var(--accent-red-light)' },
  'rolled-back': { icon: '↩️', label: 'Rolled back', color: 'var(--accent-amber)', bg: 'var(--accent-amber-light)' },
};

export default function ActivityFeed({ activities, expanded = false }: Props) {
  const items = expanded ? activities : activities.slice(0, 5);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Recent Deployments
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Latest production activity
          </p>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full"
          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
        >
          {activities.length} total
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const cfg = statusConfig[item.status as keyof typeof statusConfig] ?? statusConfig.success;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-150"
              style={{
                backgroundColor: idx === 0 ? 'var(--bg-surface-2)' : 'transparent',
                border: '1px solid transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-surface-2)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = idx === 0 ? 'var(--bg-surface-2)' : 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
              }}
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <span className="text-base">{cfg.icon}</span>
                {idx < items.length - 1 && (
                  <div
                    className="w-px flex-1 mt-2"
                    style={{ backgroundColor: 'var(--border)', minHeight: '16px' }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.prTitle || item.issueTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: cfg.bg,
                      color: cfg.color,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                  >
                    {item.prId}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                  >
                    {item.issueId}
                  </span>
                </div>
              </div>

              <div
                className="text-xs flex-shrink-0"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
              >
                {new Date(item.deployedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          );
        })}
      </div>

      {!expanded && activities.length > 5 && (
        <div
          className="mt-3 pt-3 text-center text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)' }}
        >
          +{activities.length - 5} more in Activity tab
        </div>
      )}
    </div>
  );
}
