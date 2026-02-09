import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Brain, CheckSquare, Focus, User, Repeat, Target, Zap, BarChart2, DollarSign, GraduationCap, HeartPulse, Crown, Users, Globe, Share2, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar = () => {
  const { preferences, stats } = useStore();
  const { user, logout } = useAuthStore();
  const persona = preferences.persona;
  const isPremium = stats.subscriptionTier !== 'free';

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/brain-dump', icon: Brain, label: 'Brain Dump' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/habits', icon: Repeat, label: 'Habits' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/focus', icon: Focus, label: 'Focus' },
    { to: '/coach', icon: HeartPulse, label: 'AI Coach' },
    { to: '/automation', icon: Zap, label: 'Auto Hub' },
  ];

  if (persona === 'hustler') {
    links.splice(4, 0, { to: '/money', icon: DollarSign, label: 'Money Hub' });
  }
  if (persona === 'student') {
    links.splice(4, 0, { to: '/learning', icon: GraduationCap, label: 'Learning' });
  }

  const communityLinks = [
    { to: '/team', icon: Users, label: 'Team Space' },
    { to: '/community', icon: Globe, label: 'Community' },
    { to: '/referrals', icon: Share2, label: 'Refer & Earn' },
    { to: '/integrations', icon: Settings, label: 'Integrations' },
  ];

  return (
    <>
      <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 p-4 z-50 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 px-2 pt-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Brain className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">Brainy</h1>
            <span className="text-[10px] uppercase font-bold text-primary-500 tracking-wider">
              {stats.subscriptionTier === 'enterprise' ? 'Enterprise' : isPremium ? 'Premium' : 'Free'}
            </span>
          </div>
        </div>

        {/* User Mini Profile */}
        <div className="mb-6 mx-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-slate-700">
          <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full bg-white" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-col gap-1 mb-6">
          <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Personal</div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-semibold shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <link.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", ({ isActive }: { isActive: boolean }) => isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-sm">{link.label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/analytics"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
              isActive ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-semibold" : "text-slate-500 hover:bg-slate-50 dark:text-slate-400"
            )}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-sm">Analytics</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
              isActive ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-semibold" : "text-slate-500 hover:bg-slate-50 dark:text-slate-400"
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-sm">Profile</span>
          </NavLink>
        </div>

        <div className="flex flex-col gap-1 mb-6">
          <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Growth & Team</div>
          {communityLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-semibold shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <link.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", ({ isActive }: { isActive: boolean }) => isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-sm">{link.label}</span>
            </NavLink>
          ))}
        </div>

        {!isPremium && (
          <div className="mt-auto pt-4">
            <NavLink to="/subscription" className="block">
              <div className="bg-gradient-to-r from-amber-200 to-yellow-400 p-4 rounded-xl shadow-lg shadow-amber-500/20 group cursor-pointer relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                    <Crown className="w-4 h-4" />
                    <span>Go Premium</span>
                  </div>
                  <p className="text-xs text-amber-800 font-medium">Unlock Gemini AI & Money Hub</p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/30 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              </div>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
        <div className="flex justify-around items-center p-2 overflow-x-auto no-scrollbar">
          {links.slice(0, 4).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[64px]",
                isActive 
                  ? "text-primary-600 dark:text-primary-400" 
                  : "text-slate-400 dark:text-slate-500"
              )}
            >
              <link.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium truncate w-full text-center">{link.label}</span>
            </NavLink>
          ))}
          <NavLink to="/team" className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-slate-400">
             <Users className="w-6 h-6" />
             <span className="text-[10px] font-medium">Team</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};
