import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Check, Circle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { breakDownGoal } from '../services/aiService';
import toast from 'react-hot-toast';

export const Tasks = () => {
  const { tasks, toggleTaskStatus, deleteTask, addTask } = useStore();
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'todo') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      priority: 'medium'
    });
    setNewTaskTitle('');
    toast.success('Task added');
  };

  const handleMagicBreakdown = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Enter a big goal first!");
      return;
    }
    setIsBreakingDown(true);
    try {
      const steps = await breakDownGoal(newTaskTitle);
      steps.forEach(step => addTask(step));
      setNewTaskTitle('');
      toast.success(`Goal broken down into ${steps.length} steps!`);
    } catch (e) {
      toast.error("Failed to break down goal.");
    } finally {
      setIsBreakingDown(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tasks</h1>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(['all', 'todo', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium capitalize transition-all",
                filter === f 
                  ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <form onSubmit={handleAddTask} className="relative">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task or big goal..."
          className="w-full p-4 pr-32 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
        />
        <div className="absolute right-2 top-2 flex gap-1">
           <Button 
            type="button"
            variant="ghost" 
            size="sm"
            onClick={handleMagicBreakdown}
            disabled={isBreakingDown || !newTaskTitle}
            className="text-secondary-500 hover:bg-secondary-50"
            title="AI Break Down"
          >
             {isBreakingDown ? <div className="animate-spin w-4 h-4 border-2 border-secondary-500 border-t-transparent rounded-full" /> : "✨ Break"}
          </Button>
          <Button type="submit" size="sm" className="rounded-xl">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        <AnimatePresence mode='popLayout'>
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-400"
            >
              <Check className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No tasks found. Enjoy your day!</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group"
              >
                <Card className={cn(
                  "flex items-center gap-4 p-4 transition-all hover:shadow-md",
                  task.status === 'done' && "opacity-60 bg-slate-50 dark:bg-slate-800/50"
                )}>
                  <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      task.status === 'done' 
                        ? "bg-primary-500 border-primary-500 text-white" 
                        : "border-slate-300 text-transparent hover:border-primary-400"
                    )}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium truncate transition-all",
                      task.status === 'done' ? "text-slate-500 line-through decoration-slate-400" : "text-slate-800 dark:text-slate-200"
                    )}>
                      {task.title}
                    </h3>
                    {task.priority === 'high' && task.status !== 'done' && (
                      <span className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> High Priority
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
