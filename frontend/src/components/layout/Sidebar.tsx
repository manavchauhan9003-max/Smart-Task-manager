import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'AI Studio', path: '/ai-studio', icon: Sparkles, badge: 'PRO' },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col justify-between h-screen sticky top-0 bg-zinc-950/90 border-r border-zinc-800/80 transition-all duration-300 z-40 backdrop-blur-xl',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 mb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-base font-bold text-zinc-100 tracking-tight leading-none">TaskFlow</h1>
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">Enterprise</span>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                )}
              >
                <Icon className={cn('w-5 h-5 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-indigo-400' : 'text-zinc-400')} />
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                    {item.label}
                  </motion.span>
                )}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer User Badge */}
      <div className="p-3 border-t border-zinc-800/80">
        <div className={cn('flex items-center gap-3 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80', collapsed && 'justify-center')}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 border border-white/10">
            {user?.username ? user.username.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-zinc-200 truncate">{user?.name || user?.username || 'Alex Rivera'}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email || 'alex@linear.app'}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-auto"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
