import React from 'react';
import { Card } from '../components/ui/Card';
import { GraduationCap, BookOpen, Video } from 'lucide-react';

export const Learning = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Learning Center</h1>
        <p className="text-slate-500">Master new skills efficiently.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-blue-500" />
          <h3 className="font-bold">Study Notes</h3>
          <p className="text-xs text-slate-500 mt-1">AI Summaries</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <Video className="w-10 h-10 mx-auto mb-3 text-red-500" />
          <h3 className="font-bold">Video Courses</h3>
          <p className="text-xs text-slate-500 mt-1">Track progress</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 text-green-500" />
          <h3 className="font-bold">Flashcards</h3>
          <p className="text-xs text-slate-500 mt-1">Active Recall</p>
        </Card>
      </div>

      <Card className="p-12 text-center border-dashed">
        <p className="text-slate-400">Add your first learning resource to get started.</p>
      </Card>
    </div>
  );
};
