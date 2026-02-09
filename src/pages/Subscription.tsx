import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, Crown, Zap, Star, Building2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const Subscription = () => {
  const { upgradeSubscription, stats } = useStore();

  const handleUpgrade = (tier: 'pro' | 'elite' | 'enterprise') => {
    upgradeSubscription(tier);
    toast.success(`Welcome to Brainy ${tier.toUpperCase()}!`);
  };

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: '$0',
      features: ['Basic Task Management', 'Brain Dump', 'Habit Tracking (3 habits)', 'Standard Focus Timer'],
      color: 'bg-slate-100 dark:bg-slate-800',
      btn: 'Current Plan'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9/mo',
      features: ['Unlimited Habits', 'AI Automation Hub', 'Advanced Analytics', 'Dark Mode Customization'],
      color: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200',
      popular: true,
      btn: 'Upgrade to Pro'
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '$19/mo',
      features: ['Everything in Pro', 'AI Life Coach', 'Money & Income Hub', 'Persona Modes (Hustler/Student)', 'Priority Support'],
      color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200',
      btn: 'Become Elite'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49/mo',
      features: ['Everything in Elite', 'Team Workspaces', 'AI Project Manager', 'Advanced Team Analytics', 'API Access'],
      color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200',
      btn: 'Get Enterprise'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Upgrade your Brain</h1>
        <p className="text-slate-500 max-w-lg mx-auto">Unlock the full potential of your AI assistant. Invest in your productivity today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative p-6 flex flex-col ${plan.color} ${plan.id === stats.subscriptionTier ? 'ring-2 ring-primary-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                MOST POPULAR
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <div className="text-3xl font-bold mt-2">{plan.price}</div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.id === 'elite' || plan.id === 'enterprise' ? 'primary' : 'outline'}
              className="w-full"
              disabled={stats.subscriptionTier === plan.id}
              onClick={() => plan.id !== 'free' && handleUpgrade(plan.id as any)}
            >
              {stats.subscriptionTier === plan.id ? 'Active' : plan.btn}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
