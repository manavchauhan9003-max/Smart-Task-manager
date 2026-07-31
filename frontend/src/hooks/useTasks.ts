import { useState, useEffect, useCallback } from 'react';
import { Task, TaskPriority, TaskStatus, ViewMode } from '../types';
import { taskService } from '../services/taskService';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasks(selectedPriority !== 'all' ? selectedPriority : undefined);
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPriority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: { title: string; priority?: TaskPriority; description?: string }) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task created successfully!');
      return newTask;
    } catch {
      toast.error('Failed to create task');
      return null;
    }
  };

  const updateTask = async (id: number, data: Partial<Task>) => {
    try {
      const updated = await taskService.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      toast.success('Task updated');
      return updated;
    } catch {
      toast.error('Failed to update task');
      return null;
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      const updated = await taskService.toggleComplete(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success(updated.status === 'completed' ? 'Task completed! 🎉' : 'Task reopened');
    } catch {
      toast.error('Failed to update task status');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.info('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

    let matchesStatus = true;
    if (selectedStatus === 'pending') matchesStatus = task.status !== 'completed';
    if (selectedStatus === 'completed') matchesStatus = task.status === 'completed';
    if (selectedStatus === 'in_progress') matchesStatus = task.status === 'in_progress';

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    refreshTasks: fetchTasks,
  };
}
