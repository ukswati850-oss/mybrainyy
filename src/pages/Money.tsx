import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DollarSign, TrendingUp, Plus, Briefcase } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateSideHustleIdeas } from '../services/aiService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Money = () => {
  const { incomeEntries, addIncome, stats } = useStore();
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'active' | 'passive' | 'expense'>('active');
  const [ideaInterest, setIdeaInterest] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (stats.subscriptionTier !== 'elite') {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Hustler Mode Locked</h2>
        <p className="text-slate-500 mb-6">Upgrade to Elite to track income and generate business ideas.</p>
        <Button onClick={() => window.location.href = '/subscription'}>Upgrade Now</Button>
      </div>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title) return;
    addIncome({
      title,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString(),
      category: 'General'
    });
    setAmount('');
    setTitle('');
    toast.success('Transaction added');
  };

  const handleGenerateIdeas = async () => {
    if (!ideaInterest) return;
    setIsGenerating(true);
    const results = await generateSideHustleIdeas(ideaInterest);
    setIdeas(results);
    setIsGenerating(false);
  };

  const totalIncome = incomeEntries.filter(i => i.type !== 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = incomeEntries.filter(i => i.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Money Hub</h1>
        <p className="text-slate-500">Track your empire building.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg text-green-600 dark:text-green-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-semibold text-green-900 dark:text-green-100">Total Income</span>
          </div>
          <div className="text-3xl font-bold text-green-700 dark:text-green-300">${totalIncome.toFixed(2)}</div>
        </Card>
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg text-red-600 dark:text-red-300">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="font-semibold text-red-900 dark:text-red-100">Expenses</span>
          </div>
          <div className="text-3xl font-bold text-red-700 dark:text-red-300">${totalExpense.toFixed(2)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Add Transaction</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <input 
              placeholder="Description (e.g. Freelance Client A)" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
            />
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Amount" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
              />
              <select 
                value={type} 
                onChange={e => setType(e.target.value as any)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
              >
                <option value="active">Active Income</option>
                <option value="passive">Passive Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Add Entry</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-500" />
            Side Hustle Generator
          </h3>
          <div className="flex gap-2 mb-4">
            <input 
              placeholder="Interests (e.g. coding, writing)" 
              value={ideaInterest}
              onChange={e => setIdeaInterest(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
            />
            <Button onClick={handleGenerateIdeas} disabled={isGenerating}>
              {isGenerating ? '...' : 'Generate'}
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {ideas.map((idea, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm"
              >
                {idea}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
