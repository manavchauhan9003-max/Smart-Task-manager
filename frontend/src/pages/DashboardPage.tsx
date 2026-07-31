import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Flame,
  Calendar as CalendarIcon,
  Activity,
  Plus,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { taskService } from '../services/taskService';
import { AnalyticsSummary, AIInsight } from '../types';
import { formatDate } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { day: 'Mon', completed: 4, created: 6 },
  { day: 'Tue', completed: 7, created: 5 },
  { day: 'Wed', completed: 5, created: 8 },
  { day: 'Thu', completed: 9, created: 4 },
  { day: 'Fri', completed: 11, created: 7 },
  { day: 'Sat', completed: 6, created: 3 },
  { day: 'Sun', completed: 8, created: 5 },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, toggleComplete } = useTasks();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const summary = await taskService.getAnalyticsSummary();
      const insights = await taskService.getAIInsights();
      setAnalytics(summary);
      setAiInsights(insights);
    };
    loadDashboardData();
  }, [tasks]);

  const upcomingTasks = tasks.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Productivity Streak: 8 Days</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name || user?.username || 'Alex'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Here is your daily task overview and AI productivity insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/analytics')} leftIcon={<TrendingUp className="w-4 h-4 text-emerald-400" />}>
            Analytics Report
          </Button>
          <Button variant="accent" size="sm" onClick={() => navigate('/ai-studio')} leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}>
            AI Assistant
          </Button>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Tasks</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">{analytics?.totalTasks || tasks.length}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3 h-3" /> +12% from last week
            </p>
          </div>
        </Card>

        <Card hoverable className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">{analytics?.completedTasks || 0}</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-medium">
              Completion Rate: <span className="text-emerald-400 font-bold">{analytics?.completionRate || 0}%</span>
            </p>
          </div>
        </Card>

        <Card hoverable className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">In Progress</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">{analytics?.pendingTasks || 0}</h3>
            <p className="text-[11px] text-amber-400 mt-1 font-medium">Active tasks in workspace</p>
          </div>
        </Card>

        <Card hoverable className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">High Priority</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">{analytics?.highPriorityTasks || 0}</h3>
            <p className="text-[11px] text-rose-400 mt-1 font-medium">Requires immediate focus</p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid: Tasks & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Today's Tasks & Weekly Completion Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Weekly Productivity Trend</h3>
                <p className="text-xs text-zinc-400">Tasks completed vs created this week</p>
              </div>
              <Badge variant="indigo">7-Day View</Badge>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Upcoming Tasks List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">Today’s Priority Tasks</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
                View All Tasks →
              </Button>
            </div>

            <div className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">No active tasks. Enjoy your day!</p>
              ) : (
                upcomingTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ x: 3 }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                          task.status === 'completed'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-zinc-700 hover:border-indigo-500'
                        }`}
                      >
                        {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <h4 className={`text-sm font-medium text-zinc-200 ${task.status === 'completed' ? 'line-through text-zinc-500' : ''}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge priority={task.priority} />
                          <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" /> {formatDate(task.due_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Suggestions & Activity Feed */}
        <div className="space-y-6">
          {/* AI Banner Card */}
          <Card className="p-6 bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-zinc-950 border-indigo-500/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Productivity Insight</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">Smart Schedule Suggestion</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              You have 2 high-priority tasks due this week. We recommend allocating a 90-minute deep focus block tomorrow morning.
            </p>
            <Button variant="accent" size="sm" className="w-full" onClick={() => navigate('/ai-studio')}>
              Apply AI Schedule Block
            </Button>
          </Card>

          {/* Activity Timeline Stream */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Recent Activity</span>
              </h4>
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Live Feed</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
                <div>
                  <p className="text-zinc-300 font-medium">Completed "Refactor Axios Interceptors"</p>
                  <span className="text-[10px] text-zinc-500">2 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5" />
                <div>
                  <p className="text-zinc-300 font-medium">Created task "Design Dark Mode Components"</p>
                  <span className="text-[10px] text-zinc-500">5 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                <div>
                  <p className="text-zinc-300 font-medium">AI generated daily productivity summary</p>
                  <span className="text-[10px] text-zinc-500">1 day ago</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
