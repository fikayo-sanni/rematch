'use client';

import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  isOnline?: boolean;
  className?: string;
  borderColor?: string;
}

export function Avatar({
  src,
  alt,
  name,
  fallback,
  size = 'md',
  status,
  isOnline,
  className,
  borderColor
}: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizes = {
    xs: 'w-2 h-2 right-0 bottom-0',
    sm: 'w-2.5 h-2.5 right-0 bottom-0',
    md: 'w-3 h-3 right-0 bottom-0',
    lg: 'w-3.5 h-3.5 right-0.5 bottom-0.5',
    xl: 'w-4 h-4 right-1 bottom-1',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  // Resolve the display name for fallback
  const displayName = name || fallback || alt || 'User';

  // Resolve status - isOnline takes precedence if provided
  const resolvedStatus = isOnline !== undefined
    ? (isOnline ? 'online' : 'offline')
    : status;

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold',
          'bg-gradient-to-br from-gray-700 to-gray-800',
          'border-2 border-gray-700 overflow-hidden',
          sizes[size]
        )}
        style={borderColor ? { borderColor } : undefined}
      >
        {src ? (
          <img
            src={src}
            alt={alt || displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-300">{getInitials(displayName)}</span>
        )}
      </div>
      {resolvedStatus && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-gray-900',
            statusColors[resolvedStatus],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
