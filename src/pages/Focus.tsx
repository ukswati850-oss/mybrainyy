import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export const Focus = () => {
  const { preferences, focusStreak, incrementFocusStreak } = useStore();
  const [timeLeft, setTimeLeft] = useState(preferences.focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? preferences.focusDuration * 60 : 5 * 60);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        toast.success("Focus session complete! Take a break.");
        incrementFocusStreak();
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        toast("Break over! Ready to focus?", { icon: '🔔' });
        setMode('focus');
        setTimeLeft(preferences.focusDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, preferences.focusDuration, incrementFocusStreak]);

  const progress = ((mode === 'focus' ? preferences.focusDuration * 60 : 5 * 60) - timeLeft) / (mode === 'focus' ? preferences.focusDuration * 60 : 5 * 60) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {mode === 'focus' ? 'Deep Focus' : 'Chill Break'}
        </h1>
        <p className="text-slate-500">
          {mode === 'focus' ? 'Stay with the task. You got this.' : 'Breathe. Stretch. Relax.'}
        </p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Circular Progress Background */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className={cn(
              "transition-all duration-1000 ease-linear",
              mode === 'focus' ? "text-primary-500" : "text-accent-500"
            )}
            strokeLinecap="round"
          />
        </svg>

        <div className="text-center z-10">
          <motion.div 
            key={timeLeft}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-6xl font-bold text-slate-800 dark:text-white tabular-nums tracking-tight"
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={toggleTimer}
          size="lg"
          className={cn(
            "w-32 rounded-full",
            isActive ? "bg-slate-200 text-slate-800 hover:bg-slate-300" : "bg-primary-500 text-white"
          )}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>
        <Button 
          variant="ghost" 
          onClick={resetTimer}
          className="rounded-full w-14 h-14 p-0 border-2 border-slate-200"
        >
          <RotateCcw className="w-5 h-5 text-slate-400" />
        </Button>
      </div>

      <div className="flex items-center gap-2 text-slate-500 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
        <Flame className={cn("w-5 h-5", focusStreak > 0 ? "text-orange-500" : "text-slate-400")} />
        <span className="font-medium">{focusStreak} day streak</span>
      </div>
    </div>
  );
};
