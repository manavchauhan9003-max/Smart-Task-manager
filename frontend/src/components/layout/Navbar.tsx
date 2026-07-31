import React, { useState } from 'react';
import { Search, Bell, Command, Sun, Moon, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenCreateTask: () => void;
  onToggleNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  onOpenCreateTask,
  onToggleNotifications,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Search Input Affordance */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 w-64 md:w-80 h-10 px-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:border-zinc-700 transition-all cursor-pointer shadow-inner group"
        >
          <Search className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
          <span className="flex-1 text-left">Search tasks, AI prompts...</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">
            <Command className="w-3 h-3" /> K
          </span>
        </button>
      </div>

      {/* Topbar Actions */}
      <div className="flex items-center gap-3">
        <Button variant="accent" size="sm" onClick={onOpenCreateTask} leftIcon={<Plus className="w-4 h-4" />}>
          New Task
        </Button>

        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60 transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60 transition-all cursor-pointer"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
