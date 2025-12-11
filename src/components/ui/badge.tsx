'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'glow';
  size?: 'sm' | 'md';
  className?: string;
  glowColor?: string;
  glow?: boolean;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'default', size = 'sm', className, glowColor, glow, style }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--badge-default-bg)] text-[var(--badge-default-text)] border-[var(--badge-default-border)]',
    success: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--badge-success-border)]',
    warning: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-[var(--badge-warning-border)]',
    danger: 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border-[var(--badge-danger-border)]',
    info: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border-[var(--badge-info-border)]',
    glow: 'bg-[var(--card-bg)] border-current',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        variant === 'glow' && glowColor && 'shadow-[0_0_8px_currentColor]',
        className
      )}
      style={style || (glowColor ? { color: glowColor } : undefined)}
    >
      {children}
    </span>
  );
}

interface CountBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export function CountBadge({ count, max = 99, className }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'min-w-[18px] h-[18px] px-1',
        'text-xs font-bold text-white',
        'bg-red-500 rounded-full',
        className
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}
