import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(name, email, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/auth/login');
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      {/* Left Column: Branding */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-950 border-r border-zinc-800/80 p-12 flex-col justify-between overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              Start Your Free Workspace
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              Supercharge your personal & team productivity.
            </h2>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              Experience the next generation of task management with custom Kanban views, automatic AI scheduling, and real-time analytics.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500">© 2026 TaskFlow Inc. All rights reserved.</div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8 glass-card p-8 sm:p-10 border border-zinc-800"
        >
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-xs text-zinc-400 mt-1">Get started with your 14-day free trial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<UserIcon className="w-4 h-4" />}
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer hover:text-zinc-200">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <Button type="submit" variant="accent" className="w-full h-11 text-sm mt-4" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create account
            </Button>
          </form>

          <div className="text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
