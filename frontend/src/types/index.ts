export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed' | 'in_progress' | 'overdue';

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string | null;
  labels?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  comments_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface User {
  id: number;
  username: string;
  name?: string | null;
  email: string;
  avatar_url?: string;
  created_at?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type ViewMode = 'kanban' | 'list' | 'grid' | 'calendar';

export interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  productivityScore: number;
  completionRate: number;
  focusHoursThisWeek: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'scheduling' | 'breakdown' | 'priority' | 'summary';
  actionText?: string;
  suggestedTasks?: Partial<Task>[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}
