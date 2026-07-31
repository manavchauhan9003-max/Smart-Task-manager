import React from 'react';
import { cn } from '../../lib/utils';
import { TaskPriority, TaskStatus } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'priority' | 'status' | 'default' | 'indigo' | 'emerald' | 'amber' | 'rose';
  priority?: TaskPriority;
  status?: TaskStatus;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  priority,
  status,
  ...props
}) => {
  let badgeStyles = 'bg-zinc-800 text-zinc-300 border-zinc-700/60';

  if (priority === 'high' || variant === 'rose') {
    badgeStyles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (priority === 'medium' || variant === 'amber') {
    badgeStyles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (priority === 'low' || variant === 'indigo') {
    badgeStyles = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  } else if (status === 'completed' || variant === 'emerald') {
    badgeStyles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (status === 'in_progress') {
    badgeStyles = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  } else if (status === 'pending') {
    badgeStyles = 'bg-zinc-800/80 text-zinc-400 border-zinc-700/50';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase',
        badgeStyles,
        className
      )}
      {...props}
    >
      {children || priority || status}
    </span>
  );
};
