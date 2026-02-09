import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { analyzeBrainDump } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const BrainDump = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ summary: string; nextStep: string } | null>(null);
  const { addBrainDump } = useStore();

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await analyzeBrainDump(input);
      addBrainDump(input, response.summary, response.tasks);
      setResult({ summary: response.summary, nextStep: response.nextStep });
      setInput('');
      toast.success("Thoughts organized successfully!");
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Brain Dump</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Type out everything that's on your mind. Messy is good. We'll sort it out.
        </p>
      </header>

      <Card className="p-0 overflow-hidden border-2 border-primary-100 dark:border-slate-700 focus-within:border-primary-500 transition-colors">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I'm feeling stressed about the deadline next week and I haven't bought groceries and I need to call mom..."
          className="w-full h-48 p-6 resize-none outline-none bg-transparent text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
        />
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-700">
          <span className="text-xs text-slate-400">
            {input.length} characters
          </span>
          <Button 
            onClick={handleAnalyze} 
            isLoading={isAnalyzing}
            disabled={!input.trim()}
            className="rounded-full px-6"
          >
            <Sparkles className="w-4 h-4" />
            Clarity
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800">
              <h3 className="text-secondary-700 dark:text-secondary-300 font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Insight
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.summary}
              </p>
            </Card>

            <Card className="bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800">
              <h3 className="text-accent-700 dark:text-accent-300 font-semibold mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Recommended Next Step
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">
                {result.nextStep}
              </p>
            </Card>
            
            <div className="flex justify-center">
              <Button variant="ghost" onClick={() => setResult(null)}>
                Start New Dump
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
