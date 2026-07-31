import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Tasks Found',
  description = 'No tasks match your current filter criteria. Create a task to get started.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="w-full rounded-2xl border border-dashed border-zinc-800 p-12 text-center flex flex-col items-center justify-center glass-card">
      <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
        {icon || <FolderOpen className="w-7 h-7 text-indigo-400" />}
      </div>
      <h3 className="text-base font-semibold text-zinc-200 mb-1">{title}</h3>
      <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="accent" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
