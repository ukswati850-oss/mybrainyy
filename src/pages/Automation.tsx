import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mail, BookOpen, Calendar, Wand2, Copy, Check } from 'lucide-react';
import { generateAutomation } from '../services/aiService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Automation = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'study' | 'plan'>('email');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tools = [
    { id: 'email', icon: Mail, label: 'Email Writer', desc: 'Draft professional emails instantly.' },
    { id: 'study', icon: BookOpen, label: 'Study Plan', desc: 'Get a structured learning schedule.' },
    { id: 'plan', icon: Calendar, label: 'Project Planner', desc: 'Break down projects into steps.' },
  ];

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setIsLoading(true);
    setOutput('');
    try {
      const result = await generateAutomation(activeTab, context);
      setOutput(result);
    } catch (e) {
      toast.error("Failed to generate.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Automation Hub</h1>
        <p className="text-slate-500">Let AI handle the boring stuff.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => { setActiveTab(tool.id as any); setOutput(''); setContext(''); }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeTab === tool.id 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${activeTab === tool.id ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              <tool.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">{tool.label}</h3>
            <p className="text-xs text-slate-500 mt-1">{tool.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full flex flex-col">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary-500" />
            Input Context
          </h3>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={
              activeTab === 'email' ? "e.g., Asking my boss for a raise because I completed the X project..." :
              activeTab === 'study' ? "e.g., Biology exam on Photosynthesis next Monday..." :
              "e.g., Launching a new Shopify store..."
            }
            className="flex-1 w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 resize-none outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px]"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={!context.trim() || isLoading}
            className="mt-4 w-full"
          >
            {isLoading ? "Generating..." : "Generate Magic"}
          </Button>
        </Card>

        <Card className="h-full flex flex-col bg-slate-50 dark:bg-slate-800/50 border-dashed">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">AI Output</h3>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            )}
          </div>
          
          <div className="flex-1 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-h-[200px] whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm leading-relaxed overflow-y-auto max-h-[400px]">
            {output ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {output}
              </motion.div>
            ) : (
              <span className="text-slate-400 italic">Result will appear here...</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
