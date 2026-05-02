'use client';
// components/ui/Header.tsx
import { Sun, Moon, Bell, Settings } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  developer: { name: string; role: string; avatar: string };
}

export default function Header({ theme, onToggleTheme, developer }: Props) {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #1d6fb8 0%, #8b5cf6 100%)' }}
          >
            DP
          </div>
          <div>
            <span
              className="font-semibold text-base"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              DevPulse
            </span>
            <span
              className="ml-2 text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
            >
              v1.0 MVP
            </span>
          </div>
        </div>

        {/* Date range */}
        <div
          className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
        >
          <span>📅</span>
          <span>Apr 1 – Apr 30, 2024</span>
          <span
            className="ml-1 text-xs px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)' }}
          >
            30d
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            title="Notifications"
          >
            <Bell size={16} />
          </button>

          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ml-1"
            style={{ background: 'linear-gradient(135deg, #1d6fb8 0%, #8b5cf6 100%)' }}
            title={developer.name}
          >
            {developer.avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
