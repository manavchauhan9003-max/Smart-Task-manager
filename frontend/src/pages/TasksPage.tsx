import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  List as ListIcon,
  Columns,
  Calendar as CalendarIcon,
  Search,
  Plus,
  CheckCircle2,
  Trash2,
  Edit,
  Clock,
  MoreVertical,
  CheckSquare,
  MessageSquare,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Sheet } from '../components/ui/Sheet';
import { EmptyState } from '../components/ui/EmptyState';
import { useTasks } from '../hooks/useTasks';
import { Task, ViewMode, TaskStatus } from '../types';
import { formatDate } from '../lib/utils';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    toggleComplete,
    deleteTask,
  } = useTasks();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Workspace Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Task Workspace</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage, organize, and execute your project tasks.</p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Toolbar Search & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card">
        <div className="flex-1 min-w-[240px] max-w-md">
          <Input
            placeholder="Filter tasks by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="h-10 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-zinc-900/60 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${selectedStatus === 'all' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${selectedStatus === 'pending' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${selectedStatus === 'completed' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'}`}
            >
              Completed
            </button>
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="h-9 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-xs text-zinc-200 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* View Mode Content Render */}
      {tasks.length === 0 ? (
        <EmptyState title="No Tasks Found" description="Try adjusting your search query or status filter." />
      ) : viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Pending */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending ({pendingTasks.length})
              </span>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <KanbanCard key={task.id} task={task} onOpenDetail={openDetail} onToggleComplete={toggleComplete} onDelete={deleteTask} />
              ))}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" /> In Progress ({inProgressTasks.length})
              </span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <KanbanCard key={task.id} task={task} onOpenDetail={openDetail} onToggleComplete={toggleComplete} onDelete={deleteTask} />
              ))}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed ({completedTasks.length})
              </span>
            </div>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <KanbanCard key={task.id} task={task} onOpenDetail={openDetail} onToggleComplete={toggleComplete} onDelete={deleteTask} />
              ))}
            </div>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-2">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ x: 2 }}
              onClick={() => openDetail(task)}
              className="flex items-center justify-between p-4 rounded-xl glass-card hover:border-zinc-700 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                    task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-700 hover:border-indigo-500'
                  }`}
                >
                  {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <span className={`text-sm font-semibold text-zinc-100 ${task.status === 'completed' ? 'line-through text-zinc-500' : ''}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge priority={task.priority} />
                <span className="text-xs text-zinc-500">{formatDate(task.due_date)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onOpenDetail={openDetail} onToggleComplete={toggleComplete} onDelete={deleteTask} />
          ))}
        </div>
      ) : (
        /* Calendar View Mock */
        <Card className="p-8 text-center space-y-4">
          <CalendarIcon className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Calendar Schedule View</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Interactive month grid displaying tasks scheduled across August 2026.
          </p>
        </Card>
      )}

      {/* Task Details Drawer Sheet */}
      <Sheet isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Task Details">
        {selectedTask && (
          <div className="space-y-6 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge priority={selectedTask.priority} />
                <Badge status={selectedTask.status} />
              </div>
              <h3 className="text-xl font-bold text-white">{selectedTask.title}</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {selectedTask.description || 'No additional task description provided.'}
              </p>
            </div>

            {/* Subtasks Section */}
            <div className="border-t border-zinc-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Subtasks ({selectedTask.subtasks?.length || 0})</span>
              </h4>
              <div className="space-y-2">
                {selectedTask.subtasks && selectedTask.subtasks.length > 0 ? (
                  selectedTask.subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                      <CheckSquare className={`w-4 h-4 ${st.completed ? 'text-emerald-400' : 'text-zinc-600'}`} />
                      <span className={st.completed ? 'line-through text-zinc-500' : ''}>{st.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">No subtasks created for this item.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-zinc-800 pt-6 flex items-center justify-between">
              <Button variant="danger" size="sm" onClick={() => { deleteTask(selectedTask.id); setIsDetailOpen(false); }}>
                Delete Task
              </Button>
              <Button
                variant={selectedTask.status === 'completed' ? 'secondary' : 'accent'}
                size="sm"
                onClick={() => { toggleComplete(selectedTask.id); setIsDetailOpen(false); }}
              >
                {selectedTask.status === 'completed' ? 'Reopen Task' : 'Mark Completed'}
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
};

const KanbanCard: React.FC<{
  task: Task;
  onOpenDetail: (t: Task) => void;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ task, onOpenDetail, onToggleComplete, onDelete }) => {
  return (
    <Card hoverable className="p-4 space-y-3 cursor-pointer" onClick={() => onOpenDetail(task)}>
      <div className="flex items-start justify-between gap-2">
        <h4 className={`text-sm font-semibold text-zinc-100 leading-snug ${task.status === 'completed' ? 'line-through text-zinc-500' : ''}`}>
          {task.title}
        </h4>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
            task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-700 hover:border-indigo-500'
          }`}
        >
          {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {task.description && <p className="text-xs text-zinc-400 line-clamp-2">{task.description}</p>}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
        <Badge priority={task.priority} />
        <span className="text-[10px] text-zinc-500">{formatDate(task.due_date)}</span>
      </div>
    </Card>
  );
};
