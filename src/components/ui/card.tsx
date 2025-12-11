'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, glow = false, glowColor, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      data-card
      className={cn(
        'bg-[var(--card-bg)] backdrop-blur-sm',
        'border border-[var(--card-border)] rounded-2xl',
        'overflow-hidden',
        hover && 'cursor-pointer transition-all duration-200 hover:border-[var(--card-border-hover)] hover:bg-[var(--card-bg-hover)]',
        glow && glowColor && 'shadow-[0_0_20px_-5px_var(--glow-color)]',
        onClick && 'cursor-pointer',
        className
      )}
      style={glowColor ? { '--glow-color': glowColor } as React.CSSProperties : undefined}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-4 py-3 border-b border-[var(--card-border)]', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-4 py-3 border-t border-[var(--card-border)] bg-[var(--card-bg)]', className)}>
      {children}
    </div>
  );
}
