import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { TrendingUp, Award, Clock, Target, CheckCircle2 } from 'lucide-react';

const completionTrendData = [
  { week: 'W1', completed: 18, focusHours: 24 },
  { week: 'W2', completed: 24, focusHours: 32 },
  { week: 'W3', completed: 29, focusHours: 38 },
  { week: 'W4', completed: 35, focusHours: 42 },
];

const categoryData = [
  { name: 'UI/UX Design', value: 40, color: '#6366f1' },
  { name: 'Backend APIs', value: 25, color: '#22c55e' },
  { name: 'AI Features', value: 20, color: '#f59e0b' },
  { name: 'Testing & QA', value: 15, color: '#ec4899' },
];

const focusHoursData = [
  { day: 'Mon', hours: 6.5 },
  { day: 'Tue', hours: 8.0 },
  { day: 'Wed', hours: 7.2 },
  { day: 'Thu', hours: 9.1 },
  { day: 'Fri', hours: 5.8 },
  { day: 'Sat', hours: 3.5 },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Productivity Analytics</h1>
          <p className="text-xs text-zinc-400 mt-1">Deep insights into completion trends, category distribution, and focus hours.</p>
        </div>
        <Badge variant="emerald">Live Metrics Sync</Badge>
      </div>

      {/* Top 4 Metric Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Productivity Score</span>
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">94 / 100</h3>
          <p className="text-xs text-emerald-400 mt-1 font-medium">Top 5% among engineering teams</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Focus Hours</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">39.8 hrs</h3>
          <p className="text-xs text-emerald-400 mt-1 font-medium">+4.2 hrs higher than average</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tasks Delivered</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">35 Tasks</h3>
          <p className="text-xs text-zinc-400 mt-1 font-medium">Month of August 2026</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sprint Velocity</span>
            <TrendingUp className="w-5 h-5 text-sky-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">98.2%</h3>
          <p className="text-xs text-emerald-400 mt-1 font-medium">On-time completion rate</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Trend Area Chart */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-white mb-1">Monthly Completion Trend</h3>
          <p className="text-xs text-zinc-400 mb-6">Cumulative tasks completed over recent 4-week sprints</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionTrendData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily Focus Hours Bar Chart */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-white mb-1">Daily Focus Hours Breakdown</h3>
          <p className="text-xs text-zinc-400 mb-6">Deep work hours logged across the current week</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusHoursData}>
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Pie Chart */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-white mb-1">Task Category Allocation</h3>
          <p className="text-xs text-zinc-400 mb-6">Percentage breakdown of engineering and design effort</p>
          <div className="flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-semibold text-zinc-200">{cat.name}</span>
                  <span className="text-xs font-bold text-zinc-400 ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
