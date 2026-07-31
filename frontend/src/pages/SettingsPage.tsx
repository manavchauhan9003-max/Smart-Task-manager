import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Shield, Bell, Moon, Sun, Key, Check } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || user?.username || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'alex.rivera@linear.app');
  const [apiKey, setApiKey] = useState('tf_live_98a72b14f8c92e109d');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success('Workspace settings updated!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Workspace Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage your account preferences, themes, security, and API keys.</p>
      </div>

      {/* Account Settings */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <User className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Profile Details</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Display Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="accent" leftIcon={isSaved ? <Check className="w-4 h-4" /> : undefined}>
              {isSaved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance & Theme */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
          <h3 className="text-base font-bold text-white">Appearance & Theme</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Theme Mode</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Current mode: {theme === 'dark' ? 'Dark (#09090B First)' : 'Light Mode'}</p>
          </div>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Toggle Theme ({theme.toUpperCase()})
          </Button>
        </div>
      </Card>

      {/* API Key */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Key className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">FastAPI Access Tokens</h3>
        </div>

        <div className="space-y-3">
          <Input label="Personal Access Key" value={apiKey} readOnly />
          <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(apiKey); toast.info('API Key copied to clipboard!'); }}>
            Copy API Key
          </Button>
        </div>
      </Card>
    </div>
  );
};
