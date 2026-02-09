import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Target, Plus, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { generateId } from '../lib/utils';
import toast from 'react-hot-toast';

export const Goals = () => {
  const { goals, addGoal, toggleGoalMilestone, deleteGoal } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones = milestonesInput.split('\n').filter(m => m.trim()).map(m => ({
      id: generateId(),
      title: m.trim(),
      isCompleted: false
    }));

    addGoal({
      title,
      description: 'Long term goal',
      category: 'personal',
      milestones: milestones.length > 0 ? milestones : [{ id: generateId(), title: 'Start working on it', isCompleted: false }]
    });

    setTitle('');
    setMilestonesInput('');
    setIsAdding(false);
    toast.success('Goal set! Go get it.');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Goal Engine</h1>
          <p className="text-slate-500">Turn dreams into actionable milestones.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Set Goal
        </Button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="mb-6 border-2 border-primary-100 dark:border-primary-900/30">
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Title</label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Run a Marathon"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Milestones (one per line)</label>
                  <textarea
                    value={milestonesInput}
                    onChange={e => setMilestonesInput(e.target.value)}
                    placeholder="Run 5k&#10;Run 10k&#10;Run Half Marathon"
                    className="w-full p-3 h-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button type="submit">Create Goal</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {goals.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <Target className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p>No active goals. Dream big!</p>
          </div>
        ) : (
          goals.map(goal => (
            <Card key={goal.id} className="overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{goal.title}</h3>
                  <p className="text-sm text-slate-500">{goal.milestones.filter(m => m.isCompleted).length} / {goal.milestones.length} milestones</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{goal.progress}%</div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
                />
              </div>

              <div className="space-y-2">
                {goal.milestones.map(milestone => (
                  <div 
                    key={milestone.id} 
                    onClick={() => toggleGoalMilestone(goal.id, milestone.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                      milestone.isCompleted 
                        ? "bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300" 
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    <CheckCircle2 className={cn("w-5 h-5", milestone.isCompleted ? "fill-primary-500 text-white" : "text-slate-300")} />
                    <span className={cn("font-medium", milestone.isCompleted && "line-through opacity-70")}>{milestone.title}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
