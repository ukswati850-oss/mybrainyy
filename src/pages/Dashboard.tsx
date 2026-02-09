import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { Sun, ArrowRight, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XPBar } from '../components/gamification/XPBar';

export const Dashboard = () => {
  const { tasks, focusStreak, logMood } = useStore();
  const { user } = useAuthStore();
  const [moodLogged, setMoodLogged] = useState(false);
  const today = new Date();
  
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const highPriority = pendingTasks.filter(t => t.priority === 'high');

  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleMood = (mood: any) => {
    logMood(mood);
    setMoodLogged(true);
  };

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2"
        >
          <Sun className="w-4 h-4" />
          <span className="text-sm font-medium">{format(today, 'EEEE, MMMM do')}</span>
        </motion.div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white"
            >
              {greeting()}, {user?.name?.split(' ')[0] || 'Friend'}.
            </motion.h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Ready to level up your life today?
            </p>
          </div>
          
          <div className="w-full md:w-64">
            <XPBar />
          </div>
        </div>
      </header>

      {!moodLogged && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-indigo-100 dark:border-indigo-800">
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-3 text-center">How are you feeling right now?</h3>
            <div className="flex justify-center gap-6">
              <button onClick={() => handleMood('great')} className="text-2xl hover:scale-125 transition-transform grayscale hover:grayscale-0">🤩</button>
              <button onClick={() => handleMood('good')} className="text-2xl hover:scale-125 transition-transform grayscale hover:grayscale-0">🙂</button>
              <button onClick={() => handleMood('neutral')} className="text-2xl hover:scale-125 transition-transform grayscale hover:grayscale-0">😐</button>
              <button onClick={() => handleMood('stressed')} className="text-2xl hover:scale-125 transition-transform grayscale hover:grayscale-0">😫</button>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none relative overflow-hidden shadow-xl shadow-primary-500/20">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Focus Streak</h3>
                <p className="text-sm opacity-75">Keep the momentum going!</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <span className="text-2xl font-bold">{focusStreak}</span>
                <span className="text-xs ml-1">days</span>
              </div>
            </div>
            <Link to="/focus">
              <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                Start Focus Session
              </Button>
            </Link>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </Card>

        <Card className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white border-none relative overflow-hidden shadow-xl shadow-secondary-500/20">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Brain Dump</h3>
                <p className="text-sm opacity-75">Clear your mind instantly.</p>
              </div>
              <BrainCircuit className="w-8 h-8 opacity-50" />
            </div>
            <Link to="/brain-dump">
              <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                Unload Thoughts
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Priority Tasks</h2>
          <Link to="/tasks" className="text-primary-500 text-sm font-medium flex items-center hover:underline">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-3">
          {highPriority.length > 0 ? (
            highPriority.slice(0, 3).map((task) => (
              <Card key={task.id} className="flex items-center gap-3 p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-red-500">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200">{task.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">High Priority</p>
                </div>
                <Link to="/tasks">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center text-slate-500 border-dashed bg-slate-50/50 dark:bg-slate-800/50">
              <p>No high priority tasks. Enjoy the calm!</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};
