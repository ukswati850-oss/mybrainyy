import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, MessageCircle, FileText, Music, Check, Power } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export const Integrations = () => {
  const { integrations, toggleIntegration } = useStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return Calendar;
      case 'message-circle': return MessageCircle;
      case 'file-text': return FileText;
      case 'music': return Music;
      default: return FileText;
    }
  };

  const handleToggle = (id: string, name: string, isConnected: boolean) => {
    toggleIntegration(id);
    if (!isConnected) {
      toast.success(`Connected to ${name}`);
    } else {
      toast("Disconnected", { icon: '🔌' });
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Integrations</h1>
        <p className="text-slate-500">Connect Brainy to your favorite tools.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((app) => {
          const Icon = getIcon(app.icon);
          return (
            <Card key={app.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  app.isConnected ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{app.name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{app.type}</p>
                </div>
              </div>
              
              <Button 
                variant={app.isConnected ? 'outline' : 'primary'}
                size="sm"
                onClick={() => handleToggle(app.id, app.name, app.isConnected)}
                className={cn(app.isConnected && "border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700")}
              >
                {app.isConnected ? (
                  <>
                    <Check className="w-4 h-4 mr-1" /> Connected
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 mr-1" /> Connect
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
