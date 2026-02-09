import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HeartPulse, Battery, Moon, Sun, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getLifeCoaching } from '../services/aiService';
import toast from 'react-hot-toast';

export const Coach = () => {
  const { logMood, preferences, stats } = useStore();
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  if (stats.subscriptionTier === 'free') {
    return (
      <div className="text-center py-20">
        <CrownIcon className="w-16 h-16 mx-auto mb-4 text-amber-400" />
        <h2 className="text-2xl font-bold mb-2">AI Coach Locked</h2>
        <p className="text-slate-500 mb-6">Unlock personalized life optimization with Premium.</p>
        <Button onClick={() => window.location.href = '/subscription'}>Upgrade Now</Button>
      </div>
    );
  }

  const handleCheckIn = async () => {
    setLoading(true);
    // Log the data
    logMood('neutral', 'Daily Check-in', energy, sleep);
    
    try {
      const coaching = await getLifeCoaching([], energy, preferences.persona);
      setAdvice(coaching);
      toast.success("Check-in complete");
    } catch (e) {
      toast.error("Failed to get advice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Life Coach</h1>
        <p className="text-slate-500">Optimize your energy, sleep, and performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <h3 className="font-bold text-lg">Daily Check-in</h3>
          
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Battery className="w-5 h-5 text-green-500" />
              Energy Level ({energy}/10)
            </label>
            <input 
              type="range" min="1" max="10" 
              value={energy} 
              onChange={e => setEnergy(parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Moon className="w-5 h-5 text-indigo-500" />
              Sleep Hours ({sleep}h)
            </label>
            <input 
              type="range" min="0" max="12" 
              value={sleep} 
              onChange={e => setSleep(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <Button onClick={handleCheckIn} disabled={loading} className="w-full">
            {loading ? "Analyzing..." : "Get Optimization Plan"}
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
            <h3 className="font-bold text-xl">Coach's Insight</h3>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 min-h-[150px] backdrop-blur-sm border border-white/10">
            {advice ? (
              <p className="text-lg leading-relaxed font-medium">{advice}</p>
            ) : (
              <p className="opacity-70 italic">Complete your check-in to receive personalized advice based on your {preferences.persona} persona.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

function CrownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  )
}
