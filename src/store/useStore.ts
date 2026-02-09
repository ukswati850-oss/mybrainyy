import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, UserPreferences, BrainDumpEntry, Habit, Goal, MoodLog, UserStats, IncomeEntry, LearningResource, SubscriptionTier, Team, Integration, Challenge } from '../types';
import { generateId } from '../lib/utils';

interface AppState {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  moodLogs: MoodLog[];
  brainDumps: BrainDumpEntry[];
  preferences: UserPreferences;
  stats: UserStats;
  focusStreak: number;
  
  // Phase 3 Data
  incomeEntries: IncomeEntry[];
  learningResources: LearningResource[];

  // Phase 4 Data
  teams: Team[];
  currentTeamId: string | null;
  integrations: Integration[];
  challenges: Challenge[];
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;

  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;

  logMood: (mood: MoodLog['mood'], note?: string, energy?: number, sleep?: number) => void;

  addBrainDump: (content: string, aiResponse?: string, extractedTasks?: Task[]) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  
  incrementFocusStreak: () => void;
  addXP: (amount: number) => void;
  
  // Phase 3 Actions
  upgradeSubscription: (tier: SubscriptionTier) => void;
  addIncome: (entry: Omit<IncomeEntry, 'id'>) => void;
  addLearningResource: (resource: Omit<LearningResource, 'id'>) => void;

  // Phase 4 Actions
  createTeam: (name: string) => void;
  joinChallenge: (id: string) => void;
  toggleIntegration: (id: string) => void;
  addReferral: () => void;
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      habits: [],
      goals: [],
      moodLogs: [],
      brainDumps: [],
      incomeEntries: [],
      learningResources: [],
      preferences: {
        theme: 'system',
        name: 'Friend',
        focusDuration: 25,
        persona: 'general',
        coachingStyle: 'supportive'
      },
      stats: {
        xp: 0,
        level: 1,
        tasksCompleted: 0,
        focusMinutes: 0,
        badges: [],
        subscriptionTier: 'free',
        referrals: 0,
        socialScore: 0
      },
      focusStreak: 0,
      
      // Phase 4 Initial State
      teams: [],
      currentTeamId: null,
      integrations: [
        { id: '1', name: 'Google Calendar', type: 'calendar', isConnected: false, icon: 'calendar' },
        { id: '2', name: 'Slack', type: 'communication', isConnected: false, icon: 'message-circle' },
        { id: '3', name: 'Notion', type: 'productivity', isConnected: false, icon: 'file-text' },
        { id: '4', name: 'Spotify', type: 'productivity', isConnected: false, icon: 'music' },
      ],
      challenges: [
        { id: '1', title: '7-Day Focus Streak', description: 'Focus for at least 25 mins every day for a week.', participants: 1240, rewardXP: 500, joined: false },
        { id: '2', title: 'Early Bird', description: 'Complete a task before 8 AM for 3 days.', participants: 850, rewardXP: 300, joined: false },
        { id: '3', title: 'Weekend Warrior', description: 'Log 4 hours of focus this weekend.', participants: 2100, rewardXP: 1000, joined: false },
      ],

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: generateId(), createdAt: new Date(), status: 'todo' }]
      })),

      toggleTaskStatus: (id) => {
        const state = get();
        const task = state.tasks.find(t => t.id === id);
        if (task && task.status !== 'done') {
          state.addXP(10); 
          set(s => ({ stats: { ...s.stats, tasksCompleted: s.stats.tasksCompleted + 1 } }));
        }
        
        set((state) => ({
          tasks: state.tasks.map((t) => 
            t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
          )
        }));
      },

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),

      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, { ...habit, id: generateId(), streak: 0, completedDates: [] }]
      })),

      toggleHabitCompletion: (id, date) => {
        const state = get();
        const habit = state.habits.find(h => h.id === id);
        if (!habit) return;

        const isCompleted = habit.completedDates.includes(date);
        let newDates = isCompleted 
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date];
        
        let streak = newDates.length; 

        if (!isCompleted) {
          state.addXP(15);
        }

        set((state) => ({
          habits: state.habits.map(h => h.id === id ? { ...h, completedDates: newDates, streak } : h)
        }));
      },

      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id)
      })),

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: generateId(), progress: 0 }]
      })),

      toggleGoalMilestone: (goalId, milestoneId) => {
        const state = get();
        const goal = state.goals.find(g => g.id === goalId);
        if (!goal) return;

        const updatedMilestones = goal.milestones.map(m => 
          m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
        );

        const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);

        if (progress > goal.progress) {
          state.addXP(50);
        }

        set((state) => ({
          goals: state.goals.map(g => g.id === goalId ? { ...g, milestones: updatedMilestones, progress } : g)
        }));
      },

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),

      logMood: (mood, note, energy, sleep) => set((state) => ({
        moodLogs: [...state.moodLogs, { id: generateId(), date: new Date().toISOString(), mood, note, energyLevel: energy, sleepHours: sleep }]
      })),

      addBrainDump: (content, aiResponse, extractedTasks) => set((state) => {
        const newTasks = extractedTasks || [];
        return {
          brainDumps: [{
            id: generateId(),
            content,
            aiResponse,
            createdAt: new Date(),
            extractedTasks: newTasks
          }, ...state.brainDumps],
          tasks: [...state.tasks, ...newTasks]
        };
      }),

      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),

      incrementFocusStreak: () => {
        const state = get();
        state.addXP(20);
        set((state) => ({
          focusStreak: state.focusStreak + 1,
          stats: { ...state.stats, focusMinutes: state.stats.focusMinutes + state.preferences.focusDuration }
        }));
      },
      
      addXP: (amount) => set((state) => {
        const newXP = state.stats.xp + amount;
        let newLevel = state.stats.level;
        
        if (newLevel < LEVEL_THRESHOLDS.length && newXP >= LEVEL_THRESHOLDS[newLevel]) {
          newLevel++;
        }

        return {
          stats: { ...state.stats, xp: newXP, level: newLevel }
        };
      }),

      upgradeSubscription: (tier) => set((state) => ({
        stats: { ...state.stats, subscriptionTier: tier }
      })),

      addIncome: (entry) => set((state) => ({
        incomeEntries: [{ ...entry, id: generateId() }, ...state.incomeEntries]
      })),

      addLearningResource: (resource) => set((state) => ({
        learningResources: [{ ...resource, id: generateId() }, ...state.learningResources]
      })),

      // Phase 4 Actions
      createTeam: (name) => set((state) => {
        const newTeam: Team = {
          id: generateId(),
          name,
          members: [{ id: 'me', name: state.preferences.name, role: 'owner' }],
          projects: []
        };
        return {
          teams: [...state.teams, newTeam],
          currentTeamId: newTeam.id
        };
      }),

      joinChallenge: (id) => set((state) => ({
        challenges: state.challenges.map(c => c.id === id ? { ...c, joined: true, participants: c.participants + 1 } : c)
      })),

      toggleIntegration: (id) => set((state) => ({
        integrations: state.integrations.map(i => i.id === id ? { ...i, isConnected: !i.isConnected } : i)
      })),

      addReferral: () => set((state) => ({
        stats: { ...state.stats, referrals: state.stats.referrals + 1, xp: state.stats.xp + 200 }
      })),
    }),
    {
      name: 'brainy-storage-v4',
    }
  )
);
