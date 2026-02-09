import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Flame, Check, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const Habits = () => {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    addHabit({
      title: newHabit,
      frequency: 'daily',
      category: 'productivity'
    });
    setNewHabit('');
    setIsAdding(false);
    toast.success('Habit created!');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Habit Builder</h1>
          <p className="text-slate-500">Consistency is the key to success.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="w-4 h-4 mr-1" /> New Habit
        </Button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="e.g., Read for 20 mins..."
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <Button type="submit">Add</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-3">
        {habits.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 border-dashed">
            <Flame className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No habits yet. Start small!</p>
          </Card>
        ) : (
          habits.map((habit) => {
            const isDoneToday = habit.completedDates.includes(today);
            return (
              <motion.div key={habit.id} layout>
                <Card className={cn(
                  "flex items-center justify-between p-4 transition-all border-l-4",
                  isDoneToday ? "border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10" : "border-l-slate-200 dark:border-l-slate-700"
                )}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleHabitCompletion(habit.id, today)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        isDoneToday 
                          ? "bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-110" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      )}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className={cn("font-semibold text-lg", isDoneToday ? "text-primary-900 dark:text-primary-100" : "text-slate-700 dark:text-slate-200")}>
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1 text-orange-500">
                          <Flame className="w-3 h-3 fill-orange-500" />
                          {habit.streak} day streak
                        </span>
                        <span>• {habit.frequency}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
