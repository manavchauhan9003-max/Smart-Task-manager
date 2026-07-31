import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  glass = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -3, transition: { duration: 0.15 } } : undefined}
      className={cn(
        'rounded-2xl p-5 border transition-all duration-200',
        glass ? 'glass-card' : 'bg-zinc-900/80 border-zinc-800 shadow-xl',
        hoverable && 'hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-indigo-500/5',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
