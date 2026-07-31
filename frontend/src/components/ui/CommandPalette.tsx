import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, CheckSquare, Sparkles, BarChart2, Settings, Moon, Sun, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateTask?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenCreateTask,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const actions = [
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />,
      perform: () => { navigate('/'); onClose(); },
    },
    {
      id: 'nav-tasks',
      label: 'Go to My Tasks',
      icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
      perform: () => { navigate('/tasks'); onClose(); },
    },
    {
      id: 'nav-ai',
      label: 'Open AI Productivity Studio',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      perform: () => { navigate('/ai-studio'); onClose(); },
    },
    {
      id: 'nav-analytics',
      label: 'View Analytics',
      icon: <BarChart2 className="w-4 h-4 text-sky-400" />,
      perform: () => { navigate('/analytics'); onClose(); },
    },
    {
      id: 'nav-settings',
      label: 'Open Workspace Settings',
      icon: <Settings className="w-4 h-4 text-zinc-400" />,
      perform: () => { navigate('/settings'); onClose(); },
    },
    {
      id: 'action-create',
      label: 'Create New Task',
      icon: <Plus className="w-4 h-4 text-indigo-400" />,
      perform: () => { if (onOpenCreateTask) onOpenCreateTask(); onClose(); },
    },
    {
      id: 'action-theme',
      label: `Toggle Theme (Current: ${theme})`,
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      perform: () => { toggleTheme(); onClose(); },
    },
    {
      id: 'action-logout',
      label: 'Sign Out',
      icon: <LogOut className="w-4 h-4 text-rose-400" />,
      perform: () => { logout(); onClose(); },
    },
  ];

  const filtered = actions.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center px-4 border-b border-zinc-800/80">
            <Search className="w-5 h-5 text-zinc-400 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search workspace... (Esc to cancel)"
              className="w-full h-14 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              autoFocus
            />
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">ESC</span>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">No matching commands found.</div>
            ) : (
              filtered.map((action) => (
                <button
                  key={action.id}
                  onClick={action.perform}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-zinc-200 hover:bg-indigo-600/20 hover:text-white transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    {action.icon}
                    <span>{action.label}</span>
                  </div>
                  <span className="text-xs text-zinc-500 group-hover:text-zinc-300">Run</span>
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
