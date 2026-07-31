import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-zinc-100 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs text-zinc-400 max-w-sm mt-2 mb-8 leading-relaxed">
        The workspace path you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="accent" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
