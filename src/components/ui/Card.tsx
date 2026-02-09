import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
