import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-zinc-800/60 border border-zinc-700/30',
        className
      )}
      {...props}
    />
  );
};
