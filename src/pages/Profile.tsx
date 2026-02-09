import React from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Moon, Sun, Monitor, LogOut, Crown, Briefcase, GraduationCap, Coffee, Palette } from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';
import { Persona } from '../types';

export const Profile = () => {
  const { preferences, updatePreferences, stats } = useStore();
  const { user, logout } = useAuthStore();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const personas: { id: Persona; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: User },
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'creator', label: 'Creator', icon: Palette },
    { id: 'hustler', label: 'Hustler', icon: Briefcase },
    { id: 'calm', label: 'Calm', icon: Coffee },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>

      <Card className="flex items-center gap-4 p-6 relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
        <img src={user?.avatar} alt="User" className="w-16 h-16 rounded-full bg-slate-100 z-10" />
        <div className="z-10">
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-sm text-slate-500 mb-2">{user?.email}</p>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
              stats.subscriptionTier === 'elite' ? "bg-amber-100 text-amber-700" : 
              stats.subscriptionTier === 'pro' ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-600"
            )}>
              {stats.subscriptionTier} Plan
            </span>
          </div>
        </div>
        {stats.subscriptionTier === 'elite' && (
           <div className="absolute right-0 top-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -mr-10 -mt-10" />
        )}
      </Card>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Persona Mode</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {personas.map((p) => {
            const isLocked = (p.id === 'hustler' || p.id === 'student') && stats.subscriptionTier !== 'elite';
            return (
              <button
                key={p.id}
                onClick={() => {
                  if (isLocked) {
                    toast.error("Upgrade to Elite to unlock this persona!");
                    return;
                  }
                  updatePreferences({ persona: p.id });
                  toast.success(`Switched to ${p.label} Mode`);
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all relative",
                  preferences.persona === p.id
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-300",
                  isLocked && "opacity-60 cursor-not-allowed"
                )}
              >
                {isLocked && <Crown className="w-3 h-3 absolute top-2 right-2 text-amber-500" />}
                <p.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{p.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Appearance</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', icon: Sun, label: 'Light' },
            { id: 'dark', icon: Moon, label: 'Dark' },
            { id: 'system', icon: Monitor, label: 'System' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleThemeChange(item.id as any)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                preferences.theme === item.id
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                  : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-300"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50" onClick={logout}>
        <LogOut className="w-4 h-4" />
        Log Out
      </Button>
    </div>
  );
};
