import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Share2, Gift, Copy, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const Referrals = () => {
  const { stats, addReferral } = useStore();
  const referralLink = "https://brainy.app/invite/u/" + stats.name.toLowerCase().replace(' ', '');

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied!");
  };

  const handleSimulateReferral = () => {
    addReferral();
    toast.success("New user joined via your link! (+200 XP)");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Invite Friends, Earn Perks</h1>
        <p className="text-slate-500">Help your friends get organized and unlock premium features for yourself.</p>
      </div>

      <Card className="p-8 bg-gradient-to-r from-primary-500 to-indigo-600 text-white border-none text-center">
        <Gift className="w-16 h-16 mx-auto mb-4 text-white/80" />
        <h2 className="text-2xl font-bold mb-2">Give 1 Month, Get 1 Month</h2>
        <p className="opacity-90 mb-6">For every friend who joins Brainy Pro, you both get a free month of Premium.</p>
        
        <div className="flex gap-2 max-w-md mx-auto bg-white/10 p-2 rounded-xl backdrop-blur-sm">
          <input 
            readOnly 
            value={referralLink}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50 text-sm px-2"
          />
          <Button size="sm" onClick={handleCopy} className="bg-white text-primary-600 hover:bg-white/90 border-none">
            <Copy className="w-4 h-4 mr-1" /> Copy
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-primary-500">{stats.referrals}</div>
          <div className="text-xs text-slate-500 uppercase font-bold">Friends Invited</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-yellow-500">{stats.referrals * 200}</div>
          <div className="text-xs text-slate-500 uppercase font-bold">XP Earned</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-green-500">{Math.floor(stats.referrals / 3)}</div>
          <div className="text-xs text-slate-500 uppercase font-bold">Free Months</div>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={handleSimulateReferral} className="text-slate-400 text-xs">
          (Simulate Referral Join)
        </Button>
      </div>
    </div>
  );
};
