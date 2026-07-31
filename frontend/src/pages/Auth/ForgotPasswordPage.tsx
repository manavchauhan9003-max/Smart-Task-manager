import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 text-zinc-100">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md glass-card p-8 sm:p-10 border border-zinc-800 space-y-6">
        <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Reset Link Sent!</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We have sent password reset instructions to <span className="text-indigo-400 font-semibold">{email}</span>. Please check your inbox.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Reset password</h2>
              <p className="text-xs text-zinc-400 mt-1">Enter your email and we’ll send a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button type="submit" variant="accent" className="w-full h-11 text-sm mt-2" isLoading={isLoading}>
                Send reset link
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};
