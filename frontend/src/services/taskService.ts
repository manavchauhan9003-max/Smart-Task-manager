import { apiClient } from '../api/client';
import { Task, TaskPriority, TaskStatus, AnalyticsSummary, AIInsight } from '../types';

const INITIAL_MOCK_TASKS: Task[] = [
  {
    id: 101,
    title: 'Design Dark Mode Glassmorphism Components',
    description: 'Implement #09090B primary theme tokens, Framer Motion spring presets, and translucent border shadows for Vercel/Linear design parity.',
    priority: 'high',
    status: 'in_progress',
    due_date: '2026-08-05',
    labels: ['UI/UX', 'Design System'],
    subtasks: [
      { id: 'st-1', title: 'Define CSS Variables in index.css', completed: true },
      { id: 'st-2', title: 'Build Glass Panel Utility Class', completed: true },
      { id: 'st-3', title: 'Add Raycast Keyboard Shortcut Badge', completed: false },
    ],
    comments_count: 5,
    created_at: '2026-07-28T10:00:00Z',
  },
  {
    id: 102,
    title: 'Refactor REST API Axios Interceptors',
    description: 'Add automated Bearer JWT injection, response error handling, and offline fallback resiliency.',
    priority: 'medium',
    status: 'completed',
    due_date: '2026-07-30',
    labels: ['Backend', 'Security'],
    subtasks: [
      { id: 'st-4', title: 'Configure Axios BaseURL', completed: true },
      { id: 'st-5', title: 'Handle 401 Unauthorized redirects', completed: true },
    ],
    comments_count: 2,
    created_at: '2026-07-26T14:30:00Z',
  },
  {
    id: 103,
    title: 'Implement AI Smart Task Scheduler',
    description: 'Parse natural language inputs like "Schedule team sync tomorrow at 3pm" and predict priority levels automatically.',
    priority: 'high',
    status: 'pending',
    due_date: '2026-08-02',
    labels: ['AI Engine', 'Productivity'],
    subtasks: [
      { id: 'st-6', title: 'Create Natural Language Input Bar', completed: true },
      { id: 'st-7', title: 'Build Priority Prediction Model UI', completed: false },
    ],
    comments_count: 8,
    created_at: '2026-07-29T09:15:00Z',
  },
  {
    id: 104,
    title: 'Audit Recharts Productivity Heatmap Performance',
    description: 'Verify 60fps chart render performance, code splitting, and memoization across Desktop, Laptop, Tablet and Mobile breakpoints.',
    priority: 'low',
    status: 'pending',
    due_date: '2026-08-10',
    labels: ['Analytics', 'Performance'],
    subtasks: [
      { id: 'st-8', title: 'Memoize Completion Trend Component', completed: false },
    ],
    comments_count: 1,
    created_at: '2026-07-31T11:00:00Z',
  },
  {
    id: 105,
    title: 'Configure Command Palette Ctrl+K Global Hotkey',
    description: 'Integrate Raycast-style command menu for quick navigation, theme toggling, and instant task creation.',
    priority: 'medium',
    status: 'completed',
    due_date: '2026-07-31',
    labels: ['UX', 'Shortcuts'],
    subtasks: [],
    comments_count: 3,
    created_at: '2026-07-31T08:00:00Z',
  },
];

let localTasks: Task[] = [...INITIAL_MOCK_TASKS];

export const taskService = {
  async getTasks(priority?: string): Promise<Task[]> {
    try {
      const url = priority ? `/tasks?priority=${priority}` : '/tasks';
      const response = await apiClient.get<Task[]>(url);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return localTasks;
    } catch {
      if (priority) {
        return localTasks.filter((t) => t.priority === priority);
      }
      return localTasks;
    }
  },

  async createTask(taskData: { title: string; priority?: TaskPriority; description?: string }): Promise<Task> {
    try {
      const response = await apiClient.post<Task>('/tasks', taskData);
      return response.data;
    } catch {
      const newTask: Task = {
        id: Date.now(),
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority || 'medium',
        status: 'pending',
        due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        labels: ['New'],
        subtasks: [],
        comments_count: 0,
        created_at: new Date().toISOString(),
      };
      localTasks = [newTask, ...localTasks];
      return newTask;
    }
  },

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task> {
    try {
      const response = await apiClient.put<Task>(`/tasks/${id}`, taskData);
      return response.data;
    } catch {
      localTasks = localTasks.map((t) => (t.id === id ? { ...t, ...taskData, updated_at: new Date().toISOString() } : t));
      const updated = localTasks.find((t) => t.id === id);
      return updated || ({ ...taskData, id } as Task);
    }
  },

  async toggleComplete(id: number): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(`/tasks/${id}/complete`);
      return response.data;
    } catch {
      localTasks = localTasks.map((t) => {
        if (t.id === id) {
          const nextStatus: TaskStatus = t.status === 'completed' ? 'pending' : 'completed';
          return { ...t, status: nextStatus, updated_at: new Date().toISOString() };
        }
        return t;
      });
      return localTasks.find((t) => t.id === id)!;
    }
  },

  async deleteTask(id: number): Promise<void> {
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch {
      localTasks = localTasks.filter((t) => t.id !== id);
    }
  },

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const total = localTasks.length;
    const completed = localTasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    const highPriority = localTasks.filter((t) => t.priority === 'high').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      highPriorityTasks: highPriority,
      productivityScore: Math.min(94, rate + 20),
      completionRate: rate,
      focusHoursThisWeek: 34.5,
    };
  },

  async getAIInsights(): Promise<AIInsight[]> {
    return [
      {
        id: 'ai-1',
        title: 'Smart Scheduling Suggestion',
        description: 'You have 2 high-priority tasks due this week. We suggest allocating a 90-minute deep focus block tomorrow morning.',
        type: 'scheduling',
        actionText: 'Schedule Deep Focus Block',
      },
      {
        id: 'ai-2',
        title: 'Automated Task Breakdown',
        description: 'Task "Design Dark Mode Components" can be split into 3 actionable subtasks for faster execution.',
        type: 'breakdown',
        actionText: 'Apply Subtask Breakdown',
      },
      {
        id: 'ai-3',
        title: 'Weekly Performance Outlook',
        description: 'Your task completion velocity is 18% higher than last week. Great momentum!',
        type: 'summary',
      },
    ];
  },
};
