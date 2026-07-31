import React from 'react';
import { Sheet } from '../ui/Sheet';
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { NotificationItem } from '../../types';

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const notifications: NotificationItem[] = [
    {
      id: 'n-1',
      title: 'AI Smart Task Schedule',
      message: 'Allocated 90 minutes for "Design Glassmorphism Components" tomorrow morning.',
      time: '10 mins ago',
      read: false,
      type: 'info',
    },
    {
      id: 'n-2',
      title: 'Task Completed',
      message: 'Refactor REST API Axios Interceptors was marked as complete by Alex.',
      time: '1 hour ago',
      read: false,
      type: 'success',
    },
    {
      id: 'n-3',
      title: 'Upcoming Deadline Warning',
      message: 'Implement AI Smart Task Scheduler is due in 24 hours.',
      time: '3 hours ago',
      read: true,
      type: 'warning',
    },
  ];

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Notification Center">
      <div className="space-y-3 pt-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition-all ${
              n.read ? 'bg-zinc-900/40 border-zinc-800/60 opacity-70' : 'bg-zinc-900 border-zinc-700/80 shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {n.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-zinc-100">{n.title}</h4>
                  <span className="text-[10px] text-zinc-500">{n.time}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
};
