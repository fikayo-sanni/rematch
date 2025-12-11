'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  glowColor?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, glowColor, children, disabled, ...props }, ref) => {
    const baseStyles = `
      relative inline-flex items-center justify-center font-semibold
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-violet-600 to-purple-600
        hover:from-violet-500 hover:to-purple-500
        text-white shadow-lg shadow-purple-500/25
        focus:ring-purple-500
      `,
      secondary: `
        bg-gray-800 border border-gray-700
        hover:bg-gray-700 hover:border-gray-600
        text-gray-100
        focus:ring-gray-500
      `,
      ghost: `
        bg-transparent hover:bg-white/5
        text-gray-300 hover:text-white
        focus:ring-gray-500
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-rose-600
        hover:from-red-500 hover:to-rose-500
        text-white shadow-lg shadow-red-500/25
        focus:ring-red-500
      `,
      success: `
        bg-gradient-to-r from-emerald-600 to-green-600
        hover:from-emerald-500 hover:to-green-500
        text-white shadow-lg shadow-emerald-500/25
        focus:ring-emerald-500
      `,
      glow: `
        bg-gray-900 border-2 border-current
        text-current
        hover:shadow-[0_0_20px_currentColor]
        focus:ring-current
      `,
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
      lg: 'text-base px-6 py-3 rounded-xl gap-2',
      icon: 'p-2.5 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={glowColor ? { color: glowColor } : undefined}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
