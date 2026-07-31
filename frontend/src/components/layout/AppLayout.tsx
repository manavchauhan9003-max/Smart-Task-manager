import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { NotificationCenter } from './NotificationCenter';
import { CommandPalette } from '../ui/CommandPalette';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { TaskPriority } from '../../types';
import { taskService } from '../../services/taskService';
import { toast } from 'sonner';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await taskService.createTask({ title, priority, description });
      toast.success('Task created successfully!');
      setTitle('');
      setDescription('');
      setIsCreateModalOpen(false);
      window.dispatchEvent(new Event('task_updated'));
    } catch {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenCommandPalette={() => setIsCommandOpen(true)}
          onOpenCreateTask={() => setIsCreateModalOpen(true)}
          onToggleNotifications={() => setIsNotificationsOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 border border-indigo-400/30 z-40 cursor-pointer"
        title="Create New Task"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenCreateTask={() => setIsCreateModalOpen(true)}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Create Task Global Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Task Title *"
            placeholder="e.g. Audit Recharts Performance"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full h-11 bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add specific instructions, notes or criteria..."
              className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" isLoading={isSubmitting}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
