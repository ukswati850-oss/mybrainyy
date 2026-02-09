import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Globe, Trophy, Users, Flame, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Community = () => {
  const { challenges, joinChallenge, stats } = useStore();

  const handleJoin = (id: string) => {
    joinChallenge(id);
    toast.success("Challenge joined! Good luck.");
  };

  return (
    <div className="space-y-8">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Community Hub</h1>
        <p className="text-slate-500">Join thousands of others building a better life.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 p-6">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Active Challenges
          </h3>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <motion.div 
                key={challenge.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{challenge.title}</h4>
                  <p className="text-sm text-slate-500 mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {challenge.participants} joined
                    </span>
                    <span className="text-yellow-500">+{challenge.rewardXP} XP</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleJoin(challenge.id)}
                  disabled={challenge.joined}
                  variant={challenge.joined ? 'secondary' : 'primary'}
                >
                  {challenge.joined ? 'Joined' : 'Join'}
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
            <h3 className="font-bold text-lg mb-2">Global Leaderboard</h3>
            <div className="space-y-4">
              {[
                { name: 'Alex M.', xp: 12500, rank: 1 },
                { name: 'Sarah K.', xp: 11200, rank: 2 },
                { name: 'You', xp: stats.xp, rank: 145 },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {user.rank}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <span className="text-sm font-bold opacity-80">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-1">Focus Rooms</h3>
            <p className="text-xs text-slate-500 mb-4">Work alongside others silently.</p>
            <Button variant="outline" className="w-full">
              Enter Room <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
