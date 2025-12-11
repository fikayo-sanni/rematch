'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/theme.store';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();

  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-14 h-7',
    lg: 'w-16 h-8',
  };

  const dotSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const translateClasses = {
    sm: 'translate-x-6',
    md: 'translate-x-7',
    lg: 'translate-x-8',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative rounded-full transition-colors duration-300',
        theme === 'dark' ? 'bg-gray-700' : 'bg-amber-100',
        sizeClasses[size],
        className
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div
        className={cn(
          'absolute top-1 left-1 rounded-full transition-all duration-300 flex items-center justify-center',
          theme === 'dark'
            ? 'bg-gray-900 text-yellow-400'
            : `bg-amber-400 text-white ${translateClasses[size]}`,
          dotSizeClasses[size]
        )}
      >
        {theme === 'dark' ? (
          <Moon className={iconSizeClasses[size]} />
        ) : (
          <Sun className={iconSizeClasses[size]} />
        )}
      </div>
    </button>
  );
}
