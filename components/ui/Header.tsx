'use client';
// components/ui/Header.tsx
import { useState, useMemo, useEffect } from 'react';
import { Sun, Moon, Bell, Settings } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  developer: { name: string; role: string; avatar: string };
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
}

export default function Header({ 
  theme, 
  onToggleTheme, 
  developer,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: Props) {
  
  
  // Real-time clock state
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysDifference = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

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
          </div>
        </div>

        {/* Date range */}
        <div
          className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
        >
          <span 
            className="text-xs font-medium px-2.5 py-0.5 rounded-md mr-1 transition-colors"
            style={{ 
              backgroundColor: theme === 'light' ? '#fef3c7' : '#451a03', 
              color: theme === 'light' ? '#b45309' : '#fbbf24', 
              fontFamily: 'sans-serif' 
            }}
          >
            {mounted ? currentTime.toLocaleString('en-US', { month: 'short', day: 'numeric' }) : '...'}
          </span>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
            style={{ color: 'var(--text-secondary)' }}
          />
          <span>–</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
            style={{ color: 'var(--text-secondary)' }}
          />
          <span
            className="ml-1 text-xs px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)' }}
          >
            {daysDifference}d
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
