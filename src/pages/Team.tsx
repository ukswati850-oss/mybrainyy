import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Plus, Layout, BarChart, Settings, Briefcase, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateTeamReport, suggestDelegation } from '../services/aiService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Team = () => {
  const { teams, createTeam, stats } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [report, setReport] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);

  if (stats.subscriptionTier !== 'enterprise' && stats.subscriptionTier !== 'elite') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Briefcase className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Team & Enterprise Mode</h1>
        <p className="text-slate-500 max-w-md mb-8">Collaborate with your team, assign tasks, and get AI project management. Upgrade to Enterprise to unlock.</p>
        <Button onClick={() => window.location.href = '/subscription'} size="lg" className="px-8">
          Upgrade to Enterprise
        </Button>
      </div>
    );
  }

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    createTeam(newTeamName);
    setNewTeamName('');
    setIsCreating(false);
    toast.success('Team workspace created!');
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    const result = await generateTeamReport(teams[0]?.name || 'My Team');
    setReport(result);
    setLoadingReport(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Team Space</h1>
          <p className="text-slate-500">Collaborate and conquer together.</p>
        </div>
        {teams.length > 0 && <Button variant="outline"><Settings className="w-4 h-4 mr-2"/> Settings</Button>}
      </header>

      {teams.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold mb-2">No Teams Yet</h3>
          <p className="text-slate-500 mb-6">Create a workspace to invite members and manage projects.</p>
          
          {isCreating ? (
            <form onSubmit={handleCreateTeam} className="max-w-sm mx-auto flex gap-2">
              <input 
                autoFocus
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="Team Name (e.g. Marketing Squad)"
                className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
              />
              <Button type="submit">Create</Button>
            </form>
          ) : (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create New Team
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{teams[0].members.length}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Members</div>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Active Projects</div>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                <BarChart className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Velocity</div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                AI Project Manager
              </h3>
              <p className="text-sm text-slate-500 mb-4">Generate weekly reports and get delegation suggestions.</p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={loadingReport}
                  className="w-full justify-start"
                  variant="outline"
                >
                  {loadingReport ? "Generating..." : "📄 Generate Weekly Report"}
                </Button>
                <Button 
                  onClick={() => toast.success("Task assigned to Sarah!")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  🤖 Auto-Assign Pending Tasks
                </Button>
              </div>

              {report && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm whitespace-pre-wrap"
                >
                  {report}
                </motion.div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Team Members</h3>
              <div className="space-y-4">
                {teams[0].members.map((member, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                        {member.name[0]}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-slate-500 capitalize">{member.role}</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">
                      Online
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-sm">Invite Member</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
