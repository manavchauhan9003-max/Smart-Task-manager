import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, Calendar, Zap, ArrowRight, Brain, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { useTasks } from '../hooks/useTasks';

export const AIStudioPage: React.FC = () => {
  const [nlInput, setNlInput] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hello Alex! I am your AI Productivity Copilot. How can I assist with your workspace today?' },
  ]);

  const { createTask } = useTasks();

  const handleNlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlInput.trim()) return;
    toast.promise(createTask({ title: nlInput, priority: 'high', description: 'Parsed via AI Natural Language Engine.' }), {
      loading: 'Parsing natural language input with AI...',
      success: 'Task created via AI Natural Language parser!',
      error: 'Failed to create task.',
    });
    setNlInput('');
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userText = chatMessage;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: `Based on your recent workspace velocity, focusing on high-priority tasks first will increase your completion rate by 22%.` },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>TaskFlow AI Engine v2.4</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Productivity Studio</h1>
          <p className="text-xs text-zinc-400 mt-1">Smart task scheduling, automated breakdown, and natural language creation.</p>
        </div>
      </div>

      {/* Natural Language Task Creation Bar */}
      <Card className="p-6 bg-gradient-to-r from-indigo-950/80 via-zinc-900 to-purple-950/60 border-indigo-500/30">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          Natural Language Task Parser
        </h3>
        <p className="text-xs text-zinc-400 mb-4">Type prompt like: "Schedule team sync tomorrow at 3pm with high priority"</p>
        <form onSubmit={handleNlSubmit} className="flex gap-3">
          <Input
            placeholder="Type a natural language prompt..."
            value={nlInput}
            onChange={(e) => setNlInput(e.target.value)}
            className="flex-1 bg-zinc-950/90 border-zinc-700"
          />
          <Button type="submit" variant="accent" rightIcon={<Sparkles className="w-4 h-4 text-amber-300" />}>
            Parse & Create
          </Button>
        </form>
      </Card>

      {/* AI Suggestions Grid & Chat Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: AI Suggestions Cards */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">AI Automation Suggestions</h3>

          <Card hoverable className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="indigo">Smart Scheduling</Badge>
              <span className="text-[10px] text-zinc-500">Predicted Confidence: 96%</span>
            </div>
            <h4 className="text-sm font-semibold text-zinc-100">Deep Focus Block Recommendation</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You have 2 high-priority tasks due this week. Allocate a 90-minute focus block tomorrow at 9:30 AM for peak cognitive clarity.
            </p>
            <Button variant="secondary" size="sm" onClick={() => toast.success('Focus block added to calendar!')}>
              Schedule Focus Block
            </Button>
          </Card>

          <Card hoverable className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="emerald">Automated Subtasks</Badge>
              <span className="text-[10px] text-zinc-500">AI Breakdown</span>
            </div>
            <h4 className="text-sm font-semibold text-zinc-100">Breakdown "Audit Recharts Performance"</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Splitting this task into 3 subtasks (Memoize components, reduce bundle size, benchmark 60fps) will accelerate delivery.
            </p>
            <Button variant="secondary" size="sm" onClick={() => toast.success('Subtasks generated!')}>
              Generate Subtasks
            </Button>
          </Card>
        </div>

        {/* Right Column: AI Assistant Chat Interface */}
        <Card className="p-6 flex flex-col h-[420px] justify-between">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">TaskFlow Copilot</h3>
            </div>
            <Badge variant="emerald">Online</Badge>
          </div>

          <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2 text-xs">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
            <Input
              placeholder="Ask Copilot anything about your tasks..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="h-10 text-xs"
            />
            <Button type="submit" variant="accent" size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
