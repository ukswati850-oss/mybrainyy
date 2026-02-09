import React from 'react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

export const XPBar = () => {
  const { stats } = useStore();
  
  const currentLevelXP = LEVEL_THRESHOLDS[stats.level - 1] || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[stats.level] || 10000;
  const progress = Math.min(100, Math.max(0, ((stats.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1.5 rounded-lg text-yellow-600 dark:text-yellow-400">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">Level {stats.level}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
          <Star className="w-3 h-3 text-primary-500 fill-primary-500" />
          <span>{stats.xp} XP</span>
        </div>
      </div>
      
      <div className="relative h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-medium">
        <span>{stats.xp - currentLevelXP} / {nextLevelXP - currentLevelXP} to next level</span>
      </div>
    </div>
  );
};
